import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import type { Plugin } from "vite";

// Vite plugin för Skrivregler API (endast dev-mode)
function skrivreglerAPIPlugin(): Plugin {
	return {
		name: "skrivregler-api",
		apply: "serve", // Endast i dev-mode
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith("/api/")) return next();

				// Dynamisk import av API-funktioner
				const { readSEORules, saveSEORules, createRule, generateContent, validateContent } = await import("./src/api/skrivregler");

				try {
					let body = "";
					req.on("data", chunk => { body += chunk.toString(); });
					await new Promise(resolve => req.on("end", resolve));
					const data = body ? JSON.parse(body) : {};

					// Routes
					if (req.url === "/api/seo-rules" && req.method === "GET") {
						const content = readSEORules();
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ content }));
					} 
					else if (req.url === "/api/seo-rules/save" && req.method === "POST") {
						const result = saveSEORules(data.text || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify(result));
					}
					else if (req.url === "/api/ai/create-rule" && req.method === "POST") {
						const content = await createRule(data.question || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ content }));
					}
					else if (req.url === "/api/ai/generate" && req.method === "POST") {
						const content = await generateContent(data.prompt || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ content }));
					}
					else if (req.url === "/api/ai/validate" && req.method === "POST") {
						const content = await validateContent(data.content || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ content }));
					}
					else {
						next();
					}
				} catch (err: any) {
					res.statusCode = 500;
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify({ error: err.message }));
				}
			});
		},
	};
}

// Force rebuild update: 1.0.3
export default defineConfig({
	plugins: [react(), cloudflare(), skrivreglerAPIPlugin()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					'supabase-vendor': ['@supabase/supabase-js'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
		cssCodeSplit: true,
		minify: 'esbuild',
	},
});
