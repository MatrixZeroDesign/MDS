import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as simpleIcons from "simple-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
	brandColorOverrides,
	componentOverrides,
	cryptoBrands,
	customBrands,
	opticalOverrides,
	productBrands,
	providerSlugs,
	titleOverrides,
} from "./brand-icon-manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(root, "packages/brand-icons/src");
const assetRoot = join(root, "packages/brand-icons/dist/assets");
const lobeRoot = join(root, "node_modules/@lobehub/icons-static-svg/icons");
const customRoot = join(root, "packages/brand-icons/vendor");
const cryptoRoot = join(root, "node_modules/cryptocurrency-icons/svg");
const lobeFiles = new Set(await readdir(lobeRoot));
const simpleBySlug = new Map(
	Object.values(simpleIcons)
		.filter((icon) => icon && typeof icon === "object" && "slug" in icon)
		.map((icon) => [icon.slug, icon]),
);
const fontAwesomeBySlug = new Map(Object.values(fab).map((icon) => [icon.iconName, icon]));

await rm(assetRoot, { recursive: true, force: true });
await mkdir(assetRoot, { recursive: true });

const records = [];
const usedNames = new Set();

function humanize(value) {
	return value.replace(/[-_.]+/g, " ").replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());
}

function componentName(slug) {
	return (
		componentOverrides[slug] ??
		slug
			.split(/[^a-zA-Z0-9]+/)
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join("")
	);
}

function svg({ title, viewBox = "0 0 24 24", path, fill = "currentColor" }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><title>${title}</title><path fill="${fill}" d="${path}"/></svg>\n`;
}

function colorLuminance(hex) {
	const value = hex.slice(1);
	const normalized = value.length === 3 ? [...value].map((part) => part + part).join("") : value.slice(0, 6);
	const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
	const linear = channels.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
	return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrastNeeds(raw, brandColor) {
	if (/currentColor/i.test(raw)) return { contrastOnDark: true, contrastOnLight: false };
	const colors = brandColor ? [brandColor] : [...raw.matchAll(/#[0-9a-fA-F]{3,8}/g)].map(([color]) => color);
	if (!colors.length) return { contrastOnDark: false, contrastOnLight: false };
	const luminances = colors.map(colorLuminance);
	return {
		contrastOnDark: luminances.every((value) => value < 0.16),
		contrastOnLight: luminances.every((value) => value > 0.78),
	};
}

async function addLobe(slug, category) {
	const file = `${slug}.svg`;
	if (!lobeFiles.has(file)) throw new Error(`Missing LobeHub asset: ${file}`);
	const raw = await readFile(join(lobeRoot, file), "utf8");
	const title = titleOverrides[slug] ?? raw.match(/<title>(.*?)<\/title>/)?.[1] ?? humanize(slug);
	await writeFile(join(assetRoot, file), raw);
	const colorFile = `${slug}-color.svg`;
	const hasColor = lobeFiles.has(colorFile);
	const colorRaw = hasColor ? await readFile(join(lobeRoot, colorFile), "utf8") : "";
	if (hasColor) await writeFile(join(assetRoot, colorFile), colorRaw);
	addRecord({
		slug,
		title,
		category,
		source: "lobehub",
		hasColor,
		sourceUrl: "https://github.com/lobehub/lobe-icons",
		license: "MIT",
		...contrastNeeds(colorRaw),
	});
}

async function addProduct(slug, category, requestedSource) {
	if (usedNames.has(slug)) return;
	if (requestedSource === "custom") {
		const metadata = customBrands[slug];
		if (!metadata) throw new Error(`Missing custom brand metadata: ${slug}`);
		const raw = await readFile(join(customRoot, `${slug}.svg`), "utf8");
		await writeFile(join(assetRoot, `${slug}.svg`), raw);
		await writeFile(join(assetRoot, `${slug}-color.svg`), raw);
		if (metadata.wordmark) {
			const wordmarkRaw = await readFile(join(customRoot, metadata.wordmark), "utf8");
			await writeFile(join(assetRoot, `${slug}-wordmark.svg`), wordmarkRaw);
			await writeFile(join(assetRoot, `${slug}-wordmark-color.svg`), wordmarkRaw);
		}
		addRecord({
			slug,
			title: metadata.title,
			category,
			source: "wikimedia-commons",
			hasColor: true,
			hasWordmark: Boolean(metadata.wordmark),
			wordmarkAspectRatio: metadata.wordmarkAspectRatio,
			brandColor: metadata.brandColor,
			sourceUrl:
				metadata.sourceUrl ??
				`https://commons.wikimedia.org/wiki/File:${slug === "nio" ? "NIO_logo_emblem" : slug === "xpeng" ? "XPeng_logo" : slug === "byd" ? "BYD_Auto_2022_logo" : `${metadata.title}_logo`}.svg`,
			license: metadata.license ?? "PD-simple-logo",
			...contrastNeeds(raw, metadata.brandColor),
		});
		return;
	}
	if (requestedSource === "lobe" || (!requestedSource && lobeFiles.has(`${slug}.svg`))) {
		await addLobe(slug, category);
		return;
	}
	const simple = simpleBySlug.get(slug);
	if (simple && requestedSource !== "fontawesome") {
		const title = titleOverrides[slug] ?? simple.title;
		await writeFile(join(assetRoot, `${slug}.svg`), svg({ title, path: simple.path }));
		await writeFile(join(assetRoot, `${slug}-color.svg`), svg({ title, path: simple.path, fill: `#${simple.hex}` }));
		addRecord({
			slug,
			title,
			category,
			source: "simple-icons",
			hasColor: true,
			brandColor: `#${simple.hex}`,
			sourceUrl: simple.source,
			guidelinesUrl: simple.guidelines,
			license: simple.license?.type,
			...contrastNeeds("", `#${simple.hex}`),
		});
		return;
	}
	const fa = fontAwesomeBySlug.get(slug);
	if (!fa) throw new Error(`Missing product asset: ${slug}`);
	const [width, height, , , path] = fa.icon;
	if (Array.isArray(path)) throw new Error(`Unexpected layered brand asset: ${slug}`);
	const title = titleOverrides[slug] ?? humanize(slug);
	await writeFile(join(assetRoot, `${slug}.svg`), svg({ title, viewBox: `0 0 ${width} ${height}`, path }));
	addRecord({
		slug,
		title,
		category,
		source: "fontawesome",
		hasColor: false,
		sourceUrl: "https://fontawesome.com/",
		license: "CC-BY-4.0",
	});
}

