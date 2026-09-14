import { type DocsLocale, translate } from "../../i18n";
import { Divider, Typography } from "@matrixzero/ui";

const styles = [
	["display", ["构建更从容的产品", "Build calmer products"]],
	["title-lg", ["大号章节标题", "Large section title"]],
	["title", ["章节标题", "Section title"]],
	["title-sm", ["紧凑卡片标题", "Compact card title"]],
	["body-lg", ["用于简短介绍的引导正文。", "Lead body text for a short introduction."]],
	["body", ["适用于大多数界面内容的默认正文。", "Default body text for most interface content."]],
	["body-sm", ["用于紧凑表面的辅助正文。", "Supporting body text for compact surfaces."]],
	["label", ["表单和控件标签", "Form and control label"]],
	["caption", ["3 分钟前更新", "Updated 3 minutes ago"]],
	["overline", ["工作空间概览", "Workspace overview"]],
	["code", ["const ready = true;", "const ready = true;"]],
] as const;

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "grid", gap: 0, width: "100%" }}>
			{styles.map(([variant, sample], index) => (
				<div key={variant}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "minmax(88px, 0.28fr) minmax(0, 1fr)",
							alignItems: "baseline",
							gap: 20,
							paddingBlock: 14,
						}}
					>
						<Typography variant="caption" tone="muted">
							{variant}
						</Typography>
						<Typography variant={variant}>{translate(locale, sample[0], sample[1])}</Typography>
					</div>
					{index < styles.length - 1 && <Divider decorative />}
				</div>
			))}
		</div>
	);
}
