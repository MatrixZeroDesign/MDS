import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Slider } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [value, setValue] = useState(65);
	return (
		<Slider
			step={10}
			label={translate(locale, "音量", "Volume")}
			value={value}
			onValueChange={setValue}
			formatValue={(v) => `${v}%`}
		/>
	);
}
