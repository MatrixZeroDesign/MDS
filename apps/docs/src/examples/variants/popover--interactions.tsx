import { type DocsLocale, translate } from "../../i18n";
import { Button, Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
			<Popover>
				<PopoverTrigger asChild>
					<Button>{t("点击打开", "Open on click")}</Button>
				</PopoverTrigger>
				<PopoverContent
					title={t("点击触发", "Click interaction")}
					description={t(
						"再次点击、点击外部或按 Escape 关闭。",
						"Click again, click outside, or press Escape to close.",
					)}
					arrow
				>
					<PopoverClose asChild>
						<Button size="sm">{t("完成", "Done")}</Button>
					</PopoverClose>
				</PopoverContent>
			</Popover>

			<Popover openOn="hover">
				<PopoverTrigger asChild>
					<Button>{t("悬停打开", "Open on hover")}</Button>
				</PopoverTrigger>
				<PopoverContent
					title={t("悬停触发", "Hover interaction")}
					description={t(
						"指针可以从按钮移动到浮层，键盘聚焦也会打开。",
						"Move the pointer into the surface; keyboard focus opens it too.",
					)}
					arrow
				>
					<Button size="sm">{t("浮层操作", "Surface action")}</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}
