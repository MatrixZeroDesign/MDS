import { useState } from "react";
import { ChoiceMenu } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [scope, setScope] = useState("all");
	return (
		<ChoiceMenu
			label={t("范围", "Scope")}
			value={scope}
			onValueChange={setScope}
			options={[
				{ value: "all", label: t("全部", "All") },
				{ value: "mine", label: t("我的", "Mine") },
			]}
		/>
	);
}
