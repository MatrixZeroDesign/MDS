import { type DocsLocale, translate } from "../i18n";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, Button, Atmosphere, Badge } from "@matrixzero/ui";
import { ArrowRight, Compass } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button>{t("查看功能导览", "View feature tour")}</Button>
			</PopoverTrigger>
			<PopoverContent
				title={t("快速找到下一步", "Find the next step quickly")}
				description={t("导览提示保持简短，并紧邻相关功能。", "Tour tips stay concise and close to the feature.")}
				placement="bottom-start"
				arrow
			>
				<Atmosphere
					tone="iris"
					style={{
						minHeight: 112,
						padding: 16,
						borderRadius: 12,
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "space-between",
						gap: 16,
					}}
				>
					<div style={{ display: "grid", gap: 8 }}>
						<Badge style={{ justifySelf: "start" }}>{t("新功能", "New feature")}</Badge>
						<strong>{t("工作区地图", "Workspace map")}</strong>
					</div>
					<Compass size={32} aria-hidden="true" />
				</Atmosphere>
				<PopoverClose asChild>
					<Button variant="primary" trailingIcon={<ArrowRight />}>
						{t("下一步", "Next")}
					</Button>
				</PopoverClose>
			</PopoverContent>
		</Popover>
	);
}
