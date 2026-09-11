import { Badge } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	tone = "success",
}: {
	locale?: "zh" | "en";
	tone?: "neutral" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Badge tone={tone}>{t("成功", "Success")}</Badge>;
}
