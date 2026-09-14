import { type DocsLocale, translate } from "./i18n";
import { navigate } from "./router";
import { useState } from "react";
import { useMobileViewport } from "./useMobileViewport";
import {
	Button,
	analyzeThemeColor,
	Avatar,
	Badge,
	Callout,
	Card,
	CheckField,
	Chip,
	createTheme,
	Divider,
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	Field,
	IconButton,
	Input,
	List,
	ListItem,
	NavDrawer,
	NavDrawerContent,
	NavDrawerTrigger,
	NavItem,
	NotificationBadge,
	Progress,
	SegmentedControl,
	Select,
	Slider,
	Switch,
	Tab,
	TabList,
	TabPanel,
	Tabs,
	ThemeProvider,
	Textarea,
	Typography,
	type CustomThemeOptions as MdsCustomThemeOptions,
	type ThemePalette,
} from "@matrixzero/ui";
import {
	Bell,
	BookOpen,
	Calendar,
	Check,
	Folder,
	Home,
	Palette,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	Users,
} from "@matrixzero/icons";
export type PaletteSelection = ThemePalette | "custom";
export const paletteOptions: { value: ThemePalette; zh: string; en: string; color: string }[] = [
	{ value: "mint", zh: "薄荷", en: "Mint", color: "#087565" },
	{ value: "mono", zh: "黑白", en: "Monochrome", color: "#202020" },
	{ value: "blue", zh: "蓝色", en: "Blue", color: "#255bbd" },
	{ value: "violet", zh: "紫罗兰", en: "Violet", color: "#6b46c1" },
	{ value: "rose", zh: "玫瑰", en: "Rose", color: "#b42a5a" },
	{ value: "amber", zh: "琥珀", en: "Amber", color: "#936007" },
];
const CUSTOM_COLOR_KEY = "mds.docs.custom-primary";
const CUSTOM_RADIUS_KEY = "mds.docs.custom-radius";
const CUSTOM_FONT_KEY = "mds.docs.custom-font";
const CUSTOM_OPTIONS_KEY = "mds.docs.custom-options";
const DEFAULT_CUSTOM_PRIMARY = "#202020";
export type CustomFont = "sans" | "humanist" | "geometric" | "serif" | "classic" | "mono";
type CustomShape = "crisp" | "balanced" | "rounded";
export type CustomThemeOptions = Required<
	Pick<MdsCustomThemeOptions, "neutral" | "scaling" | "surface" | "contrast" | "motion" | "typeScale">
>;
export const defaultCustomThemeOptions: CustomThemeOptions = {
	neutral: "neutral",
	scaling: "100%",
	surface: "solid",
	contrast: "standard",
	motion: "standard",
	typeScale: "standard",
};
const customShapeByRadius: Record<number, CustomShape> = { 4: "crisp", 8: "balanced", 14: "rounded" };
export const customFontStacks: Record<CustomFont, string> = {
	sans: '"Helvetica Neue", Arial, "PingFang SC", sans-serif',
	humanist: '"Avenir Next", Avenir, "Segoe UI", "PingFang SC", sans-serif',
	geometric: 'Futura, "Century Gothic", "Avenir Next", "PingFang SC", sans-serif',
	serif: 'Charter, "Iowan Old Style", Georgia, serif',
	classic: 'Baskerville, "Times New Roman", "Songti SC", serif',
	mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
};
const customFontUseCases: Record<CustomFont, { zh: string; en: string }> = {
	sans: { zh: "产品界面、工具与仪表盘", en: "Product interfaces, tools, and dashboards" },
	humanist: { zh: "服务、教育与长篇内容", en: "Services, education, and long-form content" },
	geometric: { zh: "品牌、作品集与营销网站", en: "Brands, portfolios, and marketing sites" },
	serif: { zh: "出版、杂志与故事内容", en: "Publishing, magazines, and storytelling" },
	classic: { zh: "文化、精品与正式场景", en: "Culture, premium, and formal experiences" },
	mono: { zh: "开发工具、数据与技术产品", en: "Developer tools, data, and technical products" },
};