async function addCrypto(slug, title) {
	if (usedNames.has(slug)) return;
	const mono = await readFile(join(cryptoRoot, "black", `${slug}.svg`), "utf8");
	const color = await readFile(join(cryptoRoot, "color", `${slug}.svg`), "utf8");
	await writeFile(join(assetRoot, `${slug}.svg`), mono);
	await writeFile(join(assetRoot, `${slug}-color.svg`), color);
	addRecord({
		slug,
		title,
		category: "crypto",
		source: "cryptocurrency-icons",
		hasColor: true,
		sourceUrl: "https://github.com/atomiclabs/cryptocurrency-icons",
		license: "CC0-1.0",
		...contrastNeeds(color),
	});
}

function addRecord(record) {
	if (usedNames.has(record.slug)) throw new Error(`Duplicate brand name: ${record.slug}`);
	usedNames.add(record.slug);
	records.push({
		...record,
		brandColor: record.brandColor ?? brandColorOverrides[record.slug],
		component: componentName(record.slug),
		opticalScale: opticalOverrides[record.slug] ?? 0.8,
		opticalShiftY: 0,
		contrastOnDark: record.contrastOnDark ?? false,
		contrastOnLight: record.contrastOnLight ?? false,
	});
}

for (const slug of providerSlugs) await addLobe(slug, "ai-provider");
for (const [slug, category, requestedSource] of productBrands) await addProduct(slug, category, requestedSource);
for (const [slug, title] of cryptoBrands) await addCrypto(slug, title);

const componentNames = new Set();
for (const record of records) {
	if (componentNames.has(record.component)) throw new Error(`Duplicate component name: ${record.component}`);
	componentNames.add(record.component);
}

