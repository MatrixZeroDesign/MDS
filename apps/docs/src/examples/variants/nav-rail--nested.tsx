import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { NavRail, NavDrawerPanel, NavGroup, NavItem, SegmentedControl } from "@matrixzero/ui";
import { Home, BookOpen } from "@matrixzero/icons";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [layout, setLayout] = useState("rail");
	const [selected, setSelected] = useState("articles");
	const items = (
		<>
			<NavItem icon={<Home />} active={selected === "home"} onClick={() => setSelected("home")}>
				{t("首页", "Home")}
			</NavItem>
			<NavGroup
				key={layout}
				label={t("团队知识库", "Team knowledge")}
				icon={<BookOpen />}
				active={selected !== "home"}
				defaultOpen={selected !== "home"}
			>
				<NavItem active={selected === "articles"} onClick={() => setSelected("articles")}>
					{t("所有文章与文档", "All articles and documentation")}
				</NavItem>
				<NavItem active={selected === "collections"} onClick={() => setSelected("collections")}>
					{t("团队共享合集", "Shared team collections")}
				</NavItem>
			</NavGroup>
		</>
	);
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<SegmentedControl
				label={t("导航布局", "Navigation layout")}
				value={layout}
				onValueChange={setLayout}
				options={[
					{ value: "rail", label: t("图标导航", "Rail") },
					{ value: "drawer", label: t("展开导航", "Drawer") },
				]}
			/>
			{layout === "rail" ? (
				<NavRail label={t("工作区", "Workspace")} showLabels={false}>
					{items}
				</NavRail>
			) : (
				<NavDrawerPanel label={t("工作区", "Workspace")} style={{ width: 280, maxWidth: "100%" }}>
					{items}
				</NavDrawerPanel>
			)}
		</div>
	);
}
