import { languageTag, type DocsLocale, translate } from "../i18n";
import { TimeField } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<TimeField
			label={translate(locale, "开始时间", "Start time")}
			locale={languageTag(locale)}
			name="start"
			defaultValue="09:30"
			hourCycle={24}
			description={translate(locale, "直接输入小时和分钟。", "Type the hour and minute directly.")}
		/>
	);
}
