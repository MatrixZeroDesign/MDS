import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
// Mirror the runtime spread order so language overlays are audited as rendered.
const runtime = fs.readFileSync("apps/docs/src/i18n/index.ts", "utf8");
const imports = new Map([...runtime.matchAll(/import (\w+) from "\.\/([^"]+\.json)"/g)].map((m) => [m[1], m[2]]));
const spreads = runtime.match(/const catalog = \{([\s\S]*?)\}/)?.[1] ?? "";
const catalog = Object.assign(
	{},
	...[...spreads.matchAll(/\.\.\.(\w+)/g)].map((m) =>
		JSON.parse(fs.readFileSync(path.join("apps/docs/src/i18n", imports.get(m[1])), "utf8")),
	),
);
const keys = new Map();
const add = (key, file) => {
	if (!key.trim()) return;
	keys.set(key, [...(keys.get(key) || []), file]);
};
function visitDir(dir) {
	for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
		const file = path.join(dir, item.name);
		if (item.isDirectory() && !file.includes("/i18n")) visitDir(file);
		else if (/\.tsx?$/.test(file)) {
			const src = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
			function visit(node) {
				if (
					ts.isArrayLiteralExpression(node) &&
					node.elements.length === 2 &&
					node.elements.every(ts.isStringLiteral) &&
					/[\u3400-\u9fff]/.test(node.elements[0].text)
				)
					add(node.elements[1].text, file);
				if (ts.isCallExpression(node)) {
					const name = node.expression.getText(src);
					const ix = name === "translate" ? 2 : name === "t" ? 1 : -1;
					const arg = node.arguments[ix];
					if (ix >= 0 && arg && ts.isStringLiteral(arg)) add(arg.text, file);
				}
				ts.forEachChild(node, visit);
			}
			visit(src);
		}
	}
}
visitDir("apps/docs/src");
for (const entry of JSON.parse(fs.readFileSync("docs/content.json", "utf8")))
	for (const field of ["purpose", "guide", "a11y", "pitfalls"])
		add(entry[field]?.split(" / ")[1] ?? "", `docs/content.json:${entry.slug}:${field}`);
for (const [slug, variants] of Object.entries(
	JSON.parse(fs.readFileSync("apps/docs/src/exampleVariants.json", "utf8")),
))
	for (const variant of variants) add(variant.title?.[1] ?? "", `apps/docs/src/exampleVariants.json:${slug}`);

const componentNamesSource = fs.readFileSync("apps/docs/src/componentNames.ts", "utf8");
const entries = new Map(JSON.parse(fs.readFileSync("docs/content.json", "utf8")).map((entry) => [entry.slug, entry]));
for (const match of componentNamesSource.matchAll(/^\s*(?:"([^"]+)"|([\w-]+)):\s*"[^"]+",/gm)) {
	const slug = match[1] || match[2];
	const entry = entries.get(slug);
	if (entry) add(slug === "icons" ? "Icons" : entry.names[0], "apps/docs/src/componentNames.ts");
}
const missing = [...keys]
	.filter(([key]) => !catalog[key] || catalog[key].length !== 5 || catalog[key].some((v) => !v))
	.map(([key, files]) => ({ key, files: [...new Set(files)] }));
console.log(
	JSON.stringify(
		{
			total: keys.size,
			translated: keys.size - missing.length,
			missing: missing.length,
			locales: ["ja", "ko", "fr", "es", "ar"],
			note: "Static translation calls, bilingual metadata arrays and component guide prose; excludes dynamic templates and literal JSX.",
		},
		null,
		2,
	),
);
if (process.argv.includes("--details")) console.log(JSON.stringify(missing, null, 2));
if (process.argv.includes("--check")) {
	const baseline = new Map(
		JSON.parse(fs.readFileSync("scripts/i18n-baseline.json", "utf8")).map(({ key, files }) => [key, new Set(files)]),
	);
	const regressions = missing.filter(
		({ key, files }) => !baseline.has(key) || files.some((file) => !baseline.get(key).has(file)),
	);
	if (regressions.length) {
		console.error("New or incomplete i18n entries:\n" + JSON.stringify(regressions, null, 2));
		process.exitCode = 1;
	} else {
		console.log(`i18n gate passed; ${missing.length} known gaps remain in the baseline.`);
	}
}
