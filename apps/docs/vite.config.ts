import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
	plugins: [react()],
	base: process.env.MDS_BASE_PATH || "/",
	resolve: {
		// The UI package intentionally pins its tested icon version. During icon
		// development, resolve the docs app against the workspace copy so newly
		// added exports do not fall back to UI's nested published dependency.
		dedupe: ["@matrixzero/icons"],
	},
	build: {
		// Brand galleries contain hundreds of small SVGs. Keep them as files so
		// browser lazy loading and cache reuse work instead of embedding every
		// drawing in the route chunk.
		assetsInlineLimit: 0,
	},
});
