import { TooltipProvider, Tooltip, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<TooltipProvider>
			<Tooltip content={t("保存在当前设备", "Stored on this device")}>
				<Button>{t("本地保存", "Local save")}</Button>
			</Tooltip>
		</TooltipProvider>
	);
}
