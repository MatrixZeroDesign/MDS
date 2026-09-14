import { type DocsLocale, translate } from "./i18n";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, IconButton } from "@matrixzero/ui";
import { Check, Rows2, Rows3 } from "@matrixzero/icons";
type Density = "comfortable" | "compact";
export function readSavedDensity(): Density {
	try {
		return localStorage.getItem("mds.docs.density") === "compact" ? "compact" : "comfortable";
	} catch {
		return "comfortable";
	}
}
export function saveDensity(value: Density) {
	try {
		localStorage.setItem("mds.docs.density", value);
	} catch {
		/* Keep the current session usable. */
	}
}
export function DensityPicker({
	density,
	onChange,
	locale,
}: {
	density: Density;
	onChange: (value: Density) => void;
	locale: DocsLocale;
}) {
	return (
		<DropdownMenu>
			<DropdownTrigger asChild>
				<IconButton
					variant="ghost"
					label={translate(locale, "界面密度", "Interface density")}
					icon={density === "compact" ? <Rows3 size={16} /> : <Rows2 size={16} />}
				/>
			</DropdownTrigger>
			<DropdownContent align="end">
				{(["comfortable", "compact"] as const).map((value) => (
					<DropdownItem
						key={value}
						role="menuitemradio"
						aria-checked={density === value}
						onSelect={() => onChange(value)}
					>
						<span style={{ display: "inline-flex", alignItems: "center", gap: "var(--mds-space-field)" }}>
							{value === "comfortable" ? <Rows2 size={16} /> : <Rows3 size={16} />}
							{value === "comfortable"
								? translate(locale, "舒适", "Comfortable")
								: translate(locale, "紧凑", "Compact")}
						</span>
						{density === value && <Check size={14} style={{ marginInlineStart: "auto" }} />}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownMenu>
	);
}
