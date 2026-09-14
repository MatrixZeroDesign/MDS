import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
const root = new URL("../", import.meta.url);
const catalogDir = new URL("packages/icons/catalog/", root);
const items = [];
for (const file of (await readdir(catalogDir)).filter((f) => f.endsWith(".json")).sort())
	items.push(...JSON.parse(await readFile(new URL(file, catalogDir), "utf8")));
const names = new Set();
for (const item of items) {
	if (names.has(item.name)) throw Error("Duplicate icon: " + item.name);
	if (!item.category || !item.keywords.length) throw Error("Missing metadata: " + item.name);
	names.add(item.name);
}
const exports = new Set();
const src = new URL("packages/icons/src/", root);
for (const file of (await readdir(src)).filter((f) => f.endsWith(".tsx") && f !== "runtime.tsx")) {
	const text = await readFile(new URL(file, src), "utf8");
	for (const [, name] of text.matchAll(/export const (\w+)\s*=/g)) exports.add(name);
}
if (names.size !== exports.size || [...exports].some((n) => !names.has(n)))
	throw Error("Catalog must match icon exports exactly");
items.sort((a, b) => a.name.localeCompare(b.name, "en"));
const source =
	"// Generated from packages/icons/catalog/*.json. Do not edit directly.\nexport const iconCatalog = " +
	JSON.stringify(items) +
	' as const;\nexport type IconName = (typeof iconCatalog)[number]["name"];\nexport type IconCategory = (typeof iconCatalog)[number]["category"];\n';
await writeFile(
	new URL("catalog.ts", src),
	await format(source, {
		...(await resolveConfig(fileURLToPath(new URL("package.json", root)))),
		parser: "typescript",
	}),
);
console.log("Icon catalog: " + items.length + " distinct entries");
