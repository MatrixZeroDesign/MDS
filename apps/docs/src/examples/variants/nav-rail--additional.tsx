import { type DocsLocale, translate } from "../../i18n";
import { NavRail, NavLink } from "@matrixzero/ui";
import { Home, BookOpen, Settings } from "@matrixzero/icons";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<NavRail label={t("文档快捷导航", "Documentation shortcuts")} showLabels={false}>
			<NavLink icon={<Home />} href="/home">
				{t("首页", "Home")}
			</NavLink>
			<NavLink icon={<BookOpen />} href="/docs/nav-rail" active>
				{t("导航轨文档", "Navigation rail documentation")}
			</NavLink>
			<NavLink icon={<Settings />} href="/docs/theme">
				{t("主题设置", "Theme settings")}
			</NavLink>
		</NavRail>
	);
}
