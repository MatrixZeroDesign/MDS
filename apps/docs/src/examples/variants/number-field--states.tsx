import { type DocsLocale, translate } from "../../i18n";
import { NumberField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
			<NumberField
				label={t("重试次数", "Retry count")}
				required
				defaultValue={8}
				min={0}
				max={5}
				error={t("重试次数不能超过 5。", "Retry count cannot exceed 5.")}
				decrementLabel={t("减少重试次数", "Decrease retry count")}
				incrementLabel={t("增加重试次数", "Increase retry count")}
			/>
			<NumberField
				label={t("已用存储空间", "Storage used")}
				unit="GB"
				defaultValue={64}
				readOnly
				decrementLabel={t("减少存储空间", "Decrease storage")}
				incrementLabel={t("增加存储空间", "Increase storage")}
			/>
			<NumberField
				label={t("归档保留天数", "Archive retention")}
				unit={t("天", "days")}
				defaultValue={30}
				disabled
				decrementLabel={t("减少保留时间", "Decrease retention")}
				incrementLabel={t("增加保留时间", "Increase retention")}
			/>
		</div>
	);
}
