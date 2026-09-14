import { type DocsLocale, translate } from "../i18n";
import { Divider, Typography } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 16, width: "100%" }}>
			<Typography variant="overline" tone="muted">
				{t("产品工作空间", "Product workspace")}
			</Typography>
			<Typography as="h2" variant="display">
				{t("清晰的想法，细致地表达。", "Clear ideas, carefully expressed.")}
			</Typography>
			<Typography variant="body-lg" tone="muted">
				{t(
					"独立选择视觉样式和 HTML 元素，保持文档层级正确。",
					"Choose the visual style independently from the HTML element so the document outline stays correct.",
				)}
			</Typography>
			<Divider decorative />
			<Typography as="code" variant="code" dir="ltr">
				npm install @matrixzero/ui
			</Typography>
			<Divider decorative />
			<div>
				<Typography as="h3" variant="title" gutter>
					{t("自动标题间距", "Automatic title gutter")}
				</Typography>
				<Typography tone="muted">
					{t(
						"底部空间随所选字号自动变化，无需手动边距即可保持文档流平衡。",
						"The bottom space follows the selected type size, which keeps document flow balanced without manual margins.",
					)}
				</Typography>
			</div>
		</div>
	);
}
