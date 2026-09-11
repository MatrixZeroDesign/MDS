import { SideSheet, SideSheetTrigger, SideSheetContent, SideSheetClose, Button, Field, Input } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<SideSheet>
			<SideSheetTrigger asChild>
				<Button>{t("编辑", "Edit")}</Button>
			</SideSheetTrigger>
			<SideSheetContent
				title={t("编辑", "Edit")}
				description={t("更新显示名称", "Update your display name")}
				closeLabel={t("关闭", "Close")}
			>
				<Field label={t("名称", "Name")}>
					<Input defaultValue="Matrix" />
				</Field>
				<SideSheetClose asChild>
					<Button>{t("完成", "Done")}</Button>
				</SideSheetClose>
			</SideSheetContent>
		</SideSheet>
	);
}
