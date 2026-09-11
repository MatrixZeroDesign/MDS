import { Container, Card, CardContent } from "@matrixzero/ui";
export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Container as="section" aria-label={t("内容区域", "Content area")} maxWidth={960} gutter={24}>
			<Card>
				<CardContent>{t("居中且具有响应式留白的内容。", "Centered content with responsive gutters.")}</CardContent>
			</Card>
		</Container>
	);
}
