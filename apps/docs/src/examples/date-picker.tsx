import { languageTag, type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { DatePicker, Button, Form, FormSubmit } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [value, setValue] = useState("2026-10-16");
	const [saved, setSaved] = useState("");
	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				setSaved(value);
			}}
			onReset={() => {
				setValue("2026-10-16");
				setSaved("");
			}}
		>
			<DatePicker
				label={t("预约日期", "Appointment date")}
				locale={languageTag(locale)}
				name="date"
				value={value}
				onValueChange={setValue}
				required
				minValue="2026-01-01"
				maxValue="2027-12-31"
				description={t("可直接输入，或打开日历选择。", "Type each segment or choose from the calendar.")}
			/>
			<div className="docs-row">
				<FormSubmit>{t("保存", "Save")}</FormSubmit>
				<Button type="reset">{t("重置", "Reset")}</Button>
			</div>
			{saved && <p role="status">{saved}</p>}
		</Form>
	);
}
