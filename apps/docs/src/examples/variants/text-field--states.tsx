import { type DocsLocale, translate } from "../../i18n";
import { TextField } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
			<TextField
				label={t("用户名", "Username")}
				required
				defaultValue="invalid value"
				error={t("用户名只能包含字母、数字和连字符。", "Use only letters, numbers, and hyphens.")}
			/>
			<TextField label={t("组织", "Organization")} defaultValue="Matrix Zero" readOnly />
			<TextField label={t("账户编号", "Account ID")} defaultValue="ACCT-2048" disabled />
		</div>
	);
}
