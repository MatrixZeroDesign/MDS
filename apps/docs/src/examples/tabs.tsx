import { Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Tabs defaultValue="usage">
			<TabList aria-label={t("文档视图", "Documentation view")}>
				<Tab value="usage">{t("用法", "Usage")}</Tab>
				<Tab value="guide">{t("指南", "Guide")}</Tab>
			</TabList>
			<TabPanel value="usage">{t("使用示例", "Usage example")}</TabPanel>
			<TabPanel value="guide">{t("设计指南", "Design guide")}</TabPanel>
		</Tabs>
	);
}
