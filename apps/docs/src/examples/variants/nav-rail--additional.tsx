import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { NavRail, NavItem } from "@matrixzero/ui";
import { Home, BookOpen, Settings } from "@matrixzero/icons";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [active, setActive] = useState("docs");
	return (
		<NavRail label={t("文档快捷导航", "Documentation shortcuts")} showLabels={false}>
			<NavItem icon={<Home />} active={active === "home"} onClick={() => setActive("home")}>
				{t("首页", "Home")}
			</NavItem>
			<NavItem icon={<BookOpen />} active={active === "docs"} onClick={() => setActive("docs")}>
				{t("导航轨文档", "Navigation rail documentation")}
			</NavItem>
			<NavItem icon={<Settings />} active={active === "settings"} onClick={() => setActive("settings")}>
				{t("主题设置", "Theme settings")}
			</NavItem>
		</NavRail>
	);
}
