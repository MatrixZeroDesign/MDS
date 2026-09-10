import { PortalPage, IconsPage } from "./PortalPage";
import { lazy, Suspense, useEffect, useState } from "react";
const ChartsPage = lazy(() => import("./ChartsPage").then((module) => ({ default: module.ChartsPage })));
import { createRoot } from "react-dom/client";
import {
	ThemeProvider,
	TooltipProvider,
	Button,
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
	Avatar,
	Progress,
	Skeleton,
	Alert,
	EmptyState,
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
	NavRail,
	NavItem,
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
	PanelLeftClose,
	PanelLeftOpen,
	Inbox,
	Check,
	ShieldCheck,
} from "@matrixzero/icons";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
import "./docs.css";

const portalPages = ["system", "docs", "charts", "icons", "overview", "policy"];
function readPage() {
	const value = window.location.hash.slice(1);
	return portalPages.includes(value) ? value : "system";
}
function App() {
	const [billing, setBilling] = useState("monthly"),
		[plan, setPlan] = useState("standard");
	const [railCollapsed, setRailCollapsed] = useState(false),
		[drawerOpen, setDrawerOpen] = useState(false),
		[advancedOpen, setAdvancedOpen] = useState(false);
	const [mode, setMode] = useState<ThemeMode>("light"),
		[locale, setLocale] = useState<"zh" | "en">("zh"),
		[page, setPage] = useState(readPage),
		[density, setDensity] = useState<"comfortable" | "compact">("comfortable");
	useEffect(() => {
		const navigate = () => setPage(readPage());
		window.addEventListener("hashchange", navigate);
		return () => window.removeEventListener("hashchange", navigate);
	}, []);
	useEffect(() => {
		if (window.location.hash !== "#" + page) window.history.pushState(null, "", "#" + page);
	}, [page]);
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
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
	const [policyScope, setPolicyScope] = useState("all"),
		[policyInjection, setPolicyInjection] = useState(true),
		[policySensitive, setPolicySensitive] = useState(true),
		[savedPolicy, setSavedPolicy] = useState({ scope: "all", injection: true, sensitive: true });
	const [name, setName] = useState("默认防护 · Default protection"),
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
			setSavedPolicy({ scope: policyScope, injection: policyInjection, sensitive: policySensitive });
			setLoading(false);
			setNotice(t("所有更改已保存", "All changes saved"));
		}, 550);
	};
	const menuOptions = [
		{ value: "all", label: t("全部应用", "All applications") },
		{ value: "chat", label: t("对话服务", "Chat service") },
		{ value: "knowledge", label: t("知识检索", "Knowledge search") },
	];
	const apps = [
		["CS", "Customer support"],
		["KB", "知识检索 · Knowledge"],
		["CA", "Code assistant"],
		["AN", "Analytics"],
		["TR", "Translator"],
		["RS", "Research"],
	];
	const requests = [
		["对话服务 · Chat", "req_8f2a91", "chat-pro", "success", "248 ms"],
		["知识检索 · Knowledge", "req_7b4c20", "embed-large", "success", "82 ms"],
		["代码助手 · Code", "req_9d1e34", "code-pro", "danger", "36 ms"],
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
					{t("新建策略", "Create policy")}
				</Button>
			</DialogTrigger>
			<DialogContent
				title={t("新建策略", "Create policy")}
				description={t("为应用配置一套清晰的防护规则。", "Configure safeguards for your application.")}
				closeLabel={t("关闭", "Close")}
			>
				<form
					className="docs-stack"
					onSubmit={(e) => {
						e.preventDefault();
						setName(newName);
						setSaved(newName);
						setCreateOpen(false);
						setPage("policy");
						setNotice(t("策略已创建", "Policy created"));
					}}
				>
					<Field label={t("策略名称", "Policy name")} required>
						<Input value={newName} onChange={(e) => setNewName(e.target.value)} />
					</Field>
					<Field label={t("检测模板", "Template")}>
						<Select defaultValue="standard">
							<option value="standard">{t("标准防护", "Standard protection")}</option>
							<option value="sensitive">{t("敏感信息保护", "Sensitive data protection")}</option>
						</Select>
					</Field>
					<ChoiceMenu
						label={t("应用范围", "Applications")}
						value={scope}
						onValueChange={setScope}
						options={menuOptions}
					/>
					<Field label={t("说明", "Description")}>
						<Textarea placeholder={t("策略用途（可选）", "Policy purpose (optional)")} />
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
		<ThemeProvider brand="mt0" mode={mode} density={density} lang={locale === "zh" ? "zh-CN" : "en"}>
			<TooltipProvider delayDuration={300}>
				<Navbar className="docs-top">
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
						>
							{[
								["system", t("基础与组件", "Foundations & components")],
								["docs", t("文档指南", "Documentation")],
								["charts", t("图表", "Charts")],
								["icons", t("图标", "Icons")],
								["overview", t("运行概览", "Overview")],
								["policy", t("策略工作台", "Policy workspace")],
							].map(([id, label]) => (
								<NavItem
									key={id}
									active={page === id}
									icon={id === "system" ? <Blocks /> : id === "overview" ? <LayoutDashboard /> : <SlidersHorizontal />}
									onClick={() => {
										setPage(id);
										setDrawerOpen(false);
									}}
								>
									{label}
								</NavItem>
							))}
						</NavDrawerContent>
					</NavDrawer>
					<a href="#system" className="docs-logo">
						M<span>DS</span>
					</a>
					<span className="docs-top-title">
						MATRIX DESIGN SYSTEM <Badge>0.1 alpha</Badge>
					</span>
					<div className="docs-actions">
						<Button
							variant="ghost"
							onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
							aria-label="Change language"
						>
							{locale === "zh" ? "EN" : "中文"}
						</Button>
						<Button
							variant="ghost"
							onClick={() => setMode(mode === "dark" ? "light" : "dark")}
							aria-label={t("切换明暗主题", "Toggle color theme")}
						>
							{mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
						</Button>
						<Avatar fallback="M" alt="Matrix workspace" size="sm" />
					</div>
				</Navbar>
				<div className="docs-layout" data-collapsed={railCollapsed || undefined}>
					<NavRail className="docs-nav" label={t("主导航", "Main navigation")} collapsed={railCollapsed}>
						<small>DESIGN SYSTEM</small>
						{[
							["system", t("基础与组件", "Foundations & components")],
							["docs", t("文档指南", "Documentation")],
							["charts", t("图表", "Charts")],
							["icons", t("图标", "Icons")],
							["overview", t("运行概览", "Overview")],
							["policy", t("策略工作台", "Policy workspace")],
						].map(([id, label]) => (
							<NavItem
								key={id}
								active={page === id}
								icon={id === "system" ? <Blocks /> : id === "overview" ? <LayoutDashboard /> : <SlidersHorizontal />}
								onClick={() => {
									setPage(id);
									setNotice("");
								}}
							>
								{label}
							</NavItem>
						))}
						<div className="docs-nav-bottom">
							<ShieldCheck size={14} /> {t("同一份包，真实组件", "Built with the real package")}
						</div>
						<Button
							variant="ghost"
							aria-label={t("切换导航宽度", "Toggle navigation width")}
							aria-expanded={!railCollapsed}
							onClick={() => setRailCollapsed(!railCollapsed)}
						>
							{railCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
						</Button>
					</NavRail>
					<main id="main" className="docs-main">
						<div className="docs-page-heading">
							<div>
								<p className="docs-eyebrow">
									{page === "overview" || page === "policy" ? "MT0 / WORKSPACE" : "MATRIX / DESIGN SYSTEM"}
								</p>
								<h1>
									{page === "system"
										? "Matrix Design System"
										: page === "docs"
											? t("文档指南", "Documentation")
											: page === "charts"
												? t("图表", "Charts")
												: page === "icons"
													? t("图标", "Icons")
													: page === "overview"
														? t("运行概览", "Overview")
														: t("策略工作台", "Policy workspace")}
								</h1>
								<p className="docs-muted">
									{page === "system"
										? t("清晰、一致，也有温度。", "Clear, consistent, and considered.")
										: t("演示数据 · 未连接生产环境", "Sample data · no production connection")}
								</p>
							</div>
							{(page === "overview" || page === "policy") && actions}
						</div>
						{page === "docs" && <PortalPage locale={locale} />}
						{page === "charts" && (
							<Suspense fallback={<p role="status">{t("正在加载图表…", "Loading charts…")}</p>}>
								<ChartsPage locale={locale} />
							</Suspense>
						)}
						{page === "icons" && <IconsPage locale={locale} />}
						{page === "system" && (
							<>
								<section className="docs-type">
									<div className="docs-row">
										<h2>{t("字体与节奏", "Typography & rhythm")}</h2>
										<ChoiceMenu
											label={t("界面密度", "Density")}
											value={density}
											onValueChange={(v) => setDensity(v as typeof density)}
											options={[
												{ value: "comfortable", label: t("舒适", "Comfortable") },
												{ value: "compact", label: t("紧凑", "Compact") },
											]}
										/>
									</div>
									<div className="docs-type-grid">
										<div lang="zh-CN">
											<small>中文 · 简体</small>
											<h3>让每一次调用，清晰可见。</h3>
											<p>查看调用记录、配置防护策略，随时掌握服务状态。</p>
										</div>
										<div lang="en">
											<small>English · Latin</small>
											<h3>Clarity in every request.</h3>
											<p>Review activity, configure safeguards, and stay in control.</p>
										</div>
									</div>
									<div className="docs-numerals">
										1,284.06 <small>ms · P95 延迟 / Latency</small>
									</div>
									<div className="docs-swatches">
										{["text", "accent", "success", "warning", "danger"].map((v) => (
											<span key={v}>
												<i style={{ background: `var(--mds-${v})` }} />
												{v}
											</span>
										))}
									</div>
								</section>
								<div className="docs-grid">
									<section className="docs-card">
										<h2>
											{t("图标按钮与分段选择", "Icon buttons & segmented control")}
											<small>IconButton / SegmentedControl</small>
										</h2>
										<div className="docs-actions">
											<Tooltip content={t("添加应用", "Add application")}>
												<IconButton
													label={t("添加应用", "Add application")}
													icon={<Plus size={16} />}
													onClick={() => setNotice(t("已添加示例应用", "Sample application added"))}
												/>
											</Tooltip>
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
										<RadioCardGroup aria-label={t("防护方案", "Protection plan")} value={plan} onValueChange={setPlan}>
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
												"导航使用 Navbar、NavRail 和 NavDrawer；面板在当前页面保留上下文。",
												"The shell uses Navbar, NavRail and NavDrawer; sheets retain the page context.",
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
														<Input defaultValue="标准防护 · Standard protection" />
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
												<Button onClick={() => setNotice("Default action")}>Default</Button>
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
												<Badge>Draft</Badge>
											</div>
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
												<Input defaultValue="研发团队 · Engineering" />
											</Field>
											<Field
												label={t("端点地址", "Endpoint URL")}
												error={invalid ? t("请输入有效的 HTTPS 地址", "Enter a valid HTTPS URL") : undefined}
											>
												<Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
											</Field>
											<Field label={t("适用范围", "Scope")}>
												<Select defaultValue="all">
													<option value="all">{t("全部应用", "All applications")}</option>
													<option value="chat">{t("对话服务", "Chat service")}</option>
												</Select>
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
													<small>Automatically protect new applications</small>
												</label>
												<Switch id="auto" checked={protect} onCheckedChange={setProtect} />
											</div>
											<div className="docs-setting">
												<label htmlFor="email">
													{t("邮件通知", "Email notifications")}
													<small>{notify ? "Enabled" : "Disabled"}</small>
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
										"List / Avatar",
										<>
											<List>
												{apps.slice((listPage - 1) * 3, listPage * 3).map(([initial, title]) => (
													<ListItem
														key={title}
														leading={<Avatar alt={title} fallback={initial} />}
														trailing={
															<Button variant="ghost" aria-label={`Open ${title}`} onClick={() => setNotice(title)}>
																<ArrowUpRight size={14} />
															</Button>
														}
													>
														{title}
														<span className="mds-description">Workspace application</span>
													</ListItem>
												))}
											</List>
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
														<AccordionTrigger>{t("如何应用防护策略？", "How do safeguards apply?")}</AccordionTrigger>
														<AccordionContent>
															{t(
																"新请求会自动使用选定的防护规则。",
																"New requests automatically use the selected safeguards.",
															)}
														</AccordionContent>
													</AccordionItem>
													<AccordionItem value="two">
														<AccordionTrigger>Can I change this later?</AccordionTrigger>
														<AccordionContent>Yes. Changes apply to new requests.</AccordionContent>
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
											<Alert>
												{t("动效尊重系统“减少动态效果”设置。", "Motion respects your reduced-motion preference.")}
											</Alert>
										</>,
									)}
									{section(
										t("空状态", "Empty state"),
										"Feedback",
										<EmptyState
											title={t("暂无调用记录", "No requests yet")}
											description={t("首个请求完成后将在这里显示。", "Your first completed request will appear here.")}
											icon={<Inbox size={28} />}
											action={
												<Button onClick={() => setPage("overview")}>{t("查看演示数据", "View sample data")}</Button>
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
							<>
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
							</>
						)}
						{page === "policy" && (
							<section className="docs-card docs-policy">
								<h2>{t("基本配置", "Configuration")}</h2>
								<form
									className="docs-stack"
									onSubmit={(e) => {
										e.preventDefault();
										save();
									}}
									onReset={(e) => {
										e.preventDefault();
										setName(saved);
										setPolicyScope(savedPolicy.scope);
										setPolicyInjection(savedPolicy.injection);
										setPolicySensitive(savedPolicy.sensitive);
										setNotice(t("已恢复上次保存", "Restored saved value"));
									}}
								>
									<Field label={t("策略名称", "Policy name")} required>
										<Input value={name} onChange={(e) => setName(e.target.value)} />
									</Field>
									<Field label={t("适用范围", "Scope")}>
										<Select value={policyScope} onChange={(e) => setPolicyScope(e.target.value)}>
											<option value="all">{t("全部应用", "All applications")}</option>
											<option value="chat">{t("对话服务", "Chat service")}</option>
										</Select>
									</Field>
									<CheckField
										label={t("提示词注入", "Prompt injection")}
										checked={policyInjection}
										onCheckedChange={(v) => setPolicyInjection(!!v)}
									/>
									<CheckField
										label={t("敏感信息", "Sensitive information")}
										checked={policySensitive}
										onCheckedChange={(v) => setPolicySensitive(!!v)}
									/>
									<div className="docs-actions">
										<Button type="submit" variant="primary" loading={loading}>
											{t("保存更改", "Save changes")}
										</Button>
										<Button type="reset">{t("重置", "Reset")}</Button>
									</div>
								</form>
							</section>
						)}
						{notice && (
							<div className="docs-notice">
								<Alert tone="success">{notice}</Alert>
								<Button
									variant="ghost"
									onClick={() => setNotice("")}
									aria-label={t("关闭提示", "Dismiss notification")}
								>
									×
								</Button>
							</div>
						)}
						<footer className="docs-footer">
							Matrix Design System · {t("预览版本", "Preview release")}
							<span>React · MDS · {t("本地字体，无运行时下载", "Local fonts, no runtime downloads")}</span>
						</footer>
					</main>
				</div>
			</TooltipProvider>
		</ThemeProvider>
	);
}
createRoot(document.getElementById("root")!).render(<App />);
