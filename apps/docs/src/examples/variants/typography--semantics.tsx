import { type DocsLocale, translate } from "../../i18n";
import { Card, CardContent, Typography } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 20, width: "100%" }}>
			<Card variant="subtle">
				<CardContent style={{ display: "grid", gap: 8 }}>
					<Typography as="h2" variant="title">
						{t("具有章节标题样式的语义标题", "A semantic heading with a section-title style")}
					</Typography>
					<Typography as="p" variant="title-sm">
						{t(
							"段落可以使用更强的视觉样式，而不改变文档层级。",
							"A paragraph can use a stronger visual style without changing the document outline.",
						)}
					</Typography>
					<Typography as="span" variant="body-sm" tone="muted">
						{t("辅助元数据 · 3 分钟前", "Supporting metadata · 3 minutes ago")}
					</Typography>
				</CardContent>
			</Card>

			<div style={{ maxWidth: 360 }}>
				<Typography
					variant="body"
					truncate
					title={t(
						"这行长文本会在狭窄区域中有意截断",
						"This long line is intentionally truncated inside a narrow region",
					)}
				>
					{t("这行长文本会在狭窄区域中有意截断", "This long line is intentionally truncated inside a narrow region")}
				</Typography>
			</div>
		</div>
	);
}
