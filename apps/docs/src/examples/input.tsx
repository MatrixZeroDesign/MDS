import { useState } from "react";
import { Field, Input } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [name, setName] = useState("");
	return (
		<Field label={t("名称", "Name")}>
			<Input name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
		</Field>
	);
}
