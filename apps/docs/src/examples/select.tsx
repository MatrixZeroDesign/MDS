import { type DocsLocale, translate } from "../i18n";
import { Select, Field, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<form style={{ display: "grid", gap: 16 }}>
			<Field label={t("地区", "Region")} required>
				<Select
					name="region"
					defaultValue="asia"
					options={[
						{ value: "asia", label: t("亚洲", "Asia") },
						{ value: "europe", label: t("欧洲", "Europe") },
					]}
				/>
			</Field>
			<Button type="reset" style={{ justifySelf: "start" }}>
				{t("重置", "Reset")}
			</Button>
		</form>
	);
}
