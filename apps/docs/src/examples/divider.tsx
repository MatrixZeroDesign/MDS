import { type DocsLocale, translate } from "../i18n";
import { Button, Divider, Typography } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "grid", gap: 24, width: "100%" }}>
			<section style={{ display: "grid", gap: 12 }} aria-label={t("水平分隔线", "Horizontal divider")}>
				<Typography as="h3" variant="title-sm">
					{t("工作空间访问权限", "Workspace access")}
				</Typography>
				<Typography tone="muted">
					{t("管理此工作空间中的成员和应用。", "Manage the people and applications in this workspace.")}
				</Typography>
				<Divider />
				<Typography variant="body-sm">{t("几秒前更新", "Last updated a few seconds ago")}</Typography>
			</section>

			<div style={{ display: "flex", alignItems: "stretch", gap: 12 }} aria-label={t("垂直分隔线", "Vertical divider")}>
				<Button variant="secondary">{t("预览", "Preview")}</Button>
				<Divider orientation="vertical" />
				<Button variant="primary">{t("发布", "Publish")}</Button>
			</div>
		</div>
	);
}
