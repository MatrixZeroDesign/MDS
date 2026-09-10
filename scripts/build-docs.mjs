import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";
const root = resolve(import.meta.dirname, "..");
const read = (p) => readFile(resolve(root, p), "utf8");
const output = async (p, text) => {
	await mkdir(resolve(root, p, ".."), { recursive: true });
	await writeFile(resolve(root, p), text);
};
await rm(resolve(root, "apps/docs/public/docs"), { recursive: true, force: true });
const entries = JSON.parse(await read("docs/content.json"));
const versions = Object.fromEntries(
	await Promise.all(
		["ui", "icons", "charts"].map(async (name) => [
			name,
			JSON.parse(await read(`packages/${name}/package.json`)).version,
		]),
	),
);
const covered = new Set(entries.filter((e) => e.package === "ui").flatMap((e) => e.names));
for (const file of ["theme", "controls", "overlays", "navigation", "display"]) {
	const source = ts.createSourceFile(
		file,
		await read(`packages/ui/src/${file}.tsx`),
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	for (const statement of source.statements) {
		if (!statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
		const names = ts.isFunctionDeclaration(statement)
			? [statement.name?.text]
			: ts.isVariableStatement(statement)
				? statement.declarationList.declarations.map((d) => d.name.getText(source))
				: [];
		for (const name of names)
			if (name && /^[A-Z]/.test(name) && !covered.has(name)) throw Error(`Missing component guide: ${name}`);
	}
}
const paths = [];
for (const entry of entries) {
	const code = await read(`apps/docs/src/examples/${entry.slug}.tsx`);
	const text = `# ${entry.slug === "icons" ? "Icons" : entry.names.join(" / ")}\n\nPackage: @matrixzero/${entry.package}@${versions[entry.package]}\n\n${entry.purpose}\n\n## Guide / 使用指南\n\n${entry.guide}\n\n## API\n\n${entry.api}\n\nFor full inherited props, inspect the versioned TypeScript declarations in the package and the [API source](../api/${entry.package}.md).\n\n## Usage / 完整示例\n\nRequires the CSS imports and ThemeProvider in the [integration guide](../guides/integration.md).\n\n\`\`\`tsx\n${code.trim()}\n\`\`\`\n\n## Accessibility / 无障碍\n\n${entry.a11y}\n\n## Pitfalls / 常见误用\n\n${entry.pitfalls}\n`;
	const path = `docs/components/${entry.slug}.md`;
	await output(`apps/docs/public/${path}`, text);
	paths.push({ path, title: entry.slug === "icons" ? "Icons" : entry.names.join(" / "), text });
}
for (const file of await readdir(resolve(root, "docs/guides"))) {
	const path = `docs/guides/${file}`,
		text = await read(path);
	await output(`apps/docs/public/${path}`, text);
	paths.unshift({ path, title: text.split("\n")[0].replace(/^# /, ""), text });
}
for (const name of ["ui", "charts", "icons"]) {
	const files = (await readdir(resolve(root, `packages/${name}/dist`))).filter((f) => f.endsWith(".d.ts"));
	let text = `# @matrixzero/${name}@${versions[name]} — TypeScript API\n\nGenerated from the built package. Relative imports refer to adjacent package declarations.\n`;
	for (const file of files)
		text += `\n## ${file}\n\n\`\`\`ts\n${await read(`packages/${name}/dist/${file}`)}\n\`\`\`\n`;
	await output(`apps/docs/public/docs/api/${name}.md`, text);
}
const { iconCatalog } = await import(resolve(root, "packages/icons/dist/catalog.js"));
await output(
	"apps/docs/public/docs/icons.json",
	JSON.stringify(
		iconCatalog.map(({ name, category, keywords }) => ({ name, category, keywords })),
		null,
		2,
	) + "\n",
);
const manifest = {
	schemaVersion: 1,
	versions,
	components: entries.map(({ slug, names, package: pkg }) => ({
		slug,
		exports: pkg === "icons" ? iconCatalog.map((icon) => icon.name) : names,
		package: `@matrixzero/${pkg}`,
		markdown: `docs/components/${slug}.md`,
		example: `docs/examples/${slug}.tsx`,
	})),
	guides: paths.filter((p) => p.path.includes("/guides/")).map((p) => p.path),
	api: ["ui", "charts", "icons"].map((p) => `docs/api/${p}.md`),
	icons: "docs/icons.json",
};
for (const e of entries)
	await output(`apps/docs/public/docs/examples/${e.slug}.tsx`, await read(`apps/docs/src/examples/${e.slug}.tsx`));
await output("apps/docs/public/docs/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
await output(
	"apps/docs/public/llms.txt",
	`# Matrix Design System\n\n> Versioned React 19 component usage and design guidance for humans and AI. Private GitLab Pages requires authorized access. Locally, read docs/content.json, docs/guides and apps/docs/src/examples.\n\nVersions: ${JSON.stringify(versions)}\n\n## Start here\n\n- [Full usage and guides](./llms-full.txt)\n- [Machine-readable manifest](./docs/manifest.json)\n- [Icon catalogue](./docs/icons.json)\n\n## Documentation\n\n${paths.map((p) => `- [${p.title}](./${p.path})`).join("\n")}\n\n## Exact type declarations\n\n${["ui", "charts", "icons"].map((p) => `- [${p} API](./docs/api/${p}.md)`).join("\n")}\n`,
);
await output(
	"apps/docs/public/llms-full.txt",
	`# Matrix Design System — complete usage and guides\n\nVersions: ${JSON.stringify(versions)}\n\n${paths.map((p) => `<!-- Source: ${p.path} -->\n\n${p.text.replaceAll("(../guides/", "(./docs/guides/").replaceAll("(../api/", "(./docs/api/")}`).join("\n\n---\n\n")}`,
);
console.log(
	`Generated ${entries.length} component guides, ${paths.length - entries.length} guides, API references and AI indexes.`,
);
