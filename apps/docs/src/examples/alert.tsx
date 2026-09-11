import { Alert } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	tone = "success",
}: {
	locale?: "zh" | "en";
	tone?: "info" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Alert tone={tone}>{t("设置已保存。", "Settings saved.")}</Alert>;
}
