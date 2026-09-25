import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { Button } from "@matrixzero/ui";
import { Plus, ArrowRight } from "@matrixzero/icons";

export default function Example({
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
			<Button
				shape={shape}
				size={size}
				variant={variant}
				leadingIcon={<Plus />}
				trailingIcon={<ArrowRight />}
				onClick={() => setCount(count + 1)}
			>
				{t("添加", "Add")}
			</Button>
			<p role="status" style={{ margin: 0 }}>
				{count}
			</p>
		</div>
	);
}
