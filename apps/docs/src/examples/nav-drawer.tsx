import { NavDrawer, NavDrawerTrigger, NavDrawerContent, NavDrawerClose, NavLink, Button } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<NavDrawer>
			<NavDrawerTrigger asChild>
				<Button>{t("菜单", "Menu")}</Button>
			</NavDrawerTrigger>
			<NavDrawerContent
				title={t("导航", "Navigation")}
				navigationLabel={t("移动主导航", "Mobile main")}
				closeLabel={t("关闭", "Close")}
			>
				<NavDrawerClose asChild>
					<NavLink href="#docs">{t("文档", "Docs")}</NavLink>
				</NavDrawerClose>
			</NavDrawerContent>
		</NavDrawer>
	);
}
