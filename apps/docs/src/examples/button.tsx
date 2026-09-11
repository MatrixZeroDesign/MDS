import { useState } from "react";
import { Button } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	variant = "primary",
	size = "md",
	shape = "rounded",
}: {
	locale?: "zh" | "en";
	variant?: "primary" | "secondary" | "ghost" | "danger" | "contrast";
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
}) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
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
