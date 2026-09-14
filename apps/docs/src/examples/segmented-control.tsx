import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";

export default function Example({
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
