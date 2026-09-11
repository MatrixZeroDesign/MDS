import { Progress } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Progress value={65} aria-label={t("上传进度", "Upload progress")} />;
}
