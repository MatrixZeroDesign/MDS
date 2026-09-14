import { translatePair, type DocsLocale, translate } from "../../i18n";
import { Alert } from "@matrixzero/ui";

function Sample({
	locale = "en",
	tone = "success",
}: {
	locale?: DocsLocale;
	tone?: "info" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Alert tone={tone}>{t("设置已保存。", "Settings saved.")}</Alert>;
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
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
