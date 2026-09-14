import { languageTag, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { TimePicker } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [value, setValue] = useState("09:30");
	return (
		<TimePicker
			readOnly
			label={translate(locale, "到达时间", "Arrival time")}
			locale={languageTag(locale)}
			name="arrival"
			value={value}
			onValueChange={setValue}
			hourCycle={24}
			minValue="08:00"
			maxValue="20:00"
			minuteStep={30}
			description={translate(
				locale,
				"选择推荐时间，或手动输入精确到分钟的时间。",
				"Choose a suggested time or type any minute within the range.",
			)}
		/>
	);
}
