import { type DocsLocale, translate, languageTag, translatePair } from "./i18n";
import { HomePage } from "./HomePage";
import { LanguagePicker, readSavedLanguage, saveLanguage } from "./LanguagePicker";
import { DensityPicker, readSavedDensity, saveDensity } from "./DensityPicker";
import { DesignPage } from "./DesignPage";
import { SystemCompositions } from "./SystemCompositions";
import { PageLoading } from "./PageLoading";
import { appPath, navigate as navigatePath, routePath as readRoutePath } from "./router";
import { showcaseCatalog } from "./showcases/catalog";
import { ShowcaseDetailFrame, ShowcasePage } from "./ShowcasePage";
import { AppearancePicker, readSavedMode, saveMode } from "./AppearancePicker";
import {
	makeCustomThemeStyle,
	PalettePicker,
	readSavedCustomFont,
	readSavedCustomThemeOptions,
	readSavedCustomPrimary,
	readSavedCustomRadius,
	readSavedPalette,
	saveCustomFont,
	saveCustomThemeOptions,
	saveCustomPrimary,
	saveCustomRadius,
	savePalette,
} from "./PalettePicker";
import { ComponentNavigation } from "./ComponentNavigation";
import { AtmosphereShowcase } from "./AtmosphereShowcase";
import { ColorTokens } from "./ColorTokens";
import { lazy, Suspense, useEffect, useState } from "react";
const PortalPage = lazy(() => import("./PortalPage").then((module) => ({ default: module.PortalPage })));
const IconsPage = lazy(() => import("./IconsPage").then((module) => ({ default: module.IconsPage })));
const ChartsPage = lazy(() => import("./ChartsPage").then((module) => ({ default: module.ChartsPage })));
import { createRoot } from "react-dom/client";
import {
	ThemeProvider,
	ToastProvider,
	Toaster,
	useToast,
	TooltipProvider,
	Button,
	Chip,
	ChipGroup,
	Field,
	Input,
	Textarea,
	Select,
	CheckField,
	Switch,
	ChoiceMenu,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogClose,
	Tooltip,
	Badge,
	NotificationBadge,
	Avatar,
	AvatarGroup,
	Progress,
	Skeleton,
	EmptyState,
	Callout,
	Banner,
	Container,
	Grid,
	Divider,
	Typography,
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	Steps,
	List,
	ListItem,
	SelectionList,
	SelectionListItem,
	Table,
	Pagination,
	RadioGroup,
	RadioItem,
	Slider,
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	IconButton,
	SegmentedControl,
	RadioCardGroup,
	RadioCard,
	Navbar,
	NavItem,
	NavLink,
	NavDrawer,
	NavDrawerTrigger,
	NavDrawerContent,
	SideSheet,
	SideSheetTrigger,
	SideSheetContent,
	SideSheetClose,
	Collapse,
	CollapseTrigger,
	CollapseContent,
} from "@matrixzero/ui";
import type { ThemeMode } from "@matrixzero/ui";
import {
	Moon,
	Sun,
	Plus,
	ArrowUpRight,
	MoreHorizontal,
	Menu,
	Blocks,
	LayoutDashboard,
	SlidersHorizontal,
	Inbox,
	Bell,
	Check,
	ShieldCheck,
	BookOpen,
	ChartBar,
	Palette,
} from "@matrixzero/icons";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
import "./docs.css";

