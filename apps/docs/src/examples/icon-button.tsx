import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { IconButton } from "@matrixzero/ui";

export default function Example({
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
