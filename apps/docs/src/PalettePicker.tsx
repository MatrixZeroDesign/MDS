import {
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	IconButton,
	type ThemePalette,
} from "@matrixzero/ui";
import { Palette, Check } from "@matrixzero/icons";
export const paletteOptions: { value: ThemePalette; zh: string; en: string; color: string }[] = [
	{ value: "mint", zh: "薄荷", en: "Mint", color: "#087565" },
	{ value: "mono", zh: "黑白", en: "Monochrome", color: "#202020" },
	{ value: "blue", zh: "蓝色", en: "Blue", color: "#255bbd" },
	{ value: "violet", zh: "紫罗兰", en: "Violet", color: "#6b46c1" },
	{ value: "rose", zh: "玫瑰", en: "Rose", color: "#b42a5a" },
	{ value: "amber", zh: "琥珀", en: "Amber", color: "#936007" },
];
export function PalettePicker({
	palette,
	onChange,
	locale,
}: {
	palette: ThemePalette;
	onChange: (value: ThemePalette) => void;
	locale: "zh" | "en";
}) {
	return (
		<DropdownMenu>
			<DropdownTrigger asChild>
				<IconButton
					variant="ghost"
					label={locale === "zh" ? "配色方案" : "Color palette"}
					icon={<Palette size={16} />}
				/>
			</DropdownTrigger>
			<DropdownContent align="end">
				{paletteOptions.map((option) => (
					<DropdownItem key={option.value} onSelect={() => onChange(option.value)}>
						<span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: "50%", background: option.color }} />
						{option[locale]}
						{palette === option.value && <Check size={14} style={{ marginInlineStart: "auto" }} />}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownMenu>
	);
}
