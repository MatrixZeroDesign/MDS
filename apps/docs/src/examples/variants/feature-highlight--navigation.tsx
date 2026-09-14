import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { FeatureHighlight, NavItem } from "@matrixzero/ui";
import { Home, BookOpen, Settings } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [selected, setSelected] = useState("home");
	const [unseen, setUnseen] = useState(true);
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<nav
				aria-label={t("工作区导航", "Workspace navigation")}
				style={{ display: "grid", gap: 12, width: 260, maxWidth: "100%", padding: 8 }}
			>
				<NavItem icon={<Home />} active={selected === "home"} onClick={() => setSelected("home")}>
					{t("首页", "Home")}
				</NavItem>
				<FeatureHighlight active={unseen} style={{ width: "100%" }}>
					<NavItem
						icon={<BookOpen />}
						active={selected === "knowledge"}
						onClick={() => {
							setSelected("knowledge");
							setUnseen(false);
						}}
						style={{ width: "100%" }}
					>
						{t("团队知识库 · 新功能", "Team knowledge · New")}
					</NavItem>
				</FeatureHighlight>
				<NavItem icon={<Settings />} active={selected === "settings"} onClick={() => setSelected("settings")}>
					{t("设置", "Settings")}
				</NavItem>
			</nav>
			<p role="status">
				{selected === "knowledge"
					? t("团队知识库已打开，提示已关闭。", "Team knowledge opened. Discovery hint dismissed.")
					: t("提示新上线的导航入口，访问后停止提醒。", "Highlight a new destination until it has been visited.")}
			</p>
		</div>
	);
}
