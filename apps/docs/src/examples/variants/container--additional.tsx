import { type DocsLocale, translate } from "../../i18n";
import { Container, Card, CardContent } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Container as="section" aria-label={t("内容区域", "Content area")} maxWidth={480} gutter={16}>
			<Card>
				<CardContent>{t("居中且具有响应式留白的内容。", "Centered content with responsive gutters.")}</CardContent>
			</Card>
		</Container>
	);
}