records.sort((a, b) => a.title.localeCompare(b.title));
const literal = (value) => JSON.stringify(value);
const catalog = `// Generated by scripts/generate-brand-icons.mjs. Do not edit directly.\nexport const brandCatalog = [\n${records
	.map(
		(record) =>
			`\t{\n\t\tname: ${literal(record.slug)},\n\t\ttitle: ${literal(record.title)},\n\t\tcomponent: ${literal(record.component)},\n\t\tcategory: ${literal(record.category)},\n\t\tsource: ${literal(record.source)},\n\t\tasset: new URL("./assets/${record.slug}.svg", import.meta.url).href,\n\t\tcolorAsset: ${record.hasColor ? `new URL("./assets/${record.slug}-color.svg", import.meta.url).href` : "undefined"},\n\t\twordmarkAsset: ${record.hasWordmark ? `new URL("./assets/${record.slug}-wordmark.svg", import.meta.url).href` : "undefined"},\n\t\tcolorWordmarkAsset: ${record.hasWordmark ? `new URL("./assets/${record.slug}-wordmark-color.svg", import.meta.url).href` : "undefined"},\n\t\twordmarkAspectRatio: ${record.wordmarkAspectRatio ?? "undefined"},\n\t\tbrandColor: ${literal(record.brandColor)},\n\t\tsourceUrl: ${literal(record.sourceUrl)},\n\t\tguidelinesUrl: ${literal(record.guidelinesUrl)},\n\t\tlicense: ${literal(record.license)},\n\t\topticalScale: ${record.opticalScale},\n\t\topticalShiftY: ${record.opticalShiftY},\n\t\tcontrastOnDark: ${record.contrastOnDark},\n\t\tcontrastOnLight: ${record.contrastOnLight},\n\t},`,
	)
	.join(
		"\n",
	)}\n] as const;\n\nexport type BrandIconName = (typeof brandCatalog)[number]["name"];\nexport type BrandIconCategory = (typeof brandCatalog)[number]["category"];\n`;
await writeFile(join(sourceRoot, "catalog.ts"), catalog);

const components = `// Generated by scripts/generate-brand-icons.mjs. Do not edit directly.\nimport type { BrandMarkProps } from "./BrandMark.js";\nimport { BrandMark } from "./BrandMark.js";\n\ntype NamedBrandIconProps = Omit<BrandMarkProps, "asset" | "brandColor" | "colorAsset" | "wordmarkAsset" | "colorWordmarkAsset" | "wordmarkAspectRatio" | "opticalScale" | "opticalShiftY">;\n\n${records
	.map(
		(record) =>
			`export function ${record.component}(props: NamedBrandIconProps) {\n\treturn <BrandMark {...props} asset={new URL("./assets/${record.slug}.svg", import.meta.url).href} colorAsset={${record.hasColor ? `new URL("./assets/${record.slug}-color.svg", import.meta.url).href` : "undefined"}} wordmarkAsset={${record.hasWordmark ? `new URL("./assets/${record.slug}-wordmark.svg", import.meta.url).href` : "undefined"}} colorWordmarkAsset={${record.hasWordmark ? `new URL("./assets/${record.slug}-wordmark-color.svg", import.meta.url).href` : "undefined"}} wordmarkAspectRatio={${record.wordmarkAspectRatio ?? "undefined"}} brandColor={${literal(record.brandColor)}} opticalScale={${record.opticalScale}} opticalShiftY={${record.opticalShiftY}} />;\n}`,
	)
	.join("\n\n")}\n`;
await writeFile(join(sourceRoot, "icons.tsx"), components);
await writeFile(
	join(sourceRoot, "index.ts"),
	`export { BrandIcon } from "./BrandIcon.js";\nexport type { BrandIconFormat, BrandIconProps, BrandIconVariant } from "./BrandIcon.js";\nexport { brandCatalog } from "./catalog.js";\nexport type { BrandIconCategory, BrandIconName } from "./catalog.js";\nexport * from "./icons.js";\n`,
);
execFileSync(join(root, "node_modules/.bin/prettier"), ["--write", "catalog.ts", "icons.tsx", "index.ts"], {
	cwd: sourceRoot,
	stdio: "ignore",
});
console.log(`Generated ${records.length} brand icons.`);
