import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [value, setValue] = useState("monthly");
	return (
		<SegmentedControl
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
