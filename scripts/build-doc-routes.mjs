import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const entries = JSON.parse(await readFile(resolve(root, "docs/content.json"), "utf8"));
const catalog = await readFile(resolve(root, "apps/docs/src/showcases/catalog.ts"), "utf8");
const routes = new Set([
	"design",
	"home",
	"docs",
	"system",
	"theme-builder",
	"charts",
	"icons",
	"overview",
	"policy",
	"showcase",
	"docs/start",
	"docs/alert",
	"docs/theme-motion",
	...entries.map((e) => "docs/" + e.slug),
	...entries.filter((e) => e.package === "charts").map((e) => "charts/" + e.slug),
	...Array.from(catalog.matchAll(/id:\s*"(showcase-[^"]+)"/g), (m) => m[1]),
]);
const html = await readFile(resolve(root, "apps/docs/dist/index.html"), "utf8");
for (const route of routes) {
	const dir = resolve(root, "apps/docs/dist", route);
	await mkdir(dir, { recursive: true });
	await writeFile(resolve(dir, "index.html"), html);
}
await writeFile(resolve(root, "apps/docs/dist/404.html"), html);
console.log("Generated static entry pages for", routes.size, "routes.");
