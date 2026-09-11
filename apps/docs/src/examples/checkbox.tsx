import { useState } from "react";
import { Checkbox, CheckField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [checked, setChecked] = useState(false);
	return (
		<CheckField
			label={t("接收通知", "Receive notifications")}
			checked={checked}
			onCheckedChange={(v) => setChecked(v === true)}
		/>
	);
}
