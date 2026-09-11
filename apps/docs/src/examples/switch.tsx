import { useState } from "react";
import { Field, Switch } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [enabled, setEnabled] = useState(true);
	return (
		<Field label={t("自动保存", "Autosave")}>
			<Switch checked={enabled} onCheckedChange={setEnabled} />
		</Field>
	);
}
