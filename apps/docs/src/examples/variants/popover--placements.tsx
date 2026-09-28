import { type DocsLocale, translate } from "../../i18n";
import { type FloatingPlacement, Button, Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@matrixzero/ui";

const placementGroups = [
	["top-start", "top", "top-end"],
	["right-start", "right", "right-end"],
	["bottom-start", "bottom", "bottom-end"],
	["left-start", "left", "left-end"],
	["auto-start", "auto", "auto-end"],
] as const satisfies readonly (readonly FloatingPlacement[])[];

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div
			role="group"
			aria-label={t("浮层位置", "Popover placements")}
			style={{ display: "grid", gap: 12, width: "100%" }}
		>
			{placementGroups.map((group) => (
				<div key={group[0]} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
					{group.map((placement) => (
						<Popover key={placement}>
							<PopoverTrigger asChild>
								<Button size="sm" style={{ minWidth: 112 }}>
									{placement}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								title={`placement="${placement}"`}
								description={t(
									"滚动页面或调整窗口尺寸，浮层仍会跟随触发按钮。",
									"Scroll or resize to see the surface remain anchored.",
								)}
								placement={placement}
								arrow
							>
								<PopoverClose asChild>
									<Button size="sm">{t("关闭", "Close")}</Button>
								</PopoverClose>
							</PopoverContent>
						</Popover>
					))}
				</div>
			))}
		</div>
	);
}
