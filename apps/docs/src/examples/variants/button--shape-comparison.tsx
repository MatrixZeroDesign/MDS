import { translatePair, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Button } from "@matrixzero/ui";

function Sample({
	locale = "en",
	variant = "primary",
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
			<Button shape={shape} size={size} variant={variant} onClick={() => setCount(count + 1)}>
				{t("添加", "Add")}
			</Button>
			<p role="status" style={{ margin: 0 }}>
				{count}
			</p>
		</div>
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
