import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [open, setOpen] = useState(false);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button>{t("查看信息", "View information")}</Button>
			</PopoverTrigger>
			<PopoverContent title={t("同步状态", "Sync status")} placement="auto-start" arrow>
				<p style={{ margin: 0 }}>{t("所有更改已同步。", "All changes are up to date.")}</p>
				<Button onClick={() => setOpen(false)}>{t("知道了", "Got it")}</Button>
			</PopoverContent>
		</Popover>
	);
}
