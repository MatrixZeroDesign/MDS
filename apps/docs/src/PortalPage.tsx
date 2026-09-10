import { useState } from "react";
import { Button, Input, Table, Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";
import * as Icons from "@matrixzero/icons";
const entries = [
	[
		"ThemeProvider",
		"brand, mode, density, style",
		"主题根与浮层隔离 / Theme and portal scope",
		'<ThemeProvider brand="mt0" mode="system">{children}</ThemeProvider>',
	],
	[
		"Button / IconButton",
		"variant, size, loading / label, icon",
		"操作与图标按钮 / Actions",
		'<IconButton label="Add" icon={<Plus />} onClick={add} />',
	],
	[
		"Field / Input / Select",
		"label, description, error, required, disabled",
		"标签、说明、校验与原生表单 / Forms",
		'<Field label="Name" required><Input name="name" /></Field>',
	],
	[
		"Checkbox / CheckField",
		"checked, defaultChecked, onCheckedChange",
		"布尔及混合状态 / Checked and mixed",
		'<CheckField label="Protect" description="New requests" defaultChecked />',
	],
	[
		"RadioGroup / RadioCard",
		"value, onValueChange / title, description",
		"普通或整卡单选 / Single selection",
		'<RadioCardGroup defaultValue="standard"><RadioCard value="standard" title="Standard" /></RadioCardGroup>',
	],
	[
		"Switch",
		"checked, onCheckedChange, id",
		"立即生效的布尔开关 / Immediate toggle",
		'<label htmlFor="auto">Automatic</label><Switch id="auto" checked={value} onCheckedChange={setValue} />',
	],
	[
		"SegmentedControl",
		"label, options, value, onValueChange",
		"互斥偏好选择 / Exclusive choices",
		'<SegmentedControl label="Billing" value={billing} onValueChange={setBilling} options={options} />',
	],
	[
		"ChoiceMenu",
		"label, options, value, onValueChange",
		"非模态菜单，非 combobox / Non-modal menu",
		'<ChoiceMenu label="Scope" value={scope} options={options} onValueChange={setScope} />',
	],
	[
		"DropdownMenu",
		"modal, open, onOpenChange",
		"操作菜单 / Action menu",
		"<DropdownMenu modal={false}><DropdownTrigger asChild><Button>Actions</Button></DropdownTrigger><DropdownContent><DropdownItem onSelect={save}>Save</DropdownItem></DropdownContent></DropdownMenu>",
	],
	[
		"Dialog / SideSheet",
		"open, onOpenChange / title, description, closeLabel",
		"模态任务面与侧边面板 / Task surfaces",
		'<SideSheet><SideSheetTrigger asChild><Button>Edit</Button></SideSheetTrigger><SideSheetContent title="Edit" closeLabel="Close">{form}</SideSheetContent></SideSheet>',
	],
	[
		"Navbar / NavRail / NavItem",
		"collapsed, label / active, icon",
		"桌面导航 / Desktop navigation",
		'<NavRail label="Main" collapsed={collapsed}><NavItem active icon={<Blocks />}>Components</NavItem></NavRail>',
	],
	[
		"NavDrawer",
		"navigationLabel, title, closeLabel",
		"移动导航 / Mobile navigation",
		'<NavDrawer><NavDrawerTrigger asChild><Button>Menu</Button></NavDrawerTrigger><NavDrawerContent title="Navigation" navigationLabel="Main" closeLabel="Close">{items}</NavDrawerContent></NavDrawer>',
	],
	[
		"Collapse / Accordion",
		"open, onOpenChange / type, value",
		"独立展开与分组展开 / Disclosure",
		"<Collapse><CollapseTrigger asChild><Button>Advanced</Button></CollapseTrigger><CollapseContent>{content}</CollapseContent></Collapse>",
	],
	[
		"Tabs",
		"value, defaultValue, onValueChange",
		"内容切换，方向键导航 / Content tabs",
		'<Tabs defaultValue="a"><TabList aria-label="View"><Tab value="a">Overview</Tab></TabList><TabPanel value="a">{content}</TabPanel></Tabs>',
	],
	[
		"Avatar / Badge",
		"src, alt, fallback, size / tone",
		"身份与状态 / Identity and status",
		'<Avatar alt="Emma Chen" fallback="EC" /><Badge tone="success">Healthy</Badge>',
	],
	[
		"List / Table / Pagination",
		"children / page, pages, onPageChange",
		"数据结构与分页 / Data and pagination",
		'<Pagination page={page} pages={3} onPageChange={setPage} label="Pages" previousLabel="Previous" nextLabel="Next" />',
	],
	[
		"Steps / Progress",
		"steps, current, label / value",
		"任务阶段与完成进度 / Progress",
		'<Progress value={65} aria-label="Upload progress" />',
	],
	[
		"Tooltip / Alert / EmptyState",
		"content / tone / title, description, action",
		"帮助与反馈 / Feedback",
		'<TooltipProvider><Tooltip content="Saved locally"><Button>Help</Button></Tooltip></TooltipProvider>',
	],
	[
		"LineChart / AreaChart / BarChart",
		"title, data, series, labels, stacked",
		"笛卡尔图表 / Cartesian charts",
		'<LineChart title="Requests" data={data} series={[{key:"requests",label:"Requests"}]} />',
	],
	[
		"DonutChart",
		"title, data, labels, formatValue",
		"非负数值占比 / Nonnegative proportions",
		'<DonutChart title="Mix" data={[{label:"Chat",value:64},{label:"Code",value:36}]} />',
	],
];
export function PortalPage({ locale }: { locale: "zh" | "en" }) {
	const [query, setQuery] = useState(""),
		[copied, setCopied] = useState(""),
		t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Tabs defaultValue="start">
			<TabList aria-label={t("文档章节", "Documentation sections")}>
				<Tab value="start">{t("快速开始", "Getting started")}</Tab>
				<Tab value="api">{t("组件 API", "Component API")}</Tab>
				<Tab value="theme">{t("主题与动效", "Themes & motion")}</Tab>
			</TabList>
			<TabPanel value="start">
				<article className="docs-article">
					<h2>{t("安装所需的包", "Install the packages you need")}</h2>
					<p>
						{t(
							"三个包独立发布。基础 UI 自动依赖 icons，charts 按需安装。",
							"Three independently published packages. UI depends on icons; charts are optional.",
						)}
					</p>
					<pre>
						<code>
							npm install --save-exact @matrixzero/ui@0.1.0-alpha.1{String.fromCharCode(10)}npm install --save-exact
							@matrixzero/charts@0.1.0-alpha.1
						</code>
					</pre>
					<h3>{t("私有仓库配置", "Private registry configuration")}</h3>
					<pre>
						<code>
							{
								"@matrixzero:registry=https://gitlab.com/api/v4/projects/86296621/packages/npm/\n//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}"
							}
						</code>
					</pre>
					<p>
						{t(
							"通过环境变量注入只读令牌，不提交实际令牌。",
							"Inject a read-only token through the environment; never commit the token.",
						)}
					</p>
					<h3>{t("接入主题", "Add the theme root")}</h3>
					<pre>
						<code>{`import { ThemeProvider, Field, Input, Button } from '@matrixzero/ui';
import '@matrixzero/ui/styles.css';
import '@matrixzero/ui/themes/mt0.css';

<ThemeProvider brand="mt0" mode="system">
  <Field label="工作区 / Workspace" required>
    <Input name="workspace" />
  </Field>
  <Button variant="primary">保存 Save</Button>
</ThemeProvider>`}</code>
					</pre>
					<h3>{t("使用示例与 API", "Examples and API")}</h3>
					<p>
						{t(
							"“基础与组件”展示真实包组件，“图表”展示可交互数据与数据表。API 页列出常用属性和组合示例，完整类型随包发布。",
							"Foundations shows real package components. Charts includes interactive examples and data tables. The API tab lists common props and compositions; full TypeScript definitions ship with each package.",
						)}
					</p>
				</article>
			</TabPanel>
			<TabPanel value="api">
				<div className="docs-stack">
					<Input
						aria-label={t("搜索组件文档", "Search component documentation")}
						placeholder={t("搜索组件，例如 Dialog…", "Search components, e.g. Dialog…")}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					{entries
						.filter((e) => e.join(" ").toLowerCase().includes(query.toLowerCase()))
						.map(([name, props, desc, code]) => (
							<section className="docs-card" key={name}>
								<div className="docs-row">
									<h2>{name}</h2>
									<Button
										size="sm"
										onClick={async () => {
											try {
												await navigator.clipboard.writeText(code);
												setCopied(name);
											} catch {
												setCopied("error");
											}
										}}
									>
										{copied === name ? t("已复制", "Copied") : t("复制示例", "Copy example")}
									</Button>
								</div>
								<p className="docs-muted">{desc}</p>
								<Table>
									<thead>
										<tr>
											<th>{t("常用属性", "Common props")}</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style={{ whiteSpace: "normal" }}>
												<code>{props}</code>
											</td>
										</tr>
									</tbody>
								</Table>
								<pre>
									<code>{code}</code>
								</pre>
							</section>
						))}
					{!entries.some((e) => e.join(" ").toLowerCase().includes(query.toLowerCase())) && (
						<p>{t("没有匹配的组件", "No matching components")}</p>
					)}
					<p role="status" className="docs-muted">
						{copied === "error"
							? t("无法访问剪贴板，请手动复制代码。", "Clipboard unavailable; select and copy the code manually.")
							: ""}
					</p>
				</div>
			</TabPanel>
			<TabPanel value="theme">
				<article className="docs-article">
					<h2>{t("主题隔离与品牌契约", "Theme isolation and brand contract")}</h2>
					<p>
						{t(
							"所有样式位于 .mds-root 内。brand 显式选择已导入的品牌 CSS；未导入时使用中性基础值，不自动切换至其他品牌。浮层保留当前主题。",
							"Styles live inside .mds-root. Brand selects explicitly imported CSS; without it, neutral tokens remain. Portals retain their current theme.",
						)}
					</p>
					<pre>
						<code>
							{
								"--mds-text / --mds-muted\n--mds-bg / --mds-surface / --mds-soft\n--mds-border / --mds-focus\n--mds-accent / --mds-success / --mds-warning / --mds-danger\n--mds-font-latin / --mds-font-cjk / --mds-font-mono"
							}
						</code>
					</pre>
					<h3>{t("微动效", "Micro motion")}</h3>
					<p>
						{t(
							"120ms 用于即时反馈，180ms 用于状态变化，240ms 用于侧边面板。仅移动当前组件；不缩放背景。所有非必要动效遵循减少动态效果设置。",
							"Use 120ms for immediate feedback, 180ms for state changes, and 240ms for side sheets. Animate only the active component. Respect reduced motion.",
						)}
					</p>
					<h3>{t("图标维护", "Icon governance")}</h3>
					<p>
						{t(
							"MDS 维护 32 个稳定图标名称、16/20/24px 尺寸和默认 1.75px 线宽。参考 Lucide 的清晰度独立绘制 SVG，采用 MDS 自己的几何细节。",
							"MDS maintains 32 stable icon names, 16/20/24px sizes and a 1.75px stroke. SVG shapes are independently drawn, informed by Lucide’s clarity with MDS geometric details.",
						)}
					</p>
					<h3>{t("发布与验收", "Release and validation")}</h3>
					<p>
						{t(
							"每个包独立版本，预览版本使用 next 标签。通过组件交互、中英文、明暗主题、键盘、窄屏、SSR 和安装测试后再发布。",
							"Each package has its own version. Previews use the next tag. Validate interaction, languages, themes, keyboard, narrow layouts, SSR and installation before publishing.",
						)}
					</p>
				</article>
			</TabPanel>
		</Tabs>
	);
}

