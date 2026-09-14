import { translatePair, type DocsLocale, translate } from "../../i18n";
import { Callout } from "@matrixzero/ui";
function Sample({
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

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "neutral", label: ["中性", "Neutral"] },
					{ value: "info", label: ["信息", "Information"] },
					{ value: "success", label: ["成功", "Success"] },
					{ value: "warning", label: ["警告", "Warning"] },
					{ value: "danger", label: ["危险", "Danger"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%", width: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} tone={item.value} />
				</div>
			))}
		</div>
	);
}
