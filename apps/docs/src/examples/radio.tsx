import { type DocsLocale, translate } from "../i18n";
import { RadioGroup, RadioItem } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<RadioGroup aria-label={t("计费", "Billing")} defaultValue="monthly">
			<RadioItem value="monthly">{t("月付", "Monthly")}</RadioItem>
			<RadioItem value="annual">{t("年付", "Annual")}</RadioItem>
		</RadioGroup>
	);
}
