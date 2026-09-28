import { type DocsLocale, translate } from "../../i18n";
import { NumberField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ width: "min(100%, 560px)" }}>
			<NumberField
				label={t("团队席位", "Team seats")}
				description={t("已达到 12 个席位的上限。", "The 12-seat limit has been reached.")}
				defaultValue={12}
				min={1}
				max={12}
				decrementLabel={t("减少席位", "Decrease seats")}
				incrementLabel={t("增加席位", "Increase seats")}
			/>
		</div>
	);
}
