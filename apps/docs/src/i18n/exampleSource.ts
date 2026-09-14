import { audioLabels, languageTag, translate, type DocsLocale } from "./index";
/** Export demo code without imports into the documentation application's internals. */
export function standaloneExample(code: string, locale: DocsLocale) {
	// The basic data-table demo includes documentation-only feature galleries.
	if (code.includes('import Features from "./data-table/features"')) {
		const galleryStart = code.indexOf('{(["pinned"');
		const galleryEnd = code.indexOf("\n\t\t</div>", galleryStart);
		if (galleryStart >= 0 && galleryEnd > galleryStart) code = code.slice(0, galleryStart) + code.slice(galleryEnd);
		code = code
			.replace(/import \{ ExampleCode \} from "\.\.\/ExampleCode";\n/, "")
			.replace(/import Features from "\.\/data-table\/features";\n/, "")
			.replace(/const sources = import\.meta\.glob[\s\S]*?;\n/, "");
	}
	if (!/from ["'][^"']*i18n["']/.test(code)) return code;
	const entries: Record<string, string> = {};
	const quoted = '"(?:[^"\\\\]|\\\\.)*"';
	const pairs = new RegExp("(?:translate\\(locale,|t\\(|\\[)\\s*(" + quoted + ")\\s*,\\s*(" + quoted + ")", "g");
	for (const match of code.matchAll(pairs)) {
		try {
			const zh = JSON.parse(match[1]);
			const en = JSON.parse(match[2]);
			entries[en] = translate(locale, zh, en);
		} catch {
			/* Non-literal examples retain their fallback. */
		}
	}
	const helper = `type DocsLocale = string;\nconst exampleMessages: Record<string, string> = ${JSON.stringify(entries, null, 2)};\nconst translate = (_locale: string, zh: string, en: string) => exampleMessages[en] ?? ${locale === "zh" ? "zh" : "en"};\nconst languageTag = (_locale: string) => ${JSON.stringify(languageTag(locale))};\nconst translatePair = (locale: string, values: readonly string[]) => translate(locale, values[0], values[1] ?? values[0]);\n`;
	return (
		helper +
		(code.includes("audioLabels")
			? `const audioLabels = (_locale: string) => (${JSON.stringify(audioLabels(locale))});\n`
			: "") +
		code
			.replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']*i18n["'];?\s*/g, "")
			.replace(/locale = "(?:zh|en)"/g, `locale = ${JSON.stringify(locale)}`)
	);
}
