import { type DocsLocale, translate } from "../../i18n";
import { type FloatingPlacement, Button, Tooltip, TooltipProvider } from "@matrixzero/ui";

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
		<TooltipProvider delayDuration={100}>
			<div
				role="group"
				aria-label={t("提示位置", "Tooltip placements")}
				style={{ display: "grid", gap: 12, width: "100%" }}
			>
				{placementGroups.map((group) => (
					<div key={group[0]} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
						{group.map((placement) => (
							<Tooltip key={placement} placement={placement} content={`placement="${placement}"`}>
								<Button size="sm" style={{ minWidth: 112 }}>
									{placement}
								</Button>
							</Tooltip>
						))}
					</div>
				))}
			</div>
		</TooltipProvider>
	);
}
