import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
	plugins: [react()],
	base: process.env.MDS_BASE_PATH || "/",
	build: {
		// Brand galleries contain hundreds of small SVGs. Keep them as files so
		// browser lazy loading and cache reuse work instead of embedding every
		// drawing in the route chunk.
		assetsInlineLimit: 0,
	},
});
