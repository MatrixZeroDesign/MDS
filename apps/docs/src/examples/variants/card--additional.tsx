import { type DocsLocale, translate } from "../../i18n";
import { useToast } from "@matrixzero/ui";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const { toast } = useToast();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("工作区", "Workspace")}</CardTitle>
				<CardDescription>{t("应用与用量", "Applications and usage")}</CardDescription>
			</CardHeader>
			<CardContent>{t("3 个应用已连接。", "3 applications connected.")}</CardContent>
			<CardFooter hidden>
				<Button
					onClick={() => {
						toast({ title: t("示例操作已完成", "Example action completed") });
					}}
				>
					{t("查看概览", "View overview")}
				</Button>
			</CardFooter>
		</Card>
	);
}
