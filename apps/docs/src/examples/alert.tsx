import { type DocsLocale, translate } from "../i18n";
import { Alert } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	tone = "success",
}: {
	locale?: DocsLocale;
	tone?: "info" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Alert tone={tone}>{t("设置已保存。", "Settings saved.")}</Alert>;
}
