import { ThemeProvider } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<ThemeProvider brand="mt0" mode="system">
			<p>{t("你好，Matrix。", "Hello, Matrix.")}</p>
		</ThemeProvider>
	);
}
