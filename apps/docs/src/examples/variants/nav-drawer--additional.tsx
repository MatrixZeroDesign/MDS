import { type DocsLocale, translate } from "../../i18n";
import { Home, BookOpen } from "@matrixzero/icons";
import { useState } from "react";
import {
	NavDrawer,
	NavDrawerTrigger,
	NavDrawerContent,
	NavDrawerClose,
	NavItem,
	Button,
	SegmentedControl,
} from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [variant, setVariant] = useState<"standard" | "modal" | "rail">("modal");
	const [active, setActive] = useState("overview");
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<SegmentedControl
				label={t("抽屉模式", "Drawer variant")}
				value={variant}
				onValueChange={(v) => setVariant(v as typeof variant)}
				options={[
					{ value: "standard", label: t("标准", "Standard") },
					{ value: "modal", label: t("模态", "Modal") },
					{ value: "rail", label: t("导航轨", "Rail") },
				]}
			/>
			<NavDrawer variant={variant}>
				<NavDrawerTrigger asChild>
					<Button>{t("打开导航", "Open navigation")}</Button>
				</NavDrawerTrigger>
				<NavDrawerContent
					title="Matrix"
					navigationLabel={t("工作区导航", "Workspace navigation")}
					closeLabel={t("关闭", "Close")}
				>
					<NavDrawerClose asChild>
						<NavItem icon={<Home />} active={active === "overview"} onClick={() => setActive("overview")}>
							{t("概览", "Overview")}
						</NavItem>
					</NavDrawerClose>
					<NavDrawerClose asChild>
						<NavItem icon={<BookOpen />} active={active === "docs"} onClick={() => setActive("docs")}>
							{t("文档", "Docs")}
						</NavItem>
					</NavDrawerClose>
				</NavDrawerContent>
			</NavDrawer>
		</div>
	);
}
