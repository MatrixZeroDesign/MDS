import { DirectionProvider, useDirection } from "./primitives/direction.js";
import { createContext, useContext, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
import { DensityContext } from "./density-context.js";
export type ThemePalette = "mint" | "mono" | "blue" | "violet" | "rose" | "amber";
export type ThemeShape = "crisp" | "balanced" | "rounded";
export type ThemeNeutral = "neutral" | "cool" | "warm";
export type ThemeScaling = "90%" | "100%" | "110%";
export type ThemeSurface = "solid" | "soft" | "translucent";
export type ThemeContrast = "standard" | "high";
export type ThemeMotion = "reduced" | "standard" | "expressive";
export type ThemeTypeScale = "compact" | "standard" | "editorial";
const PaletteContext = createContext<ThemePalette | null>(null);
export type ThemeMode = "light" | "dark" | "system";
export type ThemeStyle = CSSProperties & { [token: `--mds-${string}`]: string | number };
export interface CustomThemeOptions {
	/** Six-digit hexadecimal primary for the light theme. A dark-theme accent is derived automatically. */
	primary: string;
	/** Semantic corner preset applied across the component radius scale. */
	shape?: ThemeShape;
	/** Advanced base component radius override. Numbers are interpreted as pixels. */
	radius?: string | number;
	/** Font stack inherited by MDS components. */
	fontFamily?: string;
	/** Neutral color temperature used by backgrounds, surfaces, borders, and text. */
	neutral?: ThemeNeutral;
	/** Overall control, spacing, and typography scale. */
	scaling?: ThemeScaling;
	/** Surface treatment used by cards, menus, dialogs, and popovers. */
	surface?: ThemeSurface;
	/** Standard or stronger text, border, and focus contrast. */
	contrast?: ThemeContrast;
	/** Component motion speed and easing preset. */
	motion?: ThemeMotion;
	/** Semantic typography size preset. */
	typeScale?: ThemeTypeScale;
}
export interface ThemeColorAnalysis {
	valid: boolean;
	primary: string;
	lightAccent: string;
	darkAccent: string;
	lightContrast: number;
	darkContrast: number;
	generatedLightContrast: number;
	generatedDarkContrast: number;
	adjustedForLight: boolean;
	adjustedForDark: boolean;
}

const DEFAULT_CUSTOM_PRIMARY = "#3f66d4";
function rgb(hex: string) {
	return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}
function toHex(values: number[]) {
	return `#${values.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}
function mix(color: string, target: "#000000" | "#ffffff", amount: number) {
	const source = rgb(color);
	const destination = rgb(target);
	return toHex(source.map((value, index) => value + (destination[index] - value) * amount));
}
function luminance(color: string) {
	const channels = rgb(color).map((value) => {
		const channel = value / 255;
		return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
	});
	return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrastRatio(a: string, b: string) {
	const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (lighter + 0.05) / (darker + 0.05);
}
function accessibleAccent(color: string, background: string, target: "#000000" | "#ffffff", minimumContrast = 4.5) {
	let result = color;
	for (let amount = 0.05; contrastRatio(result, background) < minimumContrast && amount <= 1; amount += 0.05)
		result = mix(color, target, amount);
	return result;
}

/** Validates the supplied light-theme primary and reports the generated dark-theme accent. */
export function analyzeThemeColor(primary: string): ThemeColorAnalysis {
	const valid = /^#[0-9a-f]{6}$/i.test(primary);
	const normalized = valid ? primary.toLowerCase() : DEFAULT_CUSTOM_PRIMARY;
	const lightAccent = accessibleAccent(normalized, "#f8f8f7", "#000000");
	// Dark surfaces benefit from more than the bare AA threshold. The added
	// contrast keeps controls clear without changing the seed color's hue.
	const darkAccent = accessibleAccent(normalized, "#171717", "#ffffff", 6);
	return {
		valid,
		primary: normalized,
		lightAccent,
		darkAccent,
		lightContrast: contrastRatio(normalized, "#f8f8f7"),
		darkContrast: contrastRatio(normalized, "#171717"),
		generatedLightContrast: contrastRatio(lightAccent, "#f8f8f7"),
		generatedDarkContrast: contrastRatio(darkAccent, "#171717"),
		adjustedForLight: lightAccent !== normalized,
		adjustedForDark: darkAccent !== normalized,
	};
}

/** Creates portable theme tokens from one primary color, including accessible light and dark accents. */
const themeShapeRadius: Record<ThemeShape, number> = { crisp: 4, balanced: 8, rounded: 14 };

interface NeutralTokens {
	light: {
		bg: string;
		surface: string;
		soft: string;
		border: string;
		controlBorder: string;
		text: string;
		muted: string;
	};
	dark: {
		bg: string;
		surface: string;
		soft: string;
		border: string;
		controlBorder: string;
		text: string;
		muted: string;
	};
}

const themeNeutralTokens: Record<ThemeNeutral, NeutralTokens> = {
	neutral: {
		light: {
			bg: "#f8f8f7",
			surface: "#ffffff",
			soft: "#f0f0ef",
			border: "#dededb",
			controlBorder: "#858580",
			text: "#242424",
			muted: "#626262",
		},
		dark: {
			bg: "#171717",
			surface: "#222222",
			soft: "#2e2e2e",
			border: "#484848",
			controlBorder: "#8a8a8a",
			text: "#f3f3f3",
			muted: "#b3b3b3",
		},
	},
	cool: {
		light: {
			bg: "#f6f8fb",
			surface: "#ffffff",
			soft: "#edf1f6",
			border: "#d7dee8",
			controlBorder: "#758293",
			text: "#202733",
			muted: "#596574",
		},
		dark: {
			bg: "#14181f",
			surface: "#1d232c",
			soft: "#28313d",
			border: "#414c5a",
			controlBorder: "#8793a3",
			text: "#f1f5f9",
			muted: "#aeb8c5",
		},
	},
	warm: {
		light: {
			bg: "#faf8f4",
			surface: "#fffdfa",
			soft: "#f3eee6",
			border: "#e3dbcf",
			controlBorder: "#897d6d",
			text: "#29251f",
			muted: "#6a6258",
		},
		dark: {
			bg: "#1a1713",
			surface: "#25211c",
			soft: "#322c25",
			border: "#4d443a",
			controlBorder: "#938575",
			text: "#f6f1e9",
			muted: "#bdb3a6",
		},
	},
};

const themeMotionTokens: Record<ThemeMotion, ThemeStyle> = {
	reduced: {
		"--mds-duration-fast": "0ms",
		"--mds-duration-normal": "0ms",
		"--mds-duration-slow": "0ms",
		"--mds-ease-out": "linear",
		"--mds-ease-switch": "linear",
	},
	standard: {
		"--mds-duration-fast": "120ms",
		"--mds-duration-normal": "180ms",
		"--mds-duration-slow": "240ms",
		"--mds-ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
		"--mds-ease-switch": "cubic-bezier(0.2, 0.8, 0.2, 1)",
	},
	expressive: {
		"--mds-duration-fast": "160ms",
		"--mds-duration-normal": "240ms",
		"--mds-duration-slow": "360ms",
		"--mds-ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
		"--mds-ease-switch": "cubic-bezier(0.34, 1.56, 0.64, 1)",
	},
};

const themeTypeScaleTokens: Record<ThemeTypeScale, ThemeStyle> = {
	compact: {
		"--mds-type-display-base": "clamp(32px, 4.5vw, 56px)",
		"--mds-type-title-lg-base": "28px",
		"--mds-type-title-base": "22px",
		"--mds-type-title-sm-base": "17px",
		"--mds-type-body-lg-base": "15px",
		"--mds-type-body-base": "13px",
		"--mds-type-body-sm-base": "12px",
		"--mds-type-label-base": "11px",
		"--mds-type-caption-base": "10px",
	},
	standard: {
		"--mds-type-display-base": "clamp(36px, 5vw, 64px)",
		"--mds-type-title-lg-base": "32px",
		"--mds-type-title-base": "24px",
		"--mds-type-title-sm-base": "18px",
		"--mds-type-body-lg-base": "16px",
		"--mds-type-body-base": "14px",
		"--mds-type-body-sm-base": "13px",
		"--mds-type-label-base": "12px",
		"--mds-type-caption-base": "11px",
	},
	editorial: {
		"--mds-type-display-base": "clamp(42px, 6vw, 72px)",
		"--mds-type-title-lg-base": "36px",
		"--mds-type-title-base": "28px",
		"--mds-type-title-sm-base": "20px",
		"--mds-type-body-lg-base": "18px",
		"--mds-type-body-base": "16px",
		"--mds-type-body-sm-base": "14px",
		"--mds-type-label-base": "13px",
		"--mds-type-caption-base": "12px",
	},
};

function paired(light: string, dark: string) {
	return `light-dark(${light}, ${dark})`;
}

function neutralThemeTokens(neutral: ThemeNeutral, surface: ThemeSurface, contrast: ThemeContrast): ThemeStyle {
	const palette = themeNeutralTokens[neutral];
	const translucent = surface === "translucent";
	const surfaceLight = surface === "soft" ? palette.light.soft : palette.light.surface;
	const surfaceDark = surface === "soft" ? palette.dark.soft : palette.dark.surface;
	const borderLight = contrast === "high" ? palette.light.controlBorder : palette.light.border;
	const borderDark = contrast === "high" ? palette.dark.controlBorder : palette.dark.border;
	return {
		"--mds-bg": paired(palette.light.bg, palette.dark.bg),
		"--mds-surface": paired(
			translucent ? `${surfaceLight}d9` : surfaceLight,
			translucent ? `${surfaceDark}d9` : surfaceDark,
		),
		"--mds-soft": paired(palette.light.soft, palette.dark.soft),
		"--mds-border": paired(borderLight, borderDark),
		"--mds-control-border": paired(
			contrast === "high" ? palette.light.text : palette.light.controlBorder,
			contrast === "high" ? palette.dark.text : palette.dark.controlBorder,
		),
		"--mds-text": paired(palette.light.text, palette.dark.text),
		"--mds-muted":
			contrast === "high"
				? "color-mix(in srgb, var(--mds-text) 82%, var(--mds-bg))"
				: paired(palette.light.muted, palette.dark.muted),
		"--mds-hover": `color-mix(in srgb, var(--mds-text) ${contrast === "high" ? "10%" : "5%"}, var(--mds-surface))`,
		"--mds-pressed": `color-mix(in srgb, var(--mds-text) ${contrast === "high" ? "18%" : "10%"}, var(--mds-surface))`,
		"--mds-shadow":
			surface === "soft"
				? "0 2px 10px #0000000a"
				: surface === "translucent"
					? "0 12px 36px #0000001f"
					: "0 8px 24px #00000014, 0 2px 6px #0000000a",
		"--mds-surface-backdrop": translucent ? "blur(16px) saturate(140%)" : "none",
		"--mds-focus-width": contrast === "high" ? "3px" : "2px",
	};
}

export function createTheme({
	primary,
	shape,
	radius,
	fontFamily,
	neutral,
	scaling,
	surface,
	contrast,
	motion,
	typeScale,
}: CustomThemeOptions): ThemeStyle {
	const { lightAccent, darkAccent } = analyzeThemeColor(primary);
	const resolvedRadius = radius ?? (shape ? themeShapeRadius[shape] : undefined);
	const lightOnAccent =
		contrastRatio(lightAccent, "#ffffff") >= contrastRatio(lightAccent, "#171717") ? "#ffffff" : "#171717";
	const darkOnAccent =
		contrastRatio(darkAccent, "#ffffff") >= contrastRatio(darkAccent, "#171717") ? "#ffffff" : "#171717";
	return {
		"--mds-accent": `light-dark(${lightAccent}, ${darkAccent})`,
		"--mds-focus": `light-dark(${lightAccent}, ${darkAccent})`,
		"--mds-tint": `light-dark(${mix(lightAccent, "#ffffff", 0.88)}, ${mix(darkAccent, "#000000", 0.72)})`,
		"--mds-on-accent": `light-dark(${lightOnAccent}, ${darkOnAccent})`,
		...(neutral || surface || contrast
			? neutralThemeTokens(neutral ?? "neutral", surface ?? "solid", contrast ?? "standard")
			: {}),
		...(scaling ? { "--mds-scale": Number.parseInt(scaling, 10) / 100 } : {}),
		...(motion ? themeMotionTokens[motion] : {}),
		...(typeScale ? themeTypeScaleTokens[typeScale] : {}),
		...(resolvedRadius !== undefined
			? { "--mds-radius": typeof resolvedRadius === "number" ? `${resolvedRadius}px` : resolvedRadius }
			: {}),
		...(fontFamily ? { "--mds-font": fontFamily } : {}),
	};
}
const PortalContext = createContext<HTMLElement | null>(null);
export function usePortalContainer() {
	return useContext(PortalContext);
}
export interface ThemeProviderProps extends Omit<ComponentProps<"div">, "style" | "dir"> {
	dir?: "ltr" | "rtl";
	brand?: string;
	/** Preset color family. Inherits from a parent; null restores brand tokens. */
	palette?: ThemePalette | null;
	mode?: ThemeMode;
	density?: "comfortable" | "compact";
	style?: ThemeStyle;
}
/** Brand names select an explicitly imported theme. No runtime fetch or brand fallback. */
export function ThemeProvider({
	dir,
	palette,
	brand = "neutral",
	mode = "system",
	density,
	className = "",
	children,
	...props
}: ThemeProviderProps) {
	const direction = useDirection(dir);
	const inheritedDensity = useContext(DensityContext);
	const selectedDensity = density ?? inheritedDensity;
	const inheritedPalette = useContext(PaletteContext);
	const selectedPalette = palette === undefined ? inheritedPalette : palette;
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	return (
		<DensityContext.Provider value={selectedDensity}>
			<PaletteContext.Provider value={selectedPalette}>
				<DirectionProvider dir={direction}>
					<div
						{...props}
						dir={direction}
						className={`mds-root ${className}`}
						data-mds-brand={brand}
						data-mds-palette={selectedPalette ?? undefined}
						data-mds-mode={mode}
						data-mds-density={selectedDensity}
					>
						<PortalContext.Provider value={container}>
							{children}
							<div ref={setContainer} className="mds-portals" />
						</PortalContext.Provider>
					</div>
				</DirectionProvider>
			</PaletteContext.Provider>
		</DensityContext.Provider>
	);
}
