import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Field, Input } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [name, setName] = useState("Matrix");
	return (
		<Field label={t("名称", "Name")}>
			<Input readOnly name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
		</Field>
	);
}
