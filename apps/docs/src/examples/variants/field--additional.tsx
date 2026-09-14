import { type DocsLocale, translate } from "../../i18n";
import { Field, Input } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Field
			error={t("请输入有效邮箱", "Enter a valid email")}
			label={t("邮箱", "Email")}
			description={t("用于接收通知", "For notifications")}
			required
		>
			<Input name="email" type="email" />
		</Field>
	);
}
