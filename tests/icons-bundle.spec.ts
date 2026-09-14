import { test, expect } from "@playwright/test";
import { build } from "vite";
import { resolve } from "node:path";
test("a single icon import excludes the rest of the collection", async () => {
	const result = await build({
		configFile: false,
		logLevel: "silent",
		plugins: [
			{
				name: "single-icon-fixture",
				resolveId(id) {
					if (id.endsWith("virtual:one-icon")) return id;
				},
				load(id) {
					if (id.endsWith("virtual:one-icon"))
						return "export { Search } from " + JSON.stringify(resolve("packages/icons/dist/index.js")) + ";";
				},
			},
		],
		build: {
			write: false,
			minify: true,
			lib: { entry: "virtual:one-icon", formats: ["es"] },
			rollupOptions: { external: ["react", "react/jsx-runtime"] },
		},
	});
	const builds = Array.isArray(result) ? result : [result];
	let bytes = 0;
	for (const output of builds)
		if ("output" in output)
			for (const file of output.output) if (file.type === "chunk") bytes += Buffer.byteLength(file.code);
	expect(bytes).toBeGreaterThan(100);
	expect(bytes).toBeLessThan(5000);
});
