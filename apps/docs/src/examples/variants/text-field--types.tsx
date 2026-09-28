import { type DocsLocale, translate } from "../../i18n";
import { TextField } from "@matrixzero/ui";
import { Globe, Lock, Mail, Phone, Search } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
			<TextField
				label={t("电子邮箱", "Email")}
				type="email"
				name="email"
				leadingIcon={<Mail />}
				placeholder="name@example.com"
				autoComplete="email"
			/>
			<TextField
				label={t("密码", "Password")}
				type="password"
				name="password"
				trailingIcon={<Lock />}
				autoComplete="current-password"
			/>
			<TextField
				label={t("搜索", "Search")}
				type="search"
				name="query"
				leadingIcon={<Search />}
				placeholder={t("搜索项目", "Search projects")}
			/>
			<TextField
				label={t("网站", "Website")}
				type="url"
				name="website"
				leadingIcon={<Globe />}
				placeholder="https://example.com"
				autoComplete="url"
			/>
			<TextField
				label={t("电话号码", "Phone number")}
				type="tel"
				name="phone"
				leadingIcon={<Phone />}
				placeholder="+1 415 555 0123"
				autoComplete="tel"
			/>
		</div>
	);
}
