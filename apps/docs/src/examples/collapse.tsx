import { type DocsLocale, translate } from "../i18n";
import { Collapse, CollapseTrigger, CollapseContent, Button, Divider } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Collapse style={{ display: "grid", gap: 16, maxWidth: 420 }}>
			<CollapseTrigger>{t("高级设置", "Advanced settings")}</CollapseTrigger>
			<CollapseContent>
				<div>
					<Divider />
					<p style={{ margin: 0, padding: 12 }}>
						{t("可用于补充独立信息与高级选项。", "Use for supplemental independent details or advanced options.")}
					</p>
				</div>
			</CollapseContent>
			<Button variant="ghost" size="sm">
				{t("独立动作", "Standalone action")}
			</Button>
		</Collapse>
	);
}