export function IconsPage({ locale }: { locale: "zh" | "en" }) {
	const [query, setQuery] = useState("");
	const names = Object.entries(Icons).filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));
	const example = String.raw`import { Plus } from '@matrixzero/icons';
<IconButton label="Add application" icon={<Plus />} />`;
	return (
		<>
			<p className="docs-muted">
				{locale === "zh"
					? "@matrixzero/icons · 统一 1.75px 线宽，默认装饰性。"
					: "@matrixzero/icons · consistent 1.75px stroke, decorative by default."}
			</p>
			<Input
				aria-label={locale === "zh" ? "搜索图标" : "Search icons"}
				placeholder={locale === "zh" ? "搜索图标名称…" : "Search icons…"}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				style={{ margin: "20px 0" }}
			/>
			{names.length === 0 && (
				<div role="status" className="docs-card">
					<p>{locale === "zh" ? "未找到匹配的图标" : "No matching icons"}</p>
					<Button onClick={() => setQuery("")}>{locale === "zh" ? "清除搜索" : "Clear search"}</Button>
				</div>
			)}
			<div className="docs-icon-grid">
				{names.map(([name, Icon]) => (
					<div className="docs-icon-tile" key={name}>
						<div>
							<Icon size={16} />
							<Icon size={20} />
							<Icon size={24} />
						</div>
						<code>{name}</code>
					</div>
				))}
			</div>
			<pre>
				<code>{example}</code>
			</pre>
		</>
	);
}
