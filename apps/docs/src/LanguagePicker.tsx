import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, IconButton } from "@matrixzero/ui";
import { Globe, Check } from "@matrixzero/icons";
import { languages, isDocsLocale, languageTag, translate, type DocsLocale } from "./i18n";
export type DocsLanguage = DocsLocale;
const languageMarks: Record<DocsLanguage, string> = {
	en: "EN",
	zh: "简",
	"zh-TW": "繁",
	ja: "日",
	ko: "한",
	fr: "FR",
	es: "ES",
	ar: "ع",
};
export function readSavedLanguage(): DocsLanguage {
	const query = new URLSearchParams(location.search).get("lang");
	if (isDocsLocale(query)) return query;
	try {
		const saved = localStorage.getItem("mds.docs.language");
		return isDocsLocale(saved) ? saved : "en";
	} catch {
		return "en";
	}
}
export function saveLanguage(language: DocsLanguage) {
	try {
		localStorage.setItem("mds.docs.language", language);
	} catch {
		/* Session selection remains available. */
	}
	// Keep an explicit language URL consistent with the new selection.
	const url = new URL(location.href);
	if (url.searchParams.has("lang")) {
		url.searchParams.set("lang", language);
		history.replaceState(null, "", url.pathname + url.search + url.hash);
	}
	document.documentElement.lang = languageTag(language);
	document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}
export function LanguagePicker({
	locale,
	onChange,
}: {
	locale: DocsLanguage;
	onChange: (language: DocsLanguage) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownTrigger asChild>
				<IconButton variant="ghost" label="Change language" icon={<Globe size={16} />} />
			</DropdownTrigger>
			<DropdownContent align="end">
				{languages.map((option) => (
					<DropdownItem
						key={option.value}
						role="menuitemradio"
						aria-checked={locale === option.value}
						onSelect={() => onChange(option.value)}
					>
						<span style={{ display: "inline-flex", alignItems: "center", gap: "var(--mds-space-field)" }}>
							<span className="docs-language-mark" aria-hidden="true">
								{languageMarks[option.value]}
							</span>
							<span lang={option.tag}>{option.label}</span>
						</span>
						{locale === option.value && <Check size={14} style={{ marginInlineStart: "auto" }} />}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownMenu>
	);
}
