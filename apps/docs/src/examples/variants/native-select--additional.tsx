import { type DocsLocale, translate } from "../../i18n";
import { NativeSelect, Field, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<form style={{ display: "grid", gap: 16 }}>
			<Field label={t("地区", "Region")}>
				<NativeSelect disabled name="region" defaultValue="asia">
					<option value="asia">{t("亚洲", "Asia")}</option>
					<option value="europe">{t("欧洲", "Europe")}</option>
				</NativeSelect>
			</Field>
			<Button type="reset" style={{ justifySelf: "start" }}>
				{t("重置", "Reset")}
			</Button>
		</form>
	);
}
