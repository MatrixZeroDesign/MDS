import { type DocsLocale, translate } from "../i18n";
import { Field, TextField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Field label={t("邮箱", "Email")} description={t("用于接收通知", "For notifications")} required>
			<TextField name="email" type="email" />
		</Field>
	);
}
