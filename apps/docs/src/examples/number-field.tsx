import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { NumberField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [quantity, setQuantity] = useState<number | null>(1);
	return (
		<NumberField
			label={t("数量", "Quantity")}
			description={t("可直接输入数值，也可以使用步进按钮。", "Enter a number directly or use the step buttons.")}
			name="quantity"
			min={0}
			max={100}
			value={quantity}
			onValueChange={setQuantity}
			decrementLabel={t("减少数量", "Decrease quantity")}
			incrementLabel={t("增加数量", "Increase quantity")}
		/>
	);
}
