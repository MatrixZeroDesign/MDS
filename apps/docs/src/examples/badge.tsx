import { type DocsLocale, translate } from "../i18n";
import { Badge } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	tone = "success",
}: {
	locale?: DocsLocale;
	tone?: "neutral" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Badge tone={tone}>{t("成功", "Success")}</Badge>;
}
