import { translatePair, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";

function Sample({
	locale = "en",
	size = "md",
	shape = "rounded",
}: {
	locale?: DocsLocale;
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [value, setValue] = useState("monthly");
	return (
		<SegmentedControl
			size={size}
			shape={shape}
			label={t("计费", "Billing")}
			value={value}
			onValueChange={setValue}
			options={[
				{ value: "monthly", label: t("月付", "Monthly") },
				{ value: "annual", label: t("年付", "Annual") },
			]}
		/>
	);
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "rounded", label: ["圆角", "Rounded"] },
					{ value: "pill", label: ["胶囊", "Pill"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} shape={item.value} />
				</div>
			))}
		</div>
	);
}
