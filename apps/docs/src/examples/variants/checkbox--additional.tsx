import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Checkbox, CheckField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [checked, setChecked] = useState(false);
	return (
		<CheckField
			disabled
			label={t("接收通知", "Receive notifications")}
			checked={checked}
			onCheckedChange={(v) => setChecked(v === true)}
		/>
	);
}
