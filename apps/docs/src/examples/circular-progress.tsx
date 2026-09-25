import { type DocsLocale, translate } from "../i18n";
import { CircularProgress } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
			<CircularProgress value={72} showValue size="lg" aria-label={t("上传进度", "Upload progress")} />
			<CircularProgress size="sm" aria-label={t("同步中", "Syncing")} />
			<CircularProgress size="sm" state="success" aria-label={t("构建成功", "Build succeeded")} />
			<CircularProgress size="sm" state="error" aria-label={t("构建失败", "Build failed")} />
		</div>
	);
}
