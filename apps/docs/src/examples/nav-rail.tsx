import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { NavRail, NavItem } from "@matrixzero/ui";
import { Home, BookOpen, Settings } from "@matrixzero/icons";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [active, setActive] = useState("home");
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<NavRail showLabels label={t("主导航", "Main navigation")}>
				<NavItem icon={<Home />} active={active === "home"} onClick={() => setActive("home")}>
					{t("首页", "Home")}
				</NavItem>
				<NavItem
					icon={<BookOpen />}
					shortLabel={t("知识库", "Knowledge")}
					active={active === "docs"}
					onClick={() => setActive("docs")}
				>
					{t("团队知识与文档", "Knowledge and documentation")}
				</NavItem>
				<NavItem
					icon={<Settings />}
					shortLabel={t("工作区", "Workspace")}
					active={active === "settings"}
					onClick={() => setActive("settings")}
				>
					{t("工作区高级设置", "Workspace administration")}
				</NavItem>
			</NavRail>
		</div>
	);
}
