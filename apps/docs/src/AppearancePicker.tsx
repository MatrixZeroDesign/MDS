import {
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	IconButton,
	type ThemeMode,
} from "@matrixzero/ui";
import { Sun, Moon, Monitor, Check } from "@matrixzero/icons";
export function readSavedMode(): ThemeMode {
	try {
		const value = localStorage.getItem("mds.docs.mode");
		if (value === "light" || value === "dark" || value === "system") return value;
	} catch {
		/* Storage may be unavailable in a restricted browser. */
	}
	return "system";
}
export function saveMode(value: ThemeMode) {
	try {
		localStorage.setItem("mds.docs.mode", value);
	} catch {
		/* The current session still works. */
	}
}
export function AppearancePicker({
	mode,
	onChange,
	locale,
}: {
	mode: ThemeMode;
	onChange: (mode: ThemeMode) => void;
	locale: "zh" | "en";
}) {
	const options: { value: ThemeMode; zh: string; en: string }[] = [
		{ value: "light", zh: "浅色", en: "Light" },
		{ value: "dark", zh: "深色", en: "Dark" },
		{ value: "system", zh: "跟随系统", en: "Follow system" },
	];
	return (
		<DropdownMenu>
			<DropdownTrigger asChild>
				<IconButton
					variant="ghost"
					label={locale === "zh" ? "切换明暗主题" : "Toggle color theme"}
					icon={mode === "system" ? <Monitor size={16} /> : mode === "dark" ? <Moon size={16} /> : <Sun size={16} />}
				/>
			</DropdownTrigger>
			<DropdownContent align="end">
				{options.map((option) => (
					<DropdownItem
						key={option.value}
						role="menuitemradio"
						aria-checked={mode === option.value}
						onSelect={() => onChange(option.value)}
					>
						{option[locale]}
						{mode === option.value && <Check size={14} style={{ marginInlineStart: "auto" }} />}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownMenu>
	);
}
