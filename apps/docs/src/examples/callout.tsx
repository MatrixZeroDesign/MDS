import { Callout } from "@matrixzero/ui";
export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Callout
			tone="warning"
			title={t("发布前检查", "Review before publishing")}
			action={<a href="#docs/select">{t("阅读选择器指南", "Read the Select guide")}</a>}
		>
			{t("确认受影响的应用和权限。", "Confirm affected applications and permissions.")}
		</Callout>
	);
}
