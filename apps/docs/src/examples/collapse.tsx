import { Collapse, CollapseTrigger, CollapseContent, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Collapse style={{ display: "grid", gap: 16, justifyItems: "start" }}>
			<CollapseTrigger asChild>
				<Button>{t("高级设置", "Advanced")}</Button>
			</CollapseTrigger>
			<CollapseContent>
				<p style={{ margin: 0 }}>{t("高级选项", "Advanced options")}</p>
			</CollapseContent>
		</Collapse>
	);
}
