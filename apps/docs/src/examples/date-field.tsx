import { languageTag, type DocsLocale, translate } from "../i18n";
import { DateField } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<DateField
			label={translate(locale, "出生日期", "Date of birth")}
			locale={languageTag(locale)}
			name="birthday"
			defaultValue="1994-06-15"
			description={translate(
				locale,
				"使用数字键编辑，方向键移动或调整。",
				"Edit with number keys; use arrow keys to move or adjust.",
			)}
		/>
	);
}
