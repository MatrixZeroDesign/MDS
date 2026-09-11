import { Search } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Search size={20} aria-label={t("搜索", "Search")} />;
}
