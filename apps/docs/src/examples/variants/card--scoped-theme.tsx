import { type DocsLocale, translate } from "../../i18n";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Field,
	Input,
	ThemeProvider,
} from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<ThemeProvider mode="dark" palette="mono" style={{ width: "100%" }}>
			<Card>
				<CardHeader>
					<div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
						<div>
							<CardTitle>{t("夜间发布", "Nightly release")}</CardTitle>
							<CardDescription>
								{t("Card 及其子组件继承内层深色主题。", "The Card and its children inherit the inner dark theme.")}
							</CardDescription>
						</div>
						<Badge tone="success">{t("准备就绪", "Ready")}</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<Field label={t("发布名称", "Release name")}>
						<Input defaultValue="MDS 0.2" />
					</Field>
				</CardContent>
				<CardFooter style={{ display: "flex", gap: 8 }}>
					<Button variant="primary">{t("发布", "Publish")}</Button>
					<Button variant="secondary">{t("预览", "Preview")}</Button>
				</CardFooter>
			</Card>
		</ThemeProvider>
	);
}
