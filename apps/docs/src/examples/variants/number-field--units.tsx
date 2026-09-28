import { type DocsLocale, translate } from "../../i18n";
import { NumberField } from "@matrixzero/ui";
import { Gauge, Package, Percent } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
			<NumberField
				label={t("重量", "Weight")}
				leadingIcon={<Package />}
				unit="kg"
				defaultValue={2.5}
				min={0}
				step={0.25}
				decrementLabel={t("减少重量", "Decrease weight")}
				incrementLabel={t("增加重量", "Increase weight")}
			/>
			<NumberField
				label={t("完成度", "Completion")}
				leadingIcon={<Percent />}
				unit="%"
				defaultValue={75}
				min={0}
				max={100}
				step={5}
				decrementLabel={t("降低百分比", "Decrease percentage")}
				incrementLabel={t("提高百分比", "Increase percentage")}
			/>
			<NumberField
				label={t("延迟", "Latency")}
				leadingIcon={<Gauge />}
				unit="ms"
				defaultValue={120}
				min={0}
				step={10}
				decrementLabel={t("减少延迟", "Decrease latency")}
				incrementLabel={t("增加延迟", "Increase latency")}
			/>
		</div>
	);
}
