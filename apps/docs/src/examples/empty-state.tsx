import { EmptyState } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<EmptyState title={t("没有匹配项", "No matches")} description={t("尝试更短的关键词", "Try a shorter query")} />
	);
}
