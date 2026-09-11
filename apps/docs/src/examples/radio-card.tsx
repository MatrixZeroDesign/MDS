import { RadioCardGroup, RadioCard } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<RadioCardGroup aria-label={t("方案", "Plan")} defaultValue="standard">
			<RadioCard value="standard" title={t("标准", "Standard")} description={t("日常使用", "Everyday use")} />
			<RadioCard value="pro" title={t("专业", "Pro")} />
		</RadioCardGroup>
	);
}