export function readSavedPalette(): PaletteSelection {
	try {
		const value = localStorage.getItem("mds.docs.palette");
		if (value === "custom") return value;
		const option = paletteOptions.find((option) => option.value === value);
		if (option) return option.value;
	} catch {
		/* Storage may be unavailable. */
	}
	return "mono";
}
export function savePalette(value: PaletteSelection) {
	try {
		localStorage.setItem("mds.docs.palette", value);
	} catch {
		/* Keep the selection usable for this session. */
	}
}

export function readSavedCustomPrimary() {
	try {
		const value = localStorage.getItem(CUSTOM_COLOR_KEY);
		if (value && /^#[0-9a-f]{6}$/i.test(value)) return value;
	} catch {
		/* Storage may be unavailable. */
	}
	return DEFAULT_CUSTOM_PRIMARY;
}

export function saveCustomPrimary(value: string) {
	try {
		localStorage.setItem(CUSTOM_COLOR_KEY, value);
	} catch {
		/* Keep the selection usable for this session. */
	}
}

export function readSavedCustomRadius() {
	try {
		const value = Number(localStorage.getItem(CUSTOM_RADIUS_KEY));
		if ([4, 8, 14].includes(value)) return value;
	} catch {
		/* Storage may be unavailable. */
	}
	return 8;
}
export function saveCustomRadius(value: number) {
	try {
		localStorage.setItem(CUSTOM_RADIUS_KEY, String(value));
	} catch {
		/* Keep the current session usable. */
	}
}
export function readSavedCustomFont(): CustomFont {
	try {
		const value = localStorage.getItem(CUSTOM_FONT_KEY);
		if (
			value === "sans" ||
			value === "humanist" ||
			value === "geometric" ||
			value === "serif" ||
			value === "classic" ||
			value === "mono"
		)
			return value;
	} catch {
		/* Storage may be unavailable. */
	}
	return "sans";
}
export function saveCustomFont(value: CustomFont) {
	try {
		localStorage.setItem(CUSTOM_FONT_KEY, value);
	} catch {
		/* Keep the current session usable. */
	}
}
export function readSavedCustomThemeOptions(): CustomThemeOptions {
	try {
		const saved = JSON.parse(localStorage.getItem(CUSTOM_OPTIONS_KEY) ?? "null") as Partial<CustomThemeOptions> | null;
		if (saved) {
			return {
				neutral: ["neutral", "cool", "warm"].includes(saved.neutral ?? "")
					? saved.neutral!
					: defaultCustomThemeOptions.neutral,
				scaling: ["90%", "100%", "110%"].includes(saved.scaling ?? "")
					? saved.scaling!
					: defaultCustomThemeOptions.scaling,
				surface: ["solid", "soft", "translucent"].includes(saved.surface ?? "")
					? saved.surface!
					: defaultCustomThemeOptions.surface,
				contrast: ["standard", "high"].includes(saved.contrast ?? "")
					? saved.contrast!
					: defaultCustomThemeOptions.contrast,
				motion: ["reduced", "standard", "expressive"].includes(saved.motion ?? "")
					? saved.motion!
					: defaultCustomThemeOptions.motion,
				typeScale: ["compact", "standard", "editorial"].includes(saved.typeScale ?? "")
					? saved.typeScale!
					: defaultCustomThemeOptions.typeScale,
			};
		}
	} catch {
		/* Storage may be unavailable or contain an older value. */
	}
	return defaultCustomThemeOptions;
}
export function saveCustomThemeOptions(value: CustomThemeOptions) {
	try {
		localStorage.setItem(CUSTOM_OPTIONS_KEY, JSON.stringify(value));
	} catch {
		/* Keep the current session usable. */
	}
}
export function makeCustomThemeStyle(primary: string, radius: number, font: CustomFont, options: CustomThemeOptions) {
	return createTheme({
		primary,
		shape: customShapeByRadius[radius] ?? "balanced",
		fontFamily: customFontStacks[font],
		...options,
	});
}

export function PalettePicker({
	palette,
	onChange,
	customPrimary,
	onCustomPrimaryChange,
	customRadius,
	onCustomRadiusChange,
	customFont,
	onCustomFontChange,
	customThemeOptions,
	onCustomThemeOptionsChange,
	density,
	onDensityChange,
	locale,
	standalone = false,
}: {
	palette: PaletteSelection;
	onChange: (value: PaletteSelection) => void;
	customPrimary: string;
	onCustomPrimaryChange: (value: string) => void;
	customRadius: number;
	onCustomRadiusChange: (value: number) => void;
	customFont: CustomFont;
	onCustomFontChange: (value: CustomFont) => void;
	customThemeOptions: CustomThemeOptions;
	onCustomThemeOptionsChange: (value: CustomThemeOptions) => void;
	density: "comfortable" | "compact";
	onDensityChange: (value: "comfortable" | "compact") => void;
	locale: DocsLocale;
	standalone?: boolean;
}) {
	const [draftPrimary, setDraftPrimary] = useState(customPrimary);
	const [draftRadius, setDraftRadius] = useState(customRadius);
	const [draftFont, setDraftFont] = useState<CustomFont>(customFont);
	const [draftOptions, setDraftOptions] = useState<CustomThemeOptions>(customThemeOptions);
	const [draftDensity, setDraftDensity] = useState(density);
	const [previewNavCollapsed, setPreviewNavCollapsed] = useState(false);
	const mobilePreview = useMobileViewport();
	const [previewNavigationOpen, setPreviewNavigationOpen] = useState(false);
	const [acceptedAdjustment, setAcceptedAdjustment] = useState(false);
	const [suggestionSource, setSuggestionSource] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
	const previewStyle = makeCustomThemeStyle(draftPrimary, draftRadius, draftFont, draftOptions);
	const colorAnalysis = analyzeThemeColor(draftPrimary);
	const needsAdjustment = colorAnalysis.adjustedForLight;
	const showAcceptance = needsAdjustment || suggestionSource !== null;
	const canUseTheme = colorAnalysis.valid && (!needsAdjustment || acceptedAdjustment);
	const hasChanges =
		draftPrimary.toLowerCase() !== customPrimary.toLowerCase() ||
		draftRadius !== customRadius ||
		draftFont !== customFont ||
		draftDensity !== density ||
		(Object.keys(draftOptions) as (keyof CustomThemeOptions)[]).some(
			(key) => draftOptions[key] !== customThemeOptions[key],
		);
	const isDefaultDraft =
		draftPrimary.toLowerCase() === DEFAULT_CUSTOM_PRIMARY &&
		draftRadius === 8 &&
		draftFont === "sans" &&
		draftDensity === "comfortable" &&
		(Object.keys(defaultCustomThemeOptions) as (keyof CustomThemeOptions)[]).every(
			(key) => draftOptions[key] === defaultCustomThemeOptions[key],
		);
	const setupCode = `import { ThemeProvider, createTheme } from "@matrixzero/ui";\n\nconst theme = createTheme({\n  primary: "${draftPrimary.toLowerCase()}",\n  shape: "${customShapeByRadius[draftRadius] ?? "balanced"}",\n  fontFamily: ${JSON.stringify(customFontStacks[draftFont])},\n  neutral: "${draftOptions.neutral}",\n  scaling: "${draftOptions.scaling}",\n  surface: "${draftOptions.surface}",\n  contrast: "${draftOptions.contrast}",\n  motion: "${draftOptions.motion}",\n  typeScale: "${draftOptions.typeScale}",\n});\n\n<ThemeProvider mode="system" density="${draftDensity}" style={theme}>\n  <App />\n</ThemeProvider>`;
	return (
		<>
			{!standalone && (
				<DropdownMenu>
					<DropdownTrigger asChild>
						<IconButton
							variant="ghost"
							label={translate(locale, "配色方案", "Color palette")}
							icon={<Palette size={16} />}
						/>
					</DropdownTrigger>
					<DropdownContent align="end" className="docs-palette-menu">
						{paletteOptions.map((option) => (
							<DropdownItem
								key={option.value}
								className="docs-palette-option"
								data-selected={palette === option.value ? "true" : undefined}
								role="menuitemradio"
								aria-checked={palette === option.value}
								aria-label={translate(locale, option.zh, option.en)}
								onSelect={() => onChange(option.value)}
							>
								<span className="docs-palette-preview" aria-hidden="true">
									{(["light", "dark"] as const).map((mode) => (
										<ThemeProvider key={mode} palette={option.value} mode={mode} className="docs-palette-preview-mode">
											<span className="docs-palette-preview-topline">
												<span className="docs-palette-preview-dot" />
												<span>{mode === "light" ? "L" : "D"}</span>
											</span>
											<span className="docs-palette-preview-panel">
												<span className="docs-palette-preview-line" />
												<span className="docs-palette-preview-line docs-palette-preview-line-short" />
												<span className="docs-palette-preview-action" />
											</span>
										</ThemeProvider>
									))}
								</span>
								<span className="docs-palette-option-copy">
									<strong>{translate(locale, option.zh, option.en)}</strong>
									<span>{translate(locale, "浅色 · 深色", "Light · Dark")}</span>
								</span>
								<span className="docs-palette-check" aria-hidden="true">
									{palette === option.value && <Check size={15} />}
								</span>
							</DropdownItem>
						))}
						<DropdownSeparator />
						<DropdownItem className="docs-palette-builder-item" onSelect={() => navigate("/theme-builder")}>
							<span className="docs-palette-builder-icon" aria-hidden="true">
								<i />
								<i />
								<i />
							</span>
							<span>
								<strong>{translate(locale, "创建你的主题", "Make your theme")}</strong>
								<small>{translate(locale, "选择强调色，生成完整主题", "Choose an accent color")}</small>
							</span>
							{palette === "custom" && <Check size={15} />}
						</DropdownItem>
					</DropdownContent>
				</DropdownMenu>
			)}
			{standalone && (
				<section className="docs-theme-builder-page">
					<div className="docs-theme-builder-preview" style={previewStyle}>
						<ThemeProvider
							mode={previewMode}
							density={draftDensity}
							palette={null}
							style={previewStyle}
							className="docs-theme-builder-mode"
						>
							<div className="docs-theme-preview-header">
								<div className="docs-theme-preview-copy">
									<Typography as="span" variant="caption" tone="muted">
										{previewMode === "light" ? translate(locale, "浅色", "Light") : translate(locale, "深色", "Dark")}
									</Typography>
									<Typography as="h3" variant="title-sm">
										{translate(locale, "工作空间", "Workspace")}
									</Typography>
									<Typography variant="body-sm" tone="muted">
										{translate(locale, "你的主题，清晰且一致。", "Your theme, clear and consistent.")}
									</Typography>
								</div>
								<SegmentedControl
									className="docs-theme-preview-mode-switch"
									size="sm"
									shape="pill"
									label={translate(locale, "预览模式", "Preview mode")}
									value={previewMode}
									onValueChange={(value) => setPreviewMode(value as "light" | "dark")}
									options={[
										{ value: "light", label: translate(locale, "浅色", "Light") },
										{ value: "dark", label: translate(locale, "深色", "Dark") },
									]}
								/>
							</div>
							<div className="docs-theme-preview-shell" data-nav-collapsed={previewNavCollapsed || undefined}>
								<NavDrawer
									variant={mobilePreview ? "modal" : previewNavCollapsed ? "rail" : "standard"}
									open={mobilePreview && previewNavigationOpen}
									onOpenChange={setPreviewNavigationOpen}
								>
									<NavDrawerTrigger asChild>
										<Button className="docs-theme-preview-menu" variant="secondary">
											{translate(locale, "预览导航", "Preview navigation")}
										</Button>
									</NavDrawerTrigger>
									<NavDrawerContent
										className={mobilePreview ? undefined : "docs-theme-preview-navigation"}
										title={mobilePreview ? translate(locale, "预览导航", "Preview navigation") : ""}
										navigationLabel={translate(locale, "预览导航", "Preview navigation")}
										closeLabel={translate(locale, "关闭", "Close")}
									>
										<div className="docs-theme-preview-nav-header">
											<Typography variant="label">Matrix</Typography>
											{!mobilePreview && (
												<IconButton
													variant="ghost"
													size="sm"
													icon={previewNavCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
													label={
														previewNavCollapsed
															? translate(locale, "展开导航", "Expand navigation")
															: translate(locale, "折叠导航", "Collapse navigation")
													}
													onClick={() => setPreviewNavCollapsed((value) => !value)}
												/>
											)}
										</div>
										<Divider />
										<NavItem icon={<Home />} shortLabel={translate(locale, "首页", "Home")} active>
											{translate(locale, "概览", "Overview")}
										</NavItem>
										<NavItem icon={<BookOpen />} shortLabel={translate(locale, "文档", "Docs")}>
											{translate(locale, "文档", "Docs")}
										</NavItem>
										<NavItem icon={<Folder />} shortLabel={translate(locale, "项目", "Projects")}>
											{translate(locale, "项目", "Projects")}
										</NavItem>
										<NavItem icon={<Calendar />} shortLabel={translate(locale, "日历", "Calendar")}>
											{translate(locale, "日历", "Calendar")}
										</NavItem>
										<NavItem icon={<Users />} shortLabel={translate(locale, "团队", "Team")}>
											{translate(locale, "团队", "Team")}
										</NavItem>
										<NavItem icon={<Bell />} shortLabel={translate(locale, "通知", "Updates")}>
											{translate(locale, "通知", "Updates")}
										</NavItem>
										<Divider />
										<NavItem icon={<Settings />} shortLabel={translate(locale, "设置", "Settings")}>
											{translate(locale, "设置", "Settings")}
										</NavItem>
									</NavDrawerContent>
								</NavDrawer>
								<div className="docs-theme-preview-main">
									<div className="docs-theme-preview-controls">
										<div className="docs-theme-preview-action">
											<Input
												aria-label={translate(locale, "预览输入框", "Preview input")}
												placeholder={translate(locale, "项目名称", "Project name")}
											/>
											<Button variant="primary">{translate(locale, "主要操作", "Primary action")}</Button>
										</div>
										<div className="docs-theme-preview-status">
											<Chip selected>{translate(locale, "已选择", "Selected")}</Chip>
											<Badge tone="success">{translate(locale, "就绪", "Ready")}</Badge>
											<CheckField label={translate(locale, "同步", "Sync")} defaultChecked />
											<NotificationBadge
												variant="count"
												count={3}
												label={translate(locale, "3 条新通知", "3 new notifications")}
											>
												<IconButton label={translate(locale, "通知", "Notifications")} icon={<Palette size={16} />} />
											</NotificationBadge>
										</div>
										<Divider />
										<div className="docs-theme-preview-sampler">
											<div>
												<Field label={translate(locale, "团队", "Team")}>
													<Select
														defaultValue="design"
														options={[
															{ value: "design", label: translate(locale, "设计", "Design") },
															{ value: "engineering", label: translate(locale, "工程", "Engineering") },
														]}
													/>
												</Field>
												<Field label={translate(locale, "备注", "Note")}>
													<Textarea rows={2} placeholder={translate(locale, "添加说明…", "Add a note…")} />
												</Field>
											</div>
											<div>
												<SegmentedControl
													label={translate(locale, "视图", "View")}
													defaultValue="week"
													options={[
														{ value: "week", label: translate(locale, "周", "Week") },
														{ value: "month", label: translate(locale, "月", "Month") },
													]}
												/>
												<Slider
													label={translate(locale, "完成度", "Completion")}
													defaultValue={68}
													formatValue={(value) => `${value}%`}
												/>
												<List aria-label={translate(locale, "最近成员", "Recent members")}>
													<ListItem
														leading={<Avatar size="sm" fallback="AM" alt="Avery Morgan" />}
														trailing={<Badge>Admin</Badge>}
													>
														Avery Morgan
													</ListItem>
													<ListItem
														leading={<Avatar size="sm" fallback="LC" alt="Lin Chen" />}
														trailing={<Badge>Editor</Badge>}
													>
														Lin Chen
													</ListItem>
												</List>
											</div>
										</div>
										<Card variant="elevated" className="docs-theme-preview-card">
											<div className="docs-theme-preview-card-heading">
												<Avatar size="sm" fallback="M" alt="Matrix" />
												<div>
													<Typography variant="label">{translate(locale, "设计系统", "Design system")}</Typography>
													<Typography variant="caption" tone="muted">
														{translate(locale, "12 个组件已更新", "12 components updated")}
													</Typography>
												</div>
												<Badge>{translate(locale, "68% 完成", "68% complete")}</Badge>
											</div>
											<Progress value={68} aria-label={translate(locale, "设置完成度", "Setup progress")} />
											<div className="docs-theme-preview-card-setting">
												<Typography variant="body-sm">{translate(locale, "自动更新", "Automatic updates")}</Typography>
												<Switch defaultChecked aria-label={translate(locale, "自动更新", "Automatic updates")} />
											</div>
										</Card>
									</div>
								</div>
							</div>
						</ThemeProvider>
					</div>
					<div className="docs-theme-builder-settings">
						<Tabs defaultValue="brand" className="docs-theme-tabs">
							<TabList aria-label={translate(locale, "主题设置", "Theme settings")}>
								<Tab value="brand">{translate(locale, "品牌", "Brand")}</Tab>
								<Tab value="style">{translate(locale, "风格", "Style")}</Tab>
								<Tab value="behavior">{translate(locale, "行为", "Behavior")}</Tab>
								<Tab value="use">{translate(locale, "应用", "Use in your app")}</Tab>
							</TabList>
							<TabPanel value="brand">
								<div className="docs-theme-builder-controls">
									<Field label={translate(locale, "浅色模式强调色", "Light theme accent")}>
										<div className="docs-theme-color-field">
											<input
												aria-label={translate(locale, "选择强调色", "Choose accent color")}
												type="color"
												value={draftPrimary}
												onChange={(event) => {
													setDraftPrimary(event.target.value);
													setAcceptedAdjustment(false);
													setSuggestionSource(null);
												}}
											/>
											<Input
												value={draftPrimary.toUpperCase()}
												onChange={(event) => {
													const value = event.target.value;
													if (/^#[0-9a-f]{0,6}$/i.test(value)) {
														setDraftPrimary(value);
														setAcceptedAdjustment(false);
														setSuggestionSource(null);
													}
												}}
											/>
										</div>
									</Field>
									<Field
										label={translate(locale, "中性色调", "Neutral tone")}
										description={translate(
											locale,
											"控制画布与表面的冷暖。",
											"Sets the temperature of canvas and surfaces.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "中性色调", "Neutral tone")}
											value={draftOptions.neutral}
											onValueChange={(neutral) =>
												setDraftOptions((current) => ({
													...current,
													neutral: neutral as CustomThemeOptions["neutral"],
												}))
											}
											options={[
												{ value: "neutral", label: translate(locale, "中性", "Neutral") },
												{ value: "cool", label: translate(locale, "冷调", "Cool") },
												{ value: "warm", label: translate(locale, "暖调", "Warm") },
											]}
										/>
									</Field>
								</div>
								{colorAnalysis.valid ? (
									<div
										className="docs-theme-contrast-status"
										data-adjusted={needsAdjustment || undefined}
										role="status"
										aria-live="polite"
									>
										<header>
											<span>
												{!needsAdjustment && <Check size={14} />}
												{needsAdjustment
													? translate(locale, "强调色未达到 WCAG AA", "Accent fails WCAG AA")
													: translate(locale, "强调色已达到 WCAG AA", "Accent passes WCAG AA")}
											</span>
											<small>{translate(locale, "实时校验", "Live validation")}</small>
										</header>
										<div className="docs-theme-contrast-modes">
											<div data-pass={!needsAdjustment || undefined}>
												<strong>{translate(locale, "浅色", "Light")}</strong>
												<span>{colorAnalysis.lightContrast.toFixed(2)}:1</span>
												{needsAdjustment ? (
													<>
														<b aria-hidden="true">→</b>
														<code>{colorAnalysis.lightAccent}</code>
														<span>{colorAnalysis.generatedLightContrast.toFixed(2)}:1</span>
													</>
												) : (
													<small>{translate(locale, "通过", "Pass")}</small>
												)}
											</div>
											<div data-pass>
												<strong>{translate(locale, "深色", "Dark")}</strong>
												<code>{colorAnalysis.darkAccent}</code>
												<span>{colorAnalysis.generatedDarkContrast.toFixed(2)}:1</span>
												<small>{translate(locale, "通过", "Pass")}</small>
											</div>
										</div>
										{showAcceptance && (
											<div className="docs-theme-contrast-accept">
												<CheckField
													checked={acceptedAdjustment}
													onCheckedChange={(checked) => {
														if (checked === true) {
															setSuggestionSource(draftPrimary);
															setDraftPrimary(colorAnalysis.lightAccent);
															setAcceptedAdjustment(true);
														} else if (suggestionSource) {
															setDraftPrimary(suggestionSource);
															setSuggestionSource(null);
															setAcceptedAdjustment(false);
														}
													}}
													label={translate(locale, "接受 MDS 建议颜色", "Accept MDS suggested color")}
												/>
											</div>
										)}
									</div>
								) : (
									<Callout tone="danger" role="alert" title={translate(locale, "颜色格式无效", "Invalid color format")}>
										{translate(
											locale,
											"请输入六位十六进制颜色，例如 #3F66D4。",
											"Enter a six-digit hex color such as #3F66D4.",
										)}
									</Callout>
								)}
							</TabPanel>
							<TabPanel value="style">
								<div className="docs-theme-builder-controls">
									<Field label={translate(locale, "形状", "Shape")}>
										<SegmentedControl
											label={translate(locale, "圆角大小", "Corner radius")}
											value={String(draftRadius)}
											onValueChange={(value) => setDraftRadius(Number(value))}
											options={[
												{ value: "4", label: translate(locale, "利落", "Crisp") },
												{ value: "8", label: translate(locale, "平衡", "Balanced") },
												{ value: "14", label: translate(locale, "圆润", "Rounded") },
											]}
										/>
									</Field>
									<Field
										label={translate(locale, "字体", "Typeface")}
										description={translate(locale, customFontUseCases[draftFont].zh, customFontUseCases[draftFont].en)}
									>
										<Select
											value={draftFont}
											onValueChange={(value) => setDraftFont(value as CustomFont)}
											options={[
												{ value: "sans", label: translate(locale, "界面无衬线", "Interface sans") },
												{ value: "humanist", label: translate(locale, "人文无衬线", "Humanist sans") },
												{ value: "geometric", label: translate(locale, "几何无衬线", "Geometric sans") },
												{ value: "serif", label: translate(locale, "编辑衬线", "Editorial serif") },
												{ value: "classic", label: translate(locale, "经典衬线", "Classic serif") },
												{ value: "mono", label: translate(locale, "技术等宽", "Technical mono") },
											]}
										/>
									</Field>
									<Field
										label={translate(locale, "表面风格", "Surface style")}
										description={translate(
											locale,
											"选择卡片和浮层与画布的关系。",
											"Controls how cards and overlays relate to the canvas.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "表面风格", "Surface style")}
											value={draftOptions.surface}
											onValueChange={(surface) =>
												setDraftOptions((current) => ({
													...current,
													surface: surface as CustomThemeOptions["surface"],
												}))
											}
											options={[
												{ value: "solid", label: translate(locale, "实色", "Solid") },
												{ value: "soft", label: translate(locale, "柔和", "Soft") },
												{ value: "translucent", label: translate(locale, "半透明", "Translucent") },
											]}
										/>
									</Field>
									<Field
										label={translate(locale, "字号层级", "Type scale")}
										description={translate(
											locale,
											"调整标题、正文和说明文字的层次。",
											"Changes the hierarchy of headings and body text.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "字号层级", "Type scale")}
											value={draftOptions.typeScale}
											onValueChange={(typeScale) =>
												setDraftOptions((current) => ({
													...current,
													typeScale: typeScale as CustomThemeOptions["typeScale"],
												}))
											}
											options={[
												{ value: "compact", label: translate(locale, "紧凑", "Compact") },
												{ value: "standard", label: translate(locale, "标准", "Standard") },
												{ value: "editorial", label: translate(locale, "编辑", "Editorial") },
											]}
										/>
									</Field>
								</div>
							</TabPanel>
							<TabPanel value="behavior">
								<div className="docs-theme-builder-controls">
									<Field
										label={translate(locale, "界面缩放", "UI scale")}
										description={translate(
											locale,
											"整体调整控件、字体和图标。",
											"Scales controls, typography, and icons together.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "界面缩放", "UI scale")}
											value={draftOptions.scaling}
											onValueChange={(scaling) =>
												setDraftOptions((current) => ({
													...current,
													scaling: scaling as CustomThemeOptions["scaling"],
												}))
											}
											options={["90%", "100%", "110%"].map((value) => ({ value, label: value }))}
										/>
									</Field>
									<Field
										label={translate(locale, "界面密度", "Interface density")}
										description={translate(
											locale,
											"调整内部留白、列表行高与导航节奏；嵌套 ThemeProvider 可局部覆盖。",
											"Changes internal spacing, list rows, and navigation rhythm; nested ThemeProviders can override it.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "界面密度", "Interface density")}
											value={draftDensity}
											onValueChange={(value) => setDraftDensity(value as "comfortable" | "compact")}
											options={[
												{ value: "comfortable", label: translate(locale, "舒适", "Comfortable") },
												{ value: "compact", label: translate(locale, "紧凑", "Compact") },
											]}
										/>
									</Field>
									<Field
										label={translate(locale, "对比度", "Contrast")}
										description={translate(
											locale,
											"增强文字、边框和控件状态的辨识度。",
											"Raises the distinction of text, borders, and control states.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "对比度", "Contrast")}
											value={draftOptions.contrast}
											onValueChange={(contrast) =>
												setDraftOptions((current) => ({
													...current,
													contrast: contrast as CustomThemeOptions["contrast"],
												}))
											}
											options={[
												{ value: "standard", label: translate(locale, "标准", "Standard") },
												{ value: "high", label: translate(locale, "高", "High") },
											]}
										/>
									</Field>
									<Field
										label={translate(locale, "动态效果", "Motion")}
										description={translate(
											locale,
											"选择交互反馈的动效强度。",
											"Sets the intensity of interaction feedback.",
										)}
									>
										<SegmentedControl
											label={translate(locale, "动态效果", "Motion")}
											value={draftOptions.motion}
											onValueChange={(motion) =>
												setDraftOptions((current) => ({ ...current, motion: motion as CustomThemeOptions["motion"] }))
											}
											options={[
												{ value: "reduced", label: translate(locale, "精简", "Reduced") },
												{ value: "standard", label: translate(locale, "标准", "Standard") },
												{ value: "expressive", label: translate(locale, "生动", "Expressive") },
											]}
										/>
									</Field>
								</div>
							</TabPanel>
							<TabPanel value="use">
								<div className="docs-theme-setup">
									<div>
										<strong>{translate(locale, "在项目中使用", "Use in your app")}</strong>
										<span>
											{translate(locale, "复制后即可获得相同主题。", "Copy this setup to reproduce the theme.")}
										</span>
									</div>
									<pre>
										<code>{setupCode}</code>
									</pre>
									<Button
										size="sm"
										disabled={!canUseTheme}
										onClick={async () => {
											await navigator.clipboard.writeText(setupCode);
											setCopied(true);
										}}
									>
										{copied ? translate(locale, "已复制", "Copied") : translate(locale, "复制设置", "Copy setup")}
									</Button>
								</div>
							</TabPanel>
						</Tabs>
						<div className="docs-theme-builder-actions">
							<Button
								variant="primary"
								disabled={!canUseTheme || !hasChanges}
								onClick={() => {
									onCustomPrimaryChange(draftPrimary.toLowerCase());
									onCustomRadiusChange(draftRadius);
									onCustomFontChange(draftFont);
									onCustomThemeOptionsChange(draftOptions);
									onDensityChange(draftDensity);
									onChange("custom");
								}}
							>
								{translate(locale, "应用主题", "Apply theme")}
							</Button>
							<Button
								disabled={isDefaultDraft}
								onClick={() => {
									setDraftPrimary(DEFAULT_CUSTOM_PRIMARY);
									setDraftRadius(8);
									setDraftFont("sans");
									setDraftDensity("comfortable");
									setDraftOptions(defaultCustomThemeOptions);
									setAcceptedAdjustment(false);
									setSuggestionSource(null);
								}}
							>
								{translate(locale, "恢复默认", "Reset to defaults")}
							</Button>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
