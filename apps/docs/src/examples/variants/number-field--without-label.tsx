import { type DocsLocale, translate } from "../../i18n";
import { NumberField } from "@matrixzero/ui";
import { Gauge } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div role="group" aria-label={t("缩放控制", "Zoom controls")} style={{ width: "min(100%, 360px)" }}>
			<NumberField
				aria-label={t("缩放级别", "Zoom level")}
				leadingIcon={<Gauge />}
				unit="%"
				defaultValue={100}
				min={25}
				max={200}
				step={25}
				decrementLabel={t("缩小", "Zoom out")}
				incrementLabel={t("放大", "Zoom in")}
			/>
		</div>
	);
}
