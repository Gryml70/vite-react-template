import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// Force rebuild update: 1.0.1
export default defineConfig({
	plugins: [react(), cloudflare()],
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
