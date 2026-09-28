import { type DocsLocale, translate } from "../../i18n";
import { TextField } from "@matrixzero/ui";
import { Check, Hash } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ width: "min(100%, 560px)" }}>
			<TextField
				label={t("项目编号", "Project code")}
				leadingIcon={<Hash />}
				trailingIcon={<Check />}
				defaultValue="MDS-2048"
				name="projectCode"
				description={t(
					"尾部图标只表达状态，不承担操作。",
					"The trailing icon communicates status without adding an action.",
				)}
			/>
		</div>
	);
}
