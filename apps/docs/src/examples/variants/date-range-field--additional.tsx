import { languageTag, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { DateRangeField, Button, Form, FormSubmit, type DateRangeValue } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const initial = { start: "2026-10-16", end: "2026-10-20" };
	const [value, setValue] = useState<DateRangeValue | null>(initial);
	const [saved, setSaved] = useState("");
	return (
		<Form
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				setSaved(data.get("start") + " – " + data.get("end"));
			}}
			onReset={() => {
				setValue(initial);
				setSaved("");
			}}
		>
			<DateRangeField
				readOnly
				label={t("旅行日期", "Travel dates")}
				locale={languageTag(locale)}
				value={value}
				onValueChange={setValue}
				startName="start"
				endName="end"
				required
				minValue="2026-01-01"
				maxValue="2027-12-31"
				description={t(
					"输入开始和结束日期，结束日期不能早于开始日期。",
					"Enter a start and end date. The end cannot precede the start.",
				)}
			/>
			<div className="docs-row">
				<FormSubmit>{t("保存", "Save")}</FormSubmit>
				<Button type="reset">{t("重置", "Reset")}</Button>
				<Button onClick={() => setValue(null)}>{t("清空", "Clear")}</Button>
			</div>
			{saved && <p role="status">{saved}</p>}
		</Form>
	);
}
