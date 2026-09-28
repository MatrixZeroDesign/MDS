import { type DocsLocale, translate } from "../../i18n";
import { NumberField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ width: "min(100%, 240px)" }}>
			<NumberField
				label={t("客人数量", "Guests")}
				stepperPlacement="sides"
				defaultValue={2}
				min={1}
				max={8}
				decrementLabel={t("减少客人数量", "Remove a guest")}
				incrementLabel={t("增加客人数量", "Add a guest")}
			/>
		</div>
	);
}
