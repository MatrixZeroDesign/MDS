import { type DocsLocale, translate } from "../../i18n";
import { Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";

const sections = [
	["overview", "概览", "Overview"],
	["activity", "动态", "Activity"],
	["analytics", "分析", "Analytics"],
	["audience", "受众", "Audience"],
	["content", "内容", "Content"],
	["campaigns", "营销活动", "Campaigns"],
	["automation", "自动化", "Automation"],
	["integrations", "集成", "Integrations"],
	["settings", "设置", "Settings"],
] as const;

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Tabs defaultValue="overview" style={{ maxWidth: 480 }}>
			<TabList aria-label={t("工作空间区域", "Workspace sections")}>
				{sections.map(([value, zh, en]) => (
					<Tab key={value} value={value}>
						{t(zh, en)}
					</Tab>
				))}
			</TabList>
			{sections.map(([value, zh, en]) => (
				<TabPanel key={value} value={value}>
					{t(`${zh}内容`, `${en} content`)}
				</TabPanel>
			))}
		</Tabs>
	);
}
