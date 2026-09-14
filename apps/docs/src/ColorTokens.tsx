import { type DocsLocale, translate } from "./i18n";
import { useEffect, useRef, useState } from "react";
import { Field, Select, type ThemeMode } from "@matrixzero/ui";
import { paletteOptions, type PaletteSelection } from "./PalettePicker";
const roles = [
	["accent", "强调", "Accent"],
	["tint", "选中底色", "Selection"],
	["success", "成功", "Success"],
	["warning", "警告", "Warning"],
	["danger", "危险", "Danger"],
	["info", "信息", "Information"],
	["bg", "画布", "Canvas"],
	["surface", "内容面", "Surface"],
	["surface-inverse", "反色内容面", "Inverse surface"],
	["soft", "柔和底色", "Soft surface"],
	["border", "边线", "Border"],
	["text", "正文", "Text"],
	["muted", "辅助文字", "Muted text"],
	["text-on-inverse", "反色正文", "Text on inverse"],
	["text-muted-on-inverse", "反色辅助文字", "Muted text on inverse"],
] as const;
export function ColorTokens({
	locale,
	mode,
	palette,
	onPaletteChange,
}: {
	locale: DocsLocale;
	mode: ThemeMode;
	palette: PaletteSelection;
	onPaletteChange: (value: PaletteSelection) => void;
}) {
	const ref = useRef<HTMLElement>(null),
		[values, setValues] = useState<Record<string, string>>({});
	useEffect(() => {
		const read = () => {
			if (!ref.current) return;
			const styles = getComputedStyle(ref.current);
			const next: Record<string, string> = {};
			for (const [role] of roles) next[role] = styles.getPropertyValue("--mds-" + role).trim();
			setValues(next);
		};
		read();
		const mq = matchMedia("(prefers-color-scheme: dark)");
		mq.addEventListener("change", read);
		return () => mq.removeEventListener("change", read);
	}, [mode, palette]);
	return (
		<section className="docs-colors" ref={ref} aria-label={translate(locale, "颜色系统", "Color system")}>
			<div className="docs-row">
				<h2>{translate(locale, "颜色与层次", "Color & hierarchy")}</h2>
				<p className="docs-muted">
					{translate(locale, "主色配套层次，状态色保留语义。", "Coordinated brand colors, consistent semantic states.")}
				</p>
			</div>
			<div style={{ maxWidth: 240, marginBlockEnd: 24 }}>
				<Field label={translate(locale, "配色方案", "Palette")}>
					<Select
						value={palette}
						onValueChange={(value) => onPaletteChange(value as PaletteSelection)}
						options={[
							...paletteOptions.map((option) => ({
								value: option.value,
								label: translate(locale, option.zh, option.en),
							})),
							...(palette === "custom" ? [{ value: "custom", label: translate(locale, "自定义", "Custom") }] : []),
						]}
					/>
				</Field>
			</div>
			<div className="docs-token-grid">
				{roles.map(([role, zh, en]) => (
					<div className="docs-token" key={role}>
						<div className="docs-token-paint" style={{ background: "var(--mds-" + role + ")" }} />
						<div>
							<strong>{translate(locale, zh, en)}</strong>
							<code>{values[role] || "—"}</code>
							<small>--mds-{role}</small>
						</div>
					</div>
				))}
			</div>
			<div className="docs-data-palette">
				<span>{translate(locale, "数据分类色", "Categorical data")}</span>
				<div>
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<i key={n} style={{ background: "var(--mds-data-" + n + ")" }} />
					))}
				</div>
				<p className="docs-muted">
					{translate(
						locale,
						"图表颜色表达分类，不暗示成功或风险。",
						"Chart colors distinguish categories without implying success or risk.",
					)}
				</p>
			</div>
		</section>
	);
}
