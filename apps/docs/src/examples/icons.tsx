import { type DocsLocale, translate } from "../i18n";
import { Search } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Search size={20} aria-label={t("搜索", "Search")} />;
}
