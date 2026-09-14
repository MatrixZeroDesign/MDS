import { translatePair, type DocsLocale, translate } from "../../i18n";
import { Badge } from "@matrixzero/ui";

function Sample({
	locale = "en",
	tone = "success",
}: {
	locale?: DocsLocale;
	tone?: "neutral" | "success" | "warning" | "danger";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Badge tone={tone}>{t("成功", "Success")}</Badge>;
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "neutral", label: ["中性", "Neutral"] },
					{ value: "success", label: ["成功", "Success"] },
					{ value: "warning", label: ["警告", "Warning"] },
					{ value: "danger", label: ["危险", "Danger"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} tone={item.value} />
				</div>
			))}
		</div>
	);
}
