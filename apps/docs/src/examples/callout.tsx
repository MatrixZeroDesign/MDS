import { type DocsLocale, translate } from "../i18n";
import { Callout } from "@matrixzero/ui";
export default function Example({
	locale = "en",
	tone = "warning",
}: {
	locale?: DocsLocale;
	tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Callout
			tone={tone}
			title={t("发布前检查", "Review before publishing")}
			action={<a href="/docs/select">{t("阅读选择器指南", "Read the Select guide")}</a>}
		>
			{t("确认受影响的应用和权限。", "Confirm affected applications and permissions.")}
		</Callout>
	);
}
