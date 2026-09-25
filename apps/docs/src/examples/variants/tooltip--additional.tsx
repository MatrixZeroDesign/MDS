import { type DocsLocale, translate } from "../../i18n";
import { TooltipProvider, Tooltip, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip placement="right" content={t("保存在当前设备", "Stored on this device")}>
				<Button>{t("本地保存", "Local save")}</Button>
			</Tooltip>
		</TooltipProvider>
	);
}
