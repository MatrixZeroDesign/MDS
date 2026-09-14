import { translatePair, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { IconButton } from "@matrixzero/ui";

function Sample({
	locale = "en",
	variant = "secondary",
	size = "md",
	shape = "rounded",
}: {
	locale?: DocsLocale;
	variant?: "primary" | "secondary" | "ghost" | "danger" | "contrast";
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [count, setCount] = useState(0);
	return (
		<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
			<IconButton
				shape={shape}
				size={size}
				variant={variant}
				label={t("添加", "Add")}
				icon={<span>+</span>}
				onClick={() => setCount(count + 1)}
				aria-describedby="add-count"
			/>
			<span id="add-count">{count}</span>
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
