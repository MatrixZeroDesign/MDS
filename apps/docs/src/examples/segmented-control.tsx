import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";

export default function Example({
	locale = "en",
	size = "md",
	shape = "rounded",
}: {
	locale?: "zh" | "en";
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
}) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
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
