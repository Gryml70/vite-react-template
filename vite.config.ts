import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import type { Plugin } from "vite";

// Vite plugin för System Prompts API (endast dev-mode)
function systemPromptsAPIPlugin(): Plugin {
	return {
		name: "system-prompts-api",
		apply: "serve", // Endast i dev-mode
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith("/api/")) return next();

				// Dynamisk import av API-funktioner
				const { listSystemPrompts, saveSystemPrompt, testSystemPrompt } = await import("./src/api/system-prompts");

				try {
					let body = "";
					req.on("data", chunk => { body += chunk.toString(); });
					await new Promise(resolve => req.on("end", resolve));
					const data = body ? JSON.parse(body) : {};

					// System Prompts API Routes
					if (req.url === "/api/system-prompts/list" && req.method === "GET") {
						const prompts = listSystemPrompts();
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ prompts }));
					}
					else if (req.url === "/api/system-prompts/save" && req.method === "POST") {
						const result = saveSystemPrompt(data.name || "", data.content || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify(result));
					}
					else if (req.url === "/api/system-prompts/test" && req.method === "POST") {
						const response = await testSystemPrompt(data.systemPrompt || "", data.userMessage || "");
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ response }));
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
	plugins: [react(), cloudflare(), systemPromptsAPIPlugin()],
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
