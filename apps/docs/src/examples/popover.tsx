import { type DocsLocale, translate } from "../i18n";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, Button, Field, Input } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button>{t("快捷设置", "Quick settings")}</Button>
			</PopoverTrigger>
			<PopoverContent
				title={t("工作区设置", "Workspace settings")}
				description={t("直接在当前页面编辑。", "Edit without leaving this page.")}
			>
				<Field label={t("名称", "Name")}>
					<Input defaultValue="Matrix" />
				</Field>
				<PopoverClose asChild>
					<Button>{t("完成", "Done")}</Button>
				</PopoverClose>
			</PopoverContent>
		</Popover>
	);
}