const portalPages = [
	"design",
	"home",
	"showcase",
	"system",
	"theme-builder",
	"docs",
	"charts",
	"icons",
	"overview",
	...showcaseCatalog.map((item) => item.id),
];
function readPage() {
	const value = readRoutePath().slice(1).split("/")[0];
	return portalPages.includes(value) ? value : "home";
}
function ToastFeedback({ message, consume }: { message: string; consume: () => void }) {
	const { toast } = useToast();
	useEffect(() => {
		if (message) {
			toast({ title: message, tone: "success" });
			consume();
		}
	}, [message, consume, toast]);
	return null;
}
function App() {
	const [showPreviewBanner, setShowPreviewBanner] = useState(() => {
		try {
			return sessionStorage.getItem("mds.docs.preview-dismissed") !== "true";
		} catch {
			return true;
		}
	});
	const [palette, updatePalette] = useState(readSavedPalette);
	const [customPrimary, updateCustomPrimary] = useState(readSavedCustomPrimary);
	const [customRadius, updateCustomRadius] = useState(readSavedCustomRadius);
	const [customFont, updateCustomFont] = useState(readSavedCustomFont);
	const [customThemeOptions, updateCustomThemeOptions] = useState(readSavedCustomThemeOptions);
	const setPalette = (value: Parameters<typeof savePalette>[0]) => {
		updatePalette(value);
		savePalette(value);
	};
	const setCustomPrimary = (value: string) => {
		updateCustomPrimary(value);
		saveCustomPrimary(value);
	};
	const setCustomRadius = (value: number) => {
		updateCustomRadius(value);
		saveCustomRadius(value);
	};
	const setCustomFont = (value: Parameters<typeof saveCustomFont>[0]) => {
		updateCustomFont(value);
		saveCustomFont(value);
	};
	const setCustomThemeOptions = (value: Parameters<typeof saveCustomThemeOptions>[0]) => {
		updateCustomThemeOptions(value);
		saveCustomThemeOptions(value);
	};
	const [bannerVisible, setBannerVisible] = useState(true);
	const [galleryChips, setGalleryChips] = useState(["design", "accessibility"]);
	const [gallerySelection, setGallerySelection] = useState("support");
	const [billing, setBilling] = useState("monthly"),
		[plan, setPlan] = useState("standard");
	const [drawerOpen, setDrawerOpen] = useState(false),
		[advancedOpen, setAdvancedOpen] = useState(false);
	const [mode, setMode] = useState<ThemeMode>(readSavedMode),
		[locale, setLocale] = useState<DocsLocale>(readSavedLanguage),
		[page, setPage] = useState(readPage),
		[density, updateDensity] = useState<"comfortable" | "compact">(readSavedDensity);
	const direction = locale === "ar" ? "rtl" : "ltr";
	const setDensity = (value: "comfortable" | "compact") => {
		updateDensity(value);
		saveDensity(value);
	};
	const [routePath, setRoutePath] = useState(readRoutePath);
	useEffect(() => {
		const navigate = () => {
			setPage(readPage());
			setRoutePath(readRoutePath());
		};
		window.addEventListener("popstate", navigate);
		return () => window.removeEventListener("popstate", navigate);
	}, []);
	useEffect(() => {
		if (readPage() !== page) navigatePath("/" + page);
	}, [page]);
	useEffect(() => {
		const main = document.getElementById("main");
		if (!main) return;
		const syncTitle = () => {
			const heading = main.querySelector("h1")?.textContent?.trim();
			const title = heading ? heading + " · MDS" : "Matrix Design System";
			if (document.title !== title) document.title = title;
		};
		syncTitle();
		const observer = new MutationObserver(syncTitle);
		observer.observe(main, { childList: true, subtree: true, characterData: true });
		return () => observer.disconnect();
	}, [routePath, locale]);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	useEffect(() => {
		document.documentElement.lang = languageTag(locale);
		document.documentElement.dir = direction;
	}, [locale, direction]);
	const area =
		page === "theme-builder"
			? "design"
			: page === "system" || page === "docs"
				? "components"
				: ["overview", "showcase", ...showcaseCatalog.map((item) => item.id)].includes(page)
					? "showcase"
					: page;
	const primaryItems = [
		["home", t("首页", "Home"), "home"],
		["design", t("设计", "Design"), "design"],
		["docs", t("组件", "Components"), "components"],
		["icons", t("图标", "Icons"), "icons"],
		["charts", t("图表", "Charts"), "charts"],
		["showcase", t("应用示例", "Showcase"), "showcase"],
	];
	const secondaryItems =
		area === "components"
			? [
					["system", t("组件总览", "Component gallery")],
					["docs", t("文档指南", "Documentation")],
				]
			: area === "charts"
				? [["charts", t("图表总览", "Chart overview")]]
				: area === "showcase"
					? [
							["showcase", t("全部场景", "All scenarios")],
							...showcaseCatalog.map((item) => [item.id, translatePair(locale, item.title)]),
						]
					: [];
	const navIcon = (id: string) =>
		id === "system" ? (
			<Blocks />
		) : id === "docs" ? (
			<BookOpen />
		) : id === "charts" ? (
			<ChartBar />
		) : id === "icons" ? (
			<Palette />
		) : id === "governance" ? (
			<ShieldCheck />
		) : (
			<LayoutDashboard />
		);
	const [scope, setScope] = useState("all"),
		[notify, setNotify] = useState(false),
		[protect, setProtect] = useState(true),
		[step, setStep] = useState(0),
		[listPage, setListPage] = useState(1);
	const [endpoint, setEndpoint] = useState("invalid-endpoint"),
		[notice, setNotice] = useState(""),
		[loading, setLoading] = useState(false),
		[percent, setPercent] = useState(0),
		[exporting, setExporting] = useState(false);
	const [releaseEnvironment, setReleaseEnvironment] = useState("production"),
		[peerApproval, setPeerApproval] = useState(true),
		[securityChecks, setSecurityChecks] = useState(true),
		[savedGovernance, setSavedGovernance] = useState({ environment: "production", approval: true, security: true });
	const [name, setName] = useState(t("生产发布控制", "Production release controls")),
		[saved, setSaved] = useState(name),
		[createOpen, setCreateOpen] = useState(false),
		[newName, setNewName] = useState(""),
		[risk, setRisk] = useState("70"),
		[period, setPeriod] = useState("24h"),
		[requestFilter, setRequestFilter] = useState("all");
	const invalid = (() => {
		try {
			return new URL(endpoint).protocol !== "https:";
		} catch {
			return true;
		}
	})();
	useEffect(() => {
		if (!exporting) return;
		const timer = setInterval(() => setPercent((v) => Math.min(100, v + 10)), 160);
		return () => clearInterval(timer);
	}, [exporting]);
	useEffect(() => {
		if (percent === 100) {
			setExporting(false);
			setNotice(t("导出完成 · 演示数据", "Export complete · sample data"));
		}
	}, [percent]);
	const save = () => {
		setLoading(true);
		setTimeout(() => {
			setSaved(name);
			setSavedGovernance({ environment: releaseEnvironment, approval: peerApproval, security: securityChecks });
			setLoading(false);
			setNotice(t("发布规则已保存", "Release rules saved"));
		}, 550);
	};
	const menuOptions = [
		{ value: "all", label: t("全部应用", "All applications") },
		{ value: "chat", label: t("对话服务", "Chat service") },
		{ value: "knowledge", label: t("知识检索", "Knowledge search") },
	];
	const apps = [
		["CS", t("客户支持", "Customer support")],
		["KB", t("知识检索", "Knowledge")],
		["CA", t("代码助手", "Code assistant")],
		["AN", t("数据分析", "Analytics")],
		["TR", t("翻译助手", "Translator")],
		["RS", t("研究助手", "Research")],
	];
	const requests = [
		[t("对话服务", "Chat"), "req_8f2a91", "chat-pro", "success", "248 ms"],
		[t("知识检索", "Knowledge"), "req_7b4c20", "embed-large", "success", "82 ms"],
		[t("代码助手", "Code"), "req_9d1e34", "code-pro", "danger", "36 ms"],
	];
	const section = (title: string, sub: string, children: React.ReactNode) => (
		<section className="docs-card">
			<h2>
				{title}
				<small>{sub}</small>
			</h2>
			{children}
		</section>
	);
	const actions = (
		<Dialog open={createOpen} onOpenChange={setCreateOpen}>
			<DialogTrigger asChild>
				<Button variant="primary">
					<Plus size={15} />
					{t("新建发布规则", "Create release rule")}
				</Button>
			</DialogTrigger>
			<DialogContent
				title={t("新建发布规则", "Create release rule")}
				description={t(
					"为生产变更定义审批和验证要求。",
					"Define approval and verification requirements for production changes.",
				)}
				closeLabel={t("关闭", "Close")}
			>
				<form
					className="docs-stack"
					onSubmit={(e) => {
						e.preventDefault();
						setName(newName);
						setSaved(newName);
						setCreateOpen(false);
						setPage("governance");
						setNotice(t("发布规则已创建", "Release rule created"));
					}}
				>
					<Field label={t("规则名称", "Rule name")} required>
						<Input value={newName} onChange={(e) => setNewName(e.target.value)} />
					</Field>
					<Field label={t("规则模板", "Rule template")}>
						<Select
							name="template"
							defaultValue="standard"
							options={[
								{ value: "standard", label: t("标准生产发布", "Standard production release") },
								{ value: "regulated", label: t("受监管变更", "Regulated change") },
							]}
						/>
					</Field>
					<Field label={t("环境", "Environment")}>
						<Select
							name="environment"
							defaultValue="production"
							options={[
								{ value: "production", label: t("生产环境", "Production") },
								{ value: "critical", label: t("关键服务", "Critical services") },
							]}
						/>
					</Field>
					<Field label={t("说明", "Description")}>
						<Textarea
							placeholder={t("描述此规则适用的变更（可选）", "Describe the changes this rule covers (optional)")}
						/>
					</Field>
					<div className="docs-actions">
						<Button type="submit" variant="primary">
							{t("创建", "Create")}
						</Button>
						<DialogClose asChild>
							<Button>{t("取消", "Cancel")}</Button>
						</DialogClose>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
	return (
		<ThemeProvider
			className="docs-app"
			palette={palette === "custom" ? null : palette}
			style={
				palette === "custom"
					? makeCustomThemeStyle(customPrimary, customRadius, customFont, customThemeOptions)
					: undefined
			}
			data-custom-theme={palette === "custom" || undefined}
			dir={direction}
			brand="mt0"
			mode={mode}
			density={density}
			lang={languageTag(locale)}
		>
			<ToastProvider label={t("通知", "Notification")}>
				<Toaster
					label={t("通知 ({hotkey})", "Notifications ({hotkey})")}
					closeLabel={t("关闭通知", "Dismiss notification")}
				/>
				<TooltipProvider delayDuration={300}>
					{showPreviewBanner && (
						<Banner
							className="docs-preview-banner"
							tone="neutral"
							label={t("预览版说明", "Preview notice")}
							dismissLabel={t("关闭预览版说明", "Dismiss preview notice")}
							onDismiss={() => {
								setShowPreviewBanner(false);
								try {
									sessionStorage.setItem("mds.docs.preview-dismissed", "true");
								} catch {
									/* Session state still works. */
								}
							}}
							action={<a href={appPath("/docs/start")}>{t("快速开始", "Get started")}</a>}
						>
							{t(
								"MDS 预览版 · 组件持续完善中，交互示例使用演示数据。",
								"MDS preview · Components are evolving. Interactive examples use demo data.",
							)}
						</Banner>
					)}
					<Navbar className="docs-top" hideOnScroll>
						<NavDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
							<NavDrawerTrigger asChild>
								<Button className="docs-mobile-menu" variant="ghost" aria-label={t("打开导航", "Open navigation")}>
									<Menu size={18} />
								</Button>
							</NavDrawerTrigger>
							<NavDrawerContent
								title={t("工作区导航", "Workspace navigation")}
								closeLabel={t("关闭导航", "Close navigation")}
								navigationLabel={t("移动导航", "Mobile navigation")}
								className="docs-navigation-drawer"
							>
								{primaryItems.map(([id, label, section]) => (
									<NavItem
										key={id}
										active={area === section}
										icon={navIcon(id)}
										onClick={() => {
											setPage(id);
											setDrawerOpen(false);
										}}
									>
										{label}
									</NavItem>
								))}
								{secondaryItems.length > 0 && (
									<div className="docs-drawer-secondary">
										<p className="docs-eyebrow">
											{area === "components"
												? t("组件导航", "Component navigation")
												: area === "charts"
													? t("图表导航", "Chart navigation")
													: t("应用示例", "Showcase")}
										</p>
										{area === "components" || area === "charts" ? (
											<ComponentNavigation
												key={area}
												kind={area === "charts" ? "charts" : "ui"}
												locale={locale}
												onNavigate={() => setDrawerOpen(false)}
											/>
										) : (
											secondaryItems.map(([id, label]) => (
												<NavItem
													key={id}
													active={page === id}
													onClick={() => {
														setPage(id);
														setDrawerOpen(false);
													}}
												>
													{label}
												</NavItem>
											))
										)}
									</div>
								)}
							</NavDrawerContent>
						</NavDrawer>
						<a href={appPath("/home")} className="docs-logo" aria-label="MDS Home">
							M<span>DS</span>
						</a>
						<nav className="docs-primary-nav" aria-label={t("全站导航", "Site navigation")}>
							{primaryItems.map(([id, label, section]) => (
								<NavLink key={id} href={appPath(`/${id}`)} active={area === section}>
									{label}
								</NavLink>
							))}
						</nav>
						<div className="docs-actions">
							<LanguagePicker
								locale={locale}
								onChange={(value) => {
									setLocale(value);
									saveLanguage(value);
								}}
							/>
							<DensityPicker density={density} onChange={setDensity} locale={locale} />
							<AppearancePicker
								mode={mode}
								locale={locale}
								onChange={(value) => {
									setMode(value);
									saveMode(value);
								}}
							/>
							<PalettePicker
								palette={palette}
								onChange={setPalette}
								customPrimary={customPrimary}
								onCustomPrimaryChange={setCustomPrimary}
								customRadius={customRadius}
								onCustomRadiusChange={setCustomRadius}
								customFont={customFont}
								onCustomFontChange={setCustomFont}
								customThemeOptions={customThemeOptions}
								onCustomThemeOptionsChange={setCustomThemeOptions}
								density={density}
								onDensityChange={setDensity}
								locale={locale}
							/>
						</div>
					</Navbar>
					<div className="docs-layout" data-sidebar={secondaryItems.length > 0 || undefined}>
						{secondaryItems.length > 0 && (
							<NavDrawer variant="standard">
								<NavDrawerContent
									className="docs-nav"
									navigationLabel={t("主导航", "Main navigation")}
									title={
										area === "components"
											? t("组件", "COMPONENTS")
											: area === "charts"
												? t("图表", "CHARTS")
												: t("应用示例", "SHOWCASE")
									}
									closeLabel={t("关闭导航", "Close navigation")}
								>
									<div id="docs-navigation-items" className="docs-nav-items">
										{area === "components" || area === "charts" ? (
											<ComponentNavigation key={area} kind={area === "charts" ? "charts" : "ui"} locale={locale} />
										) : (
											secondaryItems.map(([id, label]) => (
												<NavLink key={id} href={appPath(`/${id}`)} active={page === id} onClick={() => setNotice("")}>
													{label}
												</NavLink>
											))
										)}
									</div>
								</NavDrawerContent>
							</NavDrawer>
						)}
						<main id="main" className="docs-main" data-area={area}>
							<Container
								className="docs-page-container"
								maxWidth={page === "theme-builder" ? 1600 : area === "components" || area === "charts" ? 1440 : 1280}
								gutter={0}
							>
								{!(page === "home" || page === "docs" || (page === "charts" && routePath.split("/")[2])) && (
									<div className="docs-page-heading">
										<div>
											<p className="docs-eyebrow">MATRIX / DESIGN SYSTEM</p>
											<h1>
												{page === "home"
													? "Matrix Design System"
													: page === "design"
														? t("设计", "Design")
														: page === "showcase"
															? t("应用示例", "Showcase")
															: page === "system"
																? "Matrix Design System"
																: page === "theme-builder"
																	? t("创建你的主题", "Make your theme")
																	: page === "docs"
																		? t("文档指南", "Documentation")
																		: page === "charts"
																			? t("图表", "Charts")
																			: page === "icons"
																				? t("图标", "Icons")
																				: page === "overview"
																					? t("运行概览", "Overview")
																					: (translatePair(
																							locale,
																							showcaseCatalog.find((item) => item.id === page)?.title ?? [],
																						) ?? t("发布治理", "Release governance"))}
											</h1>
											{page !== "design" &&
												page !== "overview" &&
												page !== "governance" &&
												!page.startsWith("showcase-") && (
													<p className="docs-muted">
														{page === "home"
															? t(
																	"从基础到体验，用一致的语言构建界面。",
																	"A considered language for every part of your interface.",
																)
															: page === "showcase"
																? t("在真实页面组合中探索组件。", "Explore components in complete product experiences.")
																: page === "system"
																	? t("清晰、一致，也有温度。", "Clear, consistent, and considered.")
																	: page === "theme-builder"
																		? t(
																				"在完整的浅色与深色界面中调整品牌、形状、字体和行为。",
																				"Tune brand, shape, type, and behavior in complete light and dark previews.",
																			)
																		: page === "docs"
																			? t(
																					"安装、组件 API 与设计规范。",
																					"Installation, component APIs and design guidelines.",
																				)
																			: page === "icons"
																				? t(
																						"为 Matrix 独立绘制的图标集合。",
																						"An independently drawn icon collection for Matrix.",
																					)
																				: page === "charts"
																					? t(
																							"清晰的数据表达，完整的交互示例。",
																							"Clear data presentation with interactive examples.",
																						)
																					: null}
													</p>
												)}
										</div>
									</div>
								)}
								{page === "home" && <HomePage locale={locale} />}
								{(page === "showcase" || page.startsWith("showcase-")) && <ShowcasePage locale={locale} page={page} />}
								{page === "docs" && (
									<Suspense fallback={<PageLoading locale={locale} />}>
										<PortalPage locale={locale} />
									</Suspense>
								)}
								{page === "charts" && (
									<Suspense fallback={<PageLoading locale={locale} />}>
										<ChartsPage locale={locale} />
									</Suspense>
								)}
								{page === "icons" && (
									<Suspense fallback={<PageLoading locale={locale} />}>
										<IconsPage locale={locale} />
									</Suspense>
								)}
								{page === "design" && (
									<>
										<DesignPage locale={locale} />
										<section className="docs-type">
											<h2>{t("字体与节奏", "Typography & rhythm")}</h2>
											<div className="docs-type-grid">
												<div lang={languageTag(locale)}>
													<h3>{t("让每一次调用，清晰可见。", "Clarity in every request.")}</h3>
													<p>
														{t(
															"查看调用记录、配置防护策略，随时掌握服务状态。",
															"Review activity, configure safeguards, and stay in control.",
														)}
													</p>
												</div>
											</div>
											<div className="docs-numerals">
												1,284.06 <small>{t("ms · P95 延迟", "ms · P95 latency")}</small>
											</div>
										</section>
										<ColorTokens locale={locale} mode={mode} palette={palette} onPaletteChange={setPalette} />
										<AtmosphereShowcase locale={locale} />
									</>
								)}
								{page === "system" && <SystemCompositions locale={locale} />}
								{page === "theme-builder" && (
									<PalettePicker
										standalone
										palette={palette}
										onChange={setPalette}
										customPrimary={customPrimary}
										onCustomPrimaryChange={setCustomPrimary}
										customRadius={customRadius}
										onCustomRadiusChange={setCustomRadius}
										customFont={customFont}
										onCustomFontChange={setCustomFont}
										customThemeOptions={customThemeOptions}
										onCustomThemeOptionsChange={setCustomThemeOptions}
										density={density}
										onDensityChange={setDensity}
										locale={locale}
									/>
								)}
								{page === "system" && (
									<>
										<div className="docs-grid">
											<section className="docs-card">
												<h2>
													{t("图标按钮与分段选择", "Icon buttons & segmented control")}
													<small>IconButton / SegmentedControl</small>
												</h2>
												<div className="docs-actions">
													<NotificationBadge variant="count" count={3} label={t("3 项待处理更新", "3 pending updates")}>
														<Tooltip content={t("添加应用", "Add application")}>
															<IconButton
																label={t("添加应用", "Add application")}
																icon={<Plus size={16} />}
																onClick={() => setNotice(t("已添加示例应用", "Sample application added"))}
															/>
														</Tooltip>
													</NotificationBadge>
													<IconButton
														label={t("打开详情", "Open details")}
														icon={<ArrowUpRight size={16} />}
														variant="ghost"
														onClick={() => setNotice(t("详情已打开", "Details opened"))}
													/>
													<IconButton
														label={t("无权限操作", "Unavailable action")}
														icon={<ShieldCheck size={16} />}
														disabled
													/>
												</div>
												<SegmentedControl
													label={t("计费周期", "Billing period")}
													value={billing}
													onValueChange={setBilling}
													options={[
														{ value: "monthly", label: t("月付", "Monthly") },
														{ value: "yearly", label: t("年付", "Yearly") },
														{ value: "custom", label: t("自定义", "Custom"), disabled: true },
													]}
												/>
												<p className="docs-muted" role="status">
													{billing === "monthly"
														? t("按月结算，可随时调整。", "Billed monthly. Adjust at any time.")
														: t("按年结算，每年续订一次。", "Billed annually. Renews once per year.")}
												</p>
											</section>
											<section className="docs-card">
												<h2>
													{t("卡片式单选", "Radio cards")}
													<small>RadioCard</small>
												</h2>
												<RadioCardGroup
													aria-label={t("防护方案", "Protection plan")}
													value={plan}
													onValueChange={setPlan}
												>
													<RadioCard
														value="standard"
														title={t("标准防护", "Standard")}
														description={t("检测注入与敏感信息", "Detect injection and sensitive data")}
														icon={<ShieldCheck size={16} />}
													/>
													<RadioCard
														value="observe"
														title={t("观察模式", "Observe")}
														description={t("记录结果，不拦截请求", "Log results without blocking")}
													/>
													<RadioCard
														value="managed"
														title={t("组织管理", "Managed")}
														description={t("由管理员配置", "Configured by administrators")}
														disabled
													/>
												</RadioCardGroup>
												<p className="docs-muted" role="status">
													{plan === "standard"
														? t("已选择标准防护", "Standard protection selected")
														: t("已选择观察模式", "Observation mode selected")}
												</p>
											</section>

											<section className="docs-card">
												<h2>
													{t("侧边面板与折叠", "Side sheet & collapse")}
													<small>SideSheet / Collapse</small>
												</h2>
												<p className="docs-muted">
													{t(
														"导航使用 Navbar、NavDrawerPanel 和 NavDrawer；面板在当前页面保留上下文。",
														"The shell uses Navbar, NavDrawerPanel and NavDrawer; sheets retain the page context.",
													)}
												</p>
												<SideSheet>
													<SideSheetTrigger asChild>
														<Button>{t("打开侧边面板", "Open side sheet")}</Button>
													</SideSheetTrigger>
													<SideSheetContent
														title={t("策略详情", "Policy details")}
														description={t(
															"无需离开当前页面即可查看和编辑。",
															"Inspect and edit without leaving this page.",
														)}
														closeLabel={t("关闭侧边面板", "Close side sheet")}
													>
														<div className="docs-stack">
															<Field label={t("策略名称", "Policy name")}>
																<Input defaultValue={t("标准防护", "Standard protection")} />
															</Field>
															<ChoiceMenu
																label={t("面板应用范围", "Sheet applications")}
																value={scope}
																onValueChange={setScope}
																options={menuOptions}
															/>
															<CheckField label={t("启用防护", "Enable protection")} defaultChecked />
															<SideSheetClose asChild>
																<Button
																	variant="primary"
																	onClick={() => setNotice(t("面板更改已保存", "Sheet changes saved"))}
																>
																	{t("完成", "Done")}
																</Button>
															</SideSheetClose>
														</div>
													</SideSheetContent>
												</SideSheet>
												<Collapse open={advancedOpen} onOpenChange={setAdvancedOpen}>
													<CollapseTrigger asChild>
														<Button variant="ghost">
															{advancedOpen
																? t("收起高级设置", "Hide advanced settings")
																: t("展开高级设置", "Show advanced settings")}
														</Button>
													</CollapseTrigger>
													<CollapseContent>
														<div className="docs-stack" style={{ paddingTop: 16 }}>
															<Field label={t("超时时间 / 秒", "Timeout / seconds")}>
																<Input type="number" min={1} defaultValue={30} />
															</Field>
															<p className="docs-muted">
																{t(
																	"独立展开区域，不要求组成手风琴。",
																	"An independent disclosure, without an accordion group.",
																)}
															</p>
														</div>
													</CollapseContent>
												</Collapse>
											</section>

											{section(
												t("按钮与操作", "Buttons & actions"),
												"Buttons",
												<>
													<div className="docs-actions">
														<Button variant="primary" onClick={() => setNotice(t("更改已保存", "Changes saved"))}>
															{t("保存", "Save")}
														</Button>
														<Button onClick={() => setNotice(t("预览已更新", "Preview updated"))}>
															{t("预览", "Preview")}
														</Button>
														<Button variant="ghost" onClick={() => setNotice(t("已取消", "Cancelled"))}>
															{t("取消", "Cancel")}
														</Button>
														<Button disabled>{t("不可用", "Disabled")}</Button>
													</div>
													<div className="docs-actions">
														<Button size="sm" onClick={() => setNotice("Small action")}>
															Small
														</Button>
														<Button onClick={() => setNotice("Default action")}>{t("默认", "Default")}</Button>
														<Button size="lg" onClick={() => setNotice("Large action")}>
															Large
														</Button>
													</div>
													<Button loading={loading} onClick={save}>
														{t("保存示例", "Save example")}
													</Button>
													<div className="docs-actions">
														<Badge tone="success">✓ {t("正常", "Healthy")}</Badge>
														<Badge tone="warning">{t("待审查", "Review")}</Badge>
														<Badge tone="danger">× {t("已拦截", "Blocked")}</Badge>
														<Badge>{t("草稿", "Draft")}</Badge>
													</div>
													<ChipGroup label={t("内容筛选", "Content filters")}>
														{[
															["design", t("设计", "Design")],
															["accessibility", t("无障碍", "Accessibility")],
															["updates", t("更新", "Updates")],
														].map(([value, label]) => (
															<Chip
																key={value}
																selected={galleryChips.includes(value)}
																onSelectedChange={(selected) =>
																	setGalleryChips((current) =>
																		selected ? [...current, value] : current.filter((item) => item !== value),
																	)
																}
															>
																{label}
															</Chip>
														))}
													</ChipGroup>
													<NotificationBadge variant="dot" label={t("有新通知", "New notification")}>
														<IconButton label={t("通知", "Notifications")} icon={<Bell size={16} />} />
													</NotificationBadge>
												</>,
											)}
											{section(
												t("输入与校验", "Inputs & validation"),
												"Field",
												<div className="docs-stack">
													<Field
														label={t("工作区名称", "Workspace name")}
														description={t("中英文使用同一套垂直节奏。", "A shared vertical rhythm across languages.")}
													>
														<Input defaultValue={t("研发团队", "Engineering")} />
													</Field>
													<Field
														label={t("端点地址", "Endpoint URL")}
														error={invalid ? t("请输入有效的 HTTPS 地址", "Enter a valid HTTPS URL") : undefined}
													>
														<Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
													</Field>
													<Field label={t("适用范围", "Scope")}>
														<Select
															defaultValue="all"
															options={[
																{ value: "all", label: t("全部应用", "All applications") },
																{ value: "chat", label: t("对话服务", "Chat service") },
															]}
														/>
													</Field>
												</div>,
											)}
											{section(
												t("开关与选择", "Switches & selection"),
												"Switch / Checkbox",
												<>
													<div className="docs-setting">
														<label htmlFor="auto">
															{t("自动防护", "Automatic protection")}
															<small>{t("自动保护新应用", "Automatically protect new applications")}</small>
														</label>
														<Switch id="auto" checked={protect} onCheckedChange={setProtect} />
													</div>
													<div className="docs-setting">
														<label htmlFor="email">
															{t("邮件通知", "Email notifications")}
															<small>{notify ? t("开启", "On") : t("关闭", "Off")}</small>
														</label>
														<Switch id="email" checked={notify} onCheckedChange={setNotify} />
													</div>
													<CheckField
														label={t("提示词注入", "Prompt injection")}
														description={t("识别越权指令与角色覆盖", "Detect instruction and role overrides")}
														defaultChecked
													/>
													<CheckField label={t("自定义词库", "Custom dictionary")} />
													<RadioGroup defaultValue="block" aria-label={t("命中行为", "Detection action")}>
														<RadioItem value="block">{t("拦截", "Block")}</RadioItem>
														<RadioItem value="log">{t("仅记录", "Log only")}</RadioItem>
													</RadioGroup>
												</>,
											)}
											{section(
												t("菜单与浮层", "Menus & overlays"),
												"ChoiceMenu / Dialog",
												<>
													<ChoiceMenu
														label={t("筛选应用", "Filter applications")}
														value={scope}
														onValueChange={setScope}
														options={menuOptions}
													/>
													<p className="docs-muted">
														{t("打开菜单时保持背景稳定。", "The background stays stable while the menu opens.")}
													</p>
													<div className="docs-actions">
														{actions}
														<Tooltip content={t("只改变此演示中的配置", "Changes apply only to this demo")}>
															<Button>{t("提示信息", "Tooltip")}</Button>
														</Tooltip>
														<DropdownMenu modal={false}>
															<DropdownTrigger asChild>
																<Button aria-label={t("更多操作", "More actions")}>
																	<MoreHorizontal size={16} />
																</Button>
															</DropdownTrigger>
															<DropdownContent>
																<DropdownItem onSelect={() => setNotice(t("链接已准备好", "Link is ready"))}>
																	{t("分享", "Share")}
																</DropdownItem>
																<DropdownSeparator />
																<DropdownItem onSelect={() => setNotice(t("导出已排队", "Export queued"))}>
																	{t("导出", "Export")}
																</DropdownItem>
															</DropdownContent>
														</DropdownMenu>
													</div>
												</>,
											)}
											{section(
												t("步骤", "Steps"),
												"Steps",
												<>
													<Steps
														label={t("创建应用流程", "Application setup")}
														current={step}
														steps={[
															{ id: "details", label: t("基本信息", "Details") },
															{ id: "protect", label: t("防护策略", "Safeguards") },
															{ id: "done", label: t("完成", "Complete") },
														]}
													/>
													<div className="docs-step-body">
														<h3>
															{
																[
																	t("为应用命名", "Name your application"),
																	t("确认防护策略", "Confirm safeguards"),
																	t("应用已就绪", "Your application is ready"),
																][step]
															}
														</h3>
														<p className="docs-muted">
															{
																[
																	t("添加一个易于识别的名称。", "Choose a recognizable name."),
																	t("标准防护已选择。", "Standard protection is selected."),
																	t("可以开始发送请求了。", "You can start sending requests."),
																][step]
															}
														</p>
													</div>
													<div className="docs-actions">
														<Button disabled={step === 0} onClick={() => setStep(step - 1)}>
															{t("上一步", "Back")}
														</Button>
														<Button variant="primary" onClick={() => setStep((step + 1) % 3)}>
															{step === 2 ? t("重新开始", "Start again") : t("继续", "Continue")}
														</Button>
													</div>
												</>,
											)}
											{section(
												t("列表与头像", "Lists & avatars"),
												"List / Avatar / AvatarGroup",
												<>
													<div className="docs-avatar-groups">
														{(["sm", "md", "lg"] as const).map((size) => (
															<div key={size}>
																<span className="mds-description">
																	{size === "sm"
																		? t("小号", "Small")
																		: size === "md"
																			? t("默认 · 还有 3 位成员", "Default · 3 more members")
																			: t("大号", "Large")}
																</span>
																<AvatarGroup
																	size={size}
																	label={t("项目成员", "Project members")}
																	max={3}
																	overflowLabel={(count) => t(`还有 ${count} 位成员`, `${count} more members`)}
																	members={[
																		{ name: t("陈晨", "Chen Chen"), fallback: t("陈", "CC") },
																		{ name: "Alex Morgan", fallback: "AM" },
																		{ name: t("林雨", "Lin Yu"), fallback: t("林", "LY") },
																		{ name: "Sam Lee", fallback: "SL" },
																		{ name: t("周宁", "Zhou Ning"), fallback: t("周", "ZN") },
																		{ name: "Taylor Kim", fallback: "TK" },
																	]}
																/>
															</div>
														))}
													</div>
													<List>
														{apps.slice((listPage - 1) * 3, listPage * 3).map(([initial, title]) => (
															<ListItem
																key={title}
																leading={<Avatar alt={title} fallback={initial} />}
																trailing={
																	<Button
																		variant="ghost"
																		aria-label={t(`打开${title}`, `Open ${title}`)}
																		onClick={() => setNotice(title)}
																	>
																		<ArrowUpRight size={14} />
																	</Button>
																}
															>
																{title}
																<span className="mds-description">{t("工作区应用", "Workspace application")}</span>
															</ListItem>
														))}
													</List>
													<SelectionList
														label={t("选择工作区", "Choose a workspace")}
														value={gallerySelection}
														onValueChange={setGallerySelection}
													>
														<SelectionListItem
															value="support"
															trailing={<Badge tone="success">{t("在线", "Live")}</Badge>}
														>
															{t("客户支持", "Customer support")}
														</SelectionListItem>
														<SelectionListItem value="knowledge" trailing={<Badge>{t("草稿", "Draft")}</Badge>}>
															{t("知识库", "Knowledge base")}
														</SelectionListItem>
													</SelectionList>
													<Pagination
														page={listPage}
														pages={2}
														onPageChange={setListPage}
														label={t("应用分页", "Applications pagination")}
														previousLabel={t("上一页", "Previous")}
														nextLabel={t("下一页", "Next")}
													/>
												</>,
											)}
											{section(
												t("标签页与折叠", "Tabs & accordion"),
												"Navigation",
												<Tabs defaultValue="settings">
													<TabList aria-label={t("配置内容", "Configuration")}>
														<Tab value="settings">{t("配置", "Settings")}</Tab>
														<Tab value="history">{t("变更记录", "History")}</Tab>
													</TabList>
													<TabPanel value="settings">
														<Accordion type="single" collapsible defaultValue="one">
															<AccordionItem value="one">
																<AccordionTrigger>
																	{t("如何应用防护策略？", "How do safeguards apply?")}
																</AccordionTrigger>
																<AccordionContent>
																	{t(
																		"新请求会自动使用选定的防护规则。",
																		"New requests automatically use the selected safeguards.",
																	)}
																</AccordionContent>
															</AccordionItem>
															<AccordionItem value="two">
																<AccordionTrigger>{t("之后可以更改吗？", "Can I change this later?")}</AccordionTrigger>
																<AccordionContent>
																	{t("可以，更改将应用于新请求。", "Yes. Changes apply to new requests.")}
																</AccordionContent>
															</AccordionItem>
														</Accordion>
													</TabPanel>
													<TabPanel value="history">
														<List>
															<ListItem leading={<Check size={16} />}>
																{t("策略已更新", "Policy updated")}
																<span className="mds-description">14:32 · Emma</span>
															</ListItem>
														</List>
													</TabPanel>
												</Tabs>,
											)}
											{section(
												t("进度与反馈", "Progress & feedback"),
												"Motion",
												<>
													<div className="docs-row">
														<span>{t("导出调用记录", "Export requests")}</span>
														<output>{percent}%</output>
													</div>
													<Progress value={percent} aria-label={t("导出进度", "Export progress")} />
													<div className="docs-actions">
														<Button
															loading={exporting}
															onClick={() => {
																setPercent(0);
																setExporting(true);
															}}
														>
															{t("开始导出", "Start export")}
														</Button>
														<Button
															disabled={!exporting}
															onClick={() => {
																setExporting(false);
																setNotice(t("导出已取消", "Export cancelled"));
															}}
														>
															{t("取消", "Cancel")}
														</Button>
													</div>
													<Field label={t("风险阈值", "Risk threshold")} description={risk + "%"}>
														<Slider value={risk} onChange={(e) => setRisk(e.target.value)} min={0} max={100} step={5} />
													</Field>
													<Callout role="status">
														{t("动效尊重系统“减少动态效果”设置。", "Motion respects your reduced-motion preference.")}
													</Callout>
												</>,
											)}
											{section(
												t("页面通知", "Banner"),
												"Banner",
												bannerVisible ? (
													<Banner
														label={t("服务通知", "Service notice")}
														title={t("新版本已就绪", "An update is ready")}
														onDismiss={() => setBannerVisible(false)}
														dismissLabel={t("关闭通知", "Dismiss notice")}
														action={
															<Button size="sm" onClick={() => setPage("docs")}>
																{t("查看详情", "View details")}
															</Button>
														}
													>
														{t("更新后可使用新的组件与图标。", "The update includes new components and icons.")}
													</Banner>
												) : (
													<Button autoFocus onClick={() => setBannerVisible(true)}>
														{t("重新显示通知", "Show notice again")}
													</Button>
												),
											)}
											<div className="docs-gallery-layout-group">
												<div className="docs-gallery-short-stack">
													{section(
														t("内容卡片", "Cards"),
														"Card",
														<Card>
															<CardHeader>
																<CardTitle>{t("工作区概览", "Workspace overview")}</CardTitle>
																<CardDescription>
																	{t("管理应用、成员与使用情况。", "Manage applications, members and usage.")}
																</CardDescription>
															</CardHeader>
															<CardContent>
																<p>{t("3 个应用已连接。", "3 applications connected.")}</p>
																<Badge tone="success">{t("运行正常", "Healthy")}</Badge>
															</CardContent>
															<CardFooter>
																<Button onClick={() => setNotice(t("示例操作已完成", "Example action completed"))}>
																	{t("打开工作区", "Open workspace")}
																</Button>
															</CardFooter>
														</Card>,
													)}
													{section(
														t("居中容器", "Container"),
														"Layout",
														<div style={{ background: "var(--mds-soft)", paddingBlock: 16, borderRadius: 12 }}>
															<Container maxWidth={360} gutter={24}>
																<Card variant="subtle">
																	<CardContent>
																		{t(
																			"内容最大宽度 360px，左右各留白 24px；窄屏自动收缩。",
																			"Maximum width 360px with 24px inline gutters; fluid on narrow screens.",
																		)}
																	</CardContent>
																</Card>
															</Container>
														</div>,
													)}
													{section(
														t("网格、分隔与排版", "Grid, divider & typography"),
														"Grid / Divider / Typography",
														<div style={{ display: "grid", gap: 16 }}>
															<Grid minColumnWidth={110} gap={12}>
																{[t("设计", "Design"), t("工程", "Engineering"), t("研究", "Research")].map(
																	(label, index) => (
																		<Card key={label} variant="plain">
																			<Typography variant="overline" tone="muted">
																				0{index + 1}
																			</Typography>
																			<Typography as="h3" variant="title-sm">
																				{label}
																			</Typography>
																		</Card>
																	),
																)}
															</Grid>
															<Divider decorative />
															<Typography variant="body-sm" tone="muted">
																{t("规则布局默认跟随界面密度。", "Regular layouts follow the interface density.")}
															</Typography>
														</div>,
													)}
												</div>
												{section(
													t("提示说明", "Callout"),
													"Callout",
													<>
														<Callout
															title={t("开始之前", "Before you start")}
															action={
																<Button size="sm" onClick={() => setPage("docs")}>
																	{t("阅读指南", "Read guide")}
																</Button>
															}
														>
															{t(
																"先配置工作区，再添加应用。",
																"Configure your workspace before adding an application.",
															)}
														</Callout>
														<Callout tone="success" title={t("连接已验证", "Connection verified")}>
															{t("可以开始发送请求。", "You can now send requests.")}
														</Callout>
														<Callout tone="warning" title={t("检查影响范围", "Review the scope")}>
															{t("修改将应用于所有新请求。", "Changes apply to all new requests.")}
														</Callout>
														<Callout tone="danger" title={t("删除前请备份", "Back up before deleting")}>
															{t("已删除的数据无法恢复。", "Deleted data cannot be recovered.")}
														</Callout>
														<Callout tone="neutral" icon={false}>
															{t("提示：可随时调整这些设置。", "Tip: you can change these settings at any time.")}
														</Callout>
													</>,
												)}
											</div>
											{section(
												t("空状态", "Empty state"),
												"Feedback",
												<EmptyState
													title={t("暂无调用记录", "No requests yet")}
													description={t(
														"首个请求完成后将在这里显示。",
														"Your first completed request will appear here.",
													)}
													icon={<Inbox size={28} />}
													action={
														<Button onClick={() => setNotice(t("示例操作已完成", "Example action completed"))}>
															{t("查看演示数据", "View sample data")}
														</Button>
													}
												/>,
											)}
											{section(
												t("加载与骨架", "Loading & skeleton"),
												"Loading",
												<>
													<Skeleton />
													<Skeleton style={{ width: "70%" }} />
													<Skeleton style={{ width: "85%" }} />
													<Progress value={null} aria-label={t("正在加载", "Loading")} />
													<p className="docs-muted">
														{t("短促的反馈，克制的持续动效。", "Brief feedback, restrained continuous motion.")}
													</p>
												</>,
											)}
										</div>
									</>
								)}
								{page === "overview" && (
									<ShowcaseDetailFrame locale={locale} page="overview">
										<div className="docs-row">
											<ChoiceMenu
												label={t("时间范围", "Time range")}
												value={period}
												onValueChange={setPeriod}
												options={[
													{ value: "24h", label: t("近24小时", "Last 24 hours") },
													{ value: "7d", label: t("近7天", "Last 7 days") },
												]}
											/>
											<ChoiceMenu
												label={t("调用状态", "Request status")}
												value={requestFilter}
												onValueChange={setRequestFilter}
												options={[
													{ value: "all", label: t("全部状态", "All statuses") },
													{ value: "danger", label: t("已拦截", "Blocked") },
												]}
											/>
										</div>
										<div className="docs-metrics">
											<div>
												<small>{t("请求总量", "Total requests")}</small>
												<strong>{period === "24h" ? "31,330" : "219,310"}</strong>
											</div>
											<div>
												<small>{t("成功率", "Success rate")}</small>
												<strong>
													99.97<small>%</small>
												</strong>
											</div>
											<div>
												<small>P95 {t("延迟", "latency")}</small>
												<strong>
													284 <small>ms</small>
												</strong>
											</div>
										</div>
										<section className="docs-card">
											<h2>{t("最近调用", "Recent requests")}</h2>
											<Table>
												<thead>
													<tr>
														<th>{t("应用 / 请求", "Application / request")}</th>
														<th>{t("模型", "Model")}</th>
														<th>{t("状态", "Status")}</th>
														<th>{t("延迟", "Latency")}</th>
													</tr>
												</thead>
												<tbody>
													{requests
														.filter((r) => requestFilter === "all" || r[3] === requestFilter)
														.map((r) => (
															<tr key={r[1]}>
																<td>
																	<span data-testid="app-name">{r[0]}</span>
																	<span className="mds-description docs-mono">{r[1]}</span>
																</td>
																<td>{r[2]}</td>
																<td>
																	<Badge tone={r[3] as "success" | "danger"}>
																		{r[3] === "success" ? t("✓ 成功", "✓ Success") : t("× 已拦截", "× Blocked")}
																	</Badge>
																</td>
																<td>{r[4]}</td>
															</tr>
														))}
												</tbody>
											</Table>
										</section>
									</ShowcaseDetailFrame>
								)}
								{page === "governance" && (
									<ShowcaseDetailFrame locale={locale} page="governance">
										<section className="docs-card docs-policy">
											<div className="docs-policy-heading">
												<div>
													<p className="docs-eyebrow">{t("生产环境", "PRODUCTION")}</p>
													<h2>{t("发布控制", "Release controls")}</h2>
													<p className="docs-muted">
														{t(
															"在部署开始前强制执行审批与自动化检查。",
															"Enforce approvals and automated checks before a deployment can begin.",
														)}
													</p>
												</div>
												<div className="docs-policy-actions">
													<Badge tone="success">{t("已启用", "Active")}</Badge>
													{actions}
												</div>
											</div>
											<div className="docs-policy-grid">
												<form
													className="docs-stack"
													onSubmit={(e) => {
														e.preventDefault();
														save();
													}}
													onReset={(e) => {
														e.preventDefault();
														setName(saved);
														setReleaseEnvironment(savedGovernance.environment);
														setPeerApproval(savedGovernance.approval);
														setSecurityChecks(savedGovernance.security);
														setNotice(t("已恢复已保存规则", "Restored saved rules"));
													}}
												>
													<Field label={t("规则名称", "Rule name")} required>
														<Input value={name} onChange={(e) => setName(e.target.value)} />
													</Field>
													<Field label={t("环境", "Environment")}>
														<Select
															value={releaseEnvironment}
															onValueChange={setReleaseEnvironment}
															options={[
																{ value: "production", label: t("生产环境", "Production") },
																{ value: "critical", label: t("关键服务", "Critical services") },
															]}
														/>
													</Field>
													<CheckField
														label={t("需要同行审批", "Require peer approval")}
														checked={peerApproval}
														onCheckedChange={(v) => setPeerApproval(!!v)}
													/>
													<CheckField
														label={t("需要通过安全检查", "Require passing security checks")}
														checked={securityChecks}
														onCheckedChange={(v) => setSecurityChecks(!!v)}
													/>
													<div className="docs-actions">
														<Button type="submit" variant="primary" loading={loading}>
															{t("保存发布规则", "Save release rules")}
														</Button>
														<Button type="reset">{t("重置", "Reset")}</Button>
													</div>
												</form>
												<aside className="docs-policy-summary">
													<h3>{t("执行摘要", "Enforcement summary")}</h3>
													<div>
														<span>{t("目标", "Target")}</span>
														<strong>
															{releaseEnvironment === "production"
																? t("生产环境", "Production")
																: t("关键服务", "Critical services")}
														</strong>
													</div>
													<div>
														<span>{t("审批", "Approval")}</span>
														<strong>{peerApproval ? t("需要", "Required") : t("可选", "Optional")}</strong>
													</div>
													<div>
														<span>{t("安全门禁", "Security gate")}</span>
														<strong>
															{securityChecks ? t("阻止失败的检查", "Blocks failed checks") : t("仅记录", "Audit only")}
														</strong>
													</div>
													<p>
														{t("每次规则变更都会写入审计日志。", "Every rule change is recorded in the audit log.")}
													</p>
												</aside>
											</div>
										</section>
									</ShowcaseDetailFrame>
								)}
								<ToastFeedback message={notice} consume={() => setNotice("")} />
								<footer className="docs-footer">Matrix Design System</footer>
							</Container>
						</main>
					</div>
				</TooltipProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
createRoot(document.getElementById("root")!).render(<App />);
