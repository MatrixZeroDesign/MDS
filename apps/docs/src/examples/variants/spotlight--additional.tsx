import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Spotlight, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [open, setOpen] = useState(false),
		[chosen, setChosen] = useState("");
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div>
			<Button onClick={() => setOpen(true)}>{t("快捷搜索", "Quick search")}</Button>
			<Spotlight
				open={open}
				onOpenChange={setOpen}
				title={t("快捷操作", "Quick actions")}
				searchLabel={t("搜索操作", "Search actions")}
				placeholder={t("输入关键词…", "Type to search…")}
				emptyLabel={t("没有匹配项", "No matching actions")}
				closeLabel={t("关闭", "Close")}
				items={[
					{
						id: "create",
						label: t("创建项目", "Create project"),
						keywords: "new",
						disabled: true,
						onSelect: () => setChosen(t("创建项目", "Create project")),
					},
					{
						id: "settings",
						label: t("打开设置", "Open settings"),
						onSelect: () => setChosen(t("打开设置", "Open settings")),
					},
				]}
			/>
			{chosen && <p role="status">{chosen}</p>}
		</div>
	);
}
