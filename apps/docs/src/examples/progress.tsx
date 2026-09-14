import { type DocsLocale, translate } from "../i18n";
import { Progress } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Progress value={65} aria-label={t("上传进度", "Upload progress")} />;
}
