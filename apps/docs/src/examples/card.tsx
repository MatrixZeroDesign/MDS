import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@matrixzero/ui";
export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("工作区", "Workspace")}</CardTitle>
				<CardDescription>{t("应用与用量", "Applications and usage")}</CardDescription>
			</CardHeader>
			<CardContent>{t("3 个应用已连接。", "3 applications connected.")}</CardContent>
			<CardFooter>
				<Button
					onClick={() => {
						window.location.hash = "overview";
					}}
				>
					{t("查看概览", "View overview")}
				</Button>
			</CardFooter>
		</Card>
	);
}
