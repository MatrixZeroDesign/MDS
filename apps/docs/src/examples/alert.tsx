import { Alert } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Alert tone="success">{t("设置已保存。", "Settings saved.")}</Alert>;
}
