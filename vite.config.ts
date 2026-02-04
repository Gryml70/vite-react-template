import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
	plugins: [react(), cloudflare()],
	build: {
		// Code splitting for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					'supabase-vendor': ['@supabase/supabase-js'],
				},
			},
		},
		// Increase chunk size warning limit (optional)
		chunkSizeWarningLimit: 1000,
		// Inline small CSS to reduce render-blocking requests
		cssCodeSplit: true,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.logs in production
				drop_debugger: true,
			},
		},
	},
});
