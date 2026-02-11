import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import type { Plugin } from "vite";

// Vite plugin för API (endast dev-mode)
function apiPlugin(): Plugin {
	return {
		name: "api-plugin",
		apply: "serve", // Endast i dev-mode
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith("/api/")) return next();

				try {
					// System Prompts API Routes (JSON)
					if (req.url.startsWith("/api/system-prompts")) {
						let body = "";
						req.on("data", chunk => { body += chunk.toString(); });
						await new Promise(resolve => req.on("end", resolve));
						const data = body ? JSON.parse(body) : {};
						
						const { listSystemPrompts, saveSystemPrompt, testSystemPrompt } = await import("./src/api/system-prompts");
						
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
					}
					// Photoroom API Routes (FormData - skicka direkt till Photoroom)
					else if (req.url.startsWith("/api/photoroom")) {
						// För Photoroom: Skicka FormData direkt från frontend till Photoroom API
						// Vite middleware kan inte hantera FormData enkelt, så vi gör ett proxy-anrop
						// Photoroom API import (för framtida användning)
						// const { createProductPhoto } = await import("./src/api/photoroom");
						
						if (req.url === "/api/photoroom/product-photo" && req.method === "POST") {
							// Samla binär data
							const chunks: Buffer[] = [];
							req.on("data", chunk => chunks.push(chunk));
							await new Promise(resolve => req.on("end", resolve));
							
							// Skicka vidare till Photoroom (hanteras i photoroom.ts)
							res.statusCode = 501;
							res.setHeader("Content-Type", "application/json");
							res.end(JSON.stringify({ 
								error: "FormData proxy inte implementerad än. Använd direkt Photoroom API-anrop från frontend." 
							}));
						}
						else {
							next();
						}
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
	plugins: [react(), cloudflare(), apiPlugin()],
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
