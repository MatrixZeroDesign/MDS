import { Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";

export default function Example() {
	return (
		<Tabs defaultValue="usage">
			<TabList aria-label="文档视图 Documentation view">
				<Tab value="usage">用法 Usage</Tab>
				<Tab value="guide">指南 Guide</Tab>
			</TabList>
			<TabPanel value="usage">使用示例 / Usage example</TabPanel>
			<TabPanel value="guide">设计指南 / Design guide</TabPanel>
		</Tabs>
	);
}
