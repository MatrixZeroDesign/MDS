import { translatePair, type DocsLocale, translate } from "../../i18n";
import { Spinner } from "@matrixzero/ui";
function Sample({ locale = "en", size = "md" }: { locale?: DocsLocale; size?: "sm" | "md" | "lg" }) {
	return (
		<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
			<Spinner size={size} label={translate(locale, "正在加载内容", "Loading content")} />
			<span>{translate(locale, "正在准备内容…", "Preparing your content…")}</span>
		</div>
	);
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "sm", label: ["小号", "Small"] },
					{ value: "md", label: ["中号", "Medium"] },
					{ value: "lg", label: ["大号", "Large"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} size={item.value} />
				</div>
			))}
		</div>
	);
}
