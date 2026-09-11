import { useEffect, useRef, useState } from "react";
import { Field, Select, type ThemeMode, type ThemePalette } from "@matrixzero/ui";
import { paletteOptions } from "./PalettePicker";
const roles = [
	["accent", "强调", "Accent"],
	["tint", "选中底色", "Selection"],
	["success", "成功", "Success"],
	["warning", "警告", "Warning"],
	["danger", "危险", "Danger"],
	["info", "信息", "Information"],
	["bg", "画布", "Canvas"],
	["surface", "内容面", "Surface"],
	["soft", "柔和底色", "Soft surface"],
	["border", "边线", "Border"],
	["text", "正文", "Text"],
	["muted", "辅助文字", "Muted text"],
] as const;
export function ColorTokens({
	locale,
	mode,
	palette,
	onPaletteChange,
}: {
	locale: "zh" | "en";
	mode: ThemeMode;
	palette: ThemePalette;
	onPaletteChange: (value: ThemePalette) => void;
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
		<section className="docs-colors" ref={ref} aria-label={locale === "zh" ? "颜色系统" : "Color system"}>
			<div className="docs-row">
				<h2>{locale === "zh" ? "颜色与层次" : "Color & hierarchy"}</h2>
				<p className="docs-muted">
					{locale === "zh" ? "主色配套层次，状态色保留语义。" : "Coordinated brand colors, consistent semantic states."}
				</p>
			</div>
			<div style={{ maxWidth: 240, marginBlockEnd: 24 }}>
				<Field label={locale === "zh" ? "配色方案" : "Palette"}>
					<Select
						value={palette}
						onValueChange={(value) => onPaletteChange(value as ThemePalette)}
						options={paletteOptions.map((option) => ({ value: option.value, label: option[locale] }))}
					/>
				</Field>
			</div>
			<div className="docs-token-grid">
				{roles.map(([role, zh, en]) => (
					<div className="docs-token" key={role}>
						<div className="docs-token-paint" style={{ background: "var(--mds-" + role + ")" }} />
						<div>
							<strong>{locale === "zh" ? zh : en}</strong>
							<code>{values[role] || "—"}</code>
							<small>--mds-{role}</small>
						</div>
					</div>
				))}
			</div>
			<div className="docs-data-palette">
				<span>{locale === "zh" ? "数据分类色" : "Categorical data"}</span>
				<div>
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<i key={n} style={{ background: "var(--mds-data-" + n + ")" }} />
					))}
				</div>
				<p className="docs-muted">
					{locale === "zh"
						? "图表颜色表达分类，不暗示成功或风险。"
						: "Chart colors distinguish categories without implying success or risk."}
				</p>
			</div>
		</section>
	);
}
