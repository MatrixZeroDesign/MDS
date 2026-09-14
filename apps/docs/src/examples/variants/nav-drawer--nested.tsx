import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { NavDrawer, NavDrawerContent, NavDrawerTrigger, NavGroup, NavItem, Button } from "@matrixzero/ui";
import { Home, BookOpen, Settings } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [selected, setSelected] = useState("articles");
	const [open, setOpen] = useState(false);
	const items = (
		<>
			<NavItem icon={<Home />} active={selected === "home"} onClick={() => setSelected("home")}>
				{t("首页", "Home")}
			</NavItem>
			<NavGroup
				label={t("知识库", "Knowledge")}
				icon={<BookOpen />}
				defaultOpen
				active={["articles", "collections"].includes(selected)}
			>
				<NavItem active={selected === "articles"} onClick={() => setSelected("articles")}>
					{t("全部文章", "All articles")}
				</NavItem>
				<NavItem active={selected === "collections"} onClick={() => setSelected("collections")}>
					{t("团队合集", "Team collections")}
				</NavItem>
			</NavGroup>
			<NavGroup label={t("设置", "Settings")} icon={<Settings />} active={selected === "members"}>
				<NavItem active={selected === "members"} onClick={() => setSelected("members")}>
					{t("成员与权限", "Members and permissions")}
				</NavItem>
				<NavItem disabled>{t("企业安全", "Enterprise security")}</NavItem>
			</NavGroup>
		</>
	);
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<div style={{ width: 280, maxWidth: "100%" }}>
				<NavDrawer variant="standard">
					<NavDrawerContent
						title={t("工作区", "Workspace")}
						navigationLabel={t("工作区导航", "Workspace navigation")}
						closeLabel={t("关闭", "Close")}
					>
						{items}
					</NavDrawerContent>
				</NavDrawer>
			</div>
			<NavDrawer open={open} onOpenChange={setOpen}>
				<NavDrawerTrigger asChild>
					<Button>{t("打开二级导航抽屉", "Open nested navigation")}</Button>
				</NavDrawerTrigger>
				<NavDrawerContent
					title={t("工作区", "Workspace")}
					navigationLabel={t("弹层导航", "Modal navigation")}
					closeLabel={t("关闭", "Close")}
				>
					{items}
				</NavDrawerContent>
			</NavDrawer>
		</div>
	);
}
