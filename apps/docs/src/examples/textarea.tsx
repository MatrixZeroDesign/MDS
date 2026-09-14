import { type DocsLocale, translate } from "../i18n";
import { Field, Textarea } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Field label={t("说明", "Description")} description={t("最多 500 字符", "Up to 500 characters")}>
			<Textarea name="description" rows={4} maxLength={500} />
		</Field>
	);
}
