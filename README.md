# Matrix Design System

MDS 是 Matrix 产品的 React 设计系统。提供中英文排版规范、独立主题、可访问组件与克制的微动效。组件包名为 **@matrixzero/ui**，展示名称为 **Matrix UI**。

UI 目前为 **0.1.0-alpha.7**，Icons 与 Charts 为 **0.1.0-alpha.3** 预览版本。MT0 页面用于验证组合场景，未接入生产业务。

文档网站：[Matrix Design System](https://mds-b1761b.gitlab.io)，需要项目成员登录 GitLab。提供组件交互、安装和 API 文档、图表以及可搜索图标目录。

## 仓库结构

- `packages/icons`：320 个独立绘制的 SVG 图标，支持可访问名称与 16/20/24px 尺寸。
- `packages/charts`：折线、面积、柱状、环形与堆叠图，含可访问数据表。
- `packages/ui`：唯一组件实现、CSS token、显式品牌主题。
- `apps/docs`：直接使用发布包 API 的中英文展示站，包含组件总览及 MT0 场景。
- `tests`：真实浏览器交互、无障碍、主题和布局回归。
- `scripts`：包构建、安装验收与发布。
- `docs`：设计决策、主题契约与维护规范。

## 本地开发

Node.js 22 LTS、npm 10。

```sh
npm ci
npm run dev
# http://127.0.0.1:4173
```

修改包后运行 `npm run build:packages`，展示站会重新加载构建输出。这样开发和安装后的导出路径一致。

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
npm run test:package
# 以上完整检查：
npm run check
```

浏览器测试覆盖实际交互和 Axe WCAG 检查；这不能代替辅助技术人工验收。字体当前使用明确的系统栈，跨平台字形仍有差异。商业字体不会未经授权捆绑分发。

## 安装

包发布到本项目 GitLab Package Registry。使用项目级 registry 避免同名 scope 的路由歧义。

在使用方的 npm 配置中加入：

```ini
@matrixzero:registry=https://gitlab.com/api/v4/projects/86296621/packages/npm/
//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}
```

令牌通过环境或 CI 注入，不提交实际值。消费方使用只读包权限；GitLab CI 跨项目访问还需要 MDS 项目的 job token allowlist。

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.7
```

```tsx
import { ThemeProvider, Button, Field, Input } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";

export function Settings() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			<Field label="工作区名称 / Workspace name" required>
				<Input name="workspace" defaultValue="Engineering" />
			</Field>
			<Button variant="primary">保存 Save</Button>
		</ThemeProvider>
	);
}
```

不依赖使用方 Tailwind 配置。React / React DOM 为 peer dependencies，包不捆绑第二份 React。ESM 与类型声明随包发布，CSS 必须显式导入。

## 组件

- 表单：Button、IconButton、SegmentedControl、RadioCardGroup / RadioCard、Field、Input、Textarea、Select、Checkbox、CheckField、Switch、RadioGroup、RadioItem、Slider。
- 浮层：ChoiceMenu、DropdownMenu 及组合件、Dialog 及组合件、Tooltip / TooltipProvider。
- 展示：Avatar、Badge、List / ListItem、Table、Pagination、Steps。
- 反馈：Alert、EmptyState、Progress、Skeleton。
- 应用外壳：Navbar、NavRail / NavItem / NavLink、NavDrawer 及组合件。
- 侧边面板：SideSheet 及组合件。
- 展开区域：Collapse / CollapseTrigger / CollapseContent。
- 导航：Tabs / TabList / Tab / TabPanel、Accordion 及组合件。
- 主题：ThemeProvider、ThemeMode、ThemeStyle。

`Select` 是统一主题的表单 listbox，使用 options/onValueChange 并保留提交、重置和必填校验。`NativeSelect` 显式提供旧版 option children/onChange 原生 API。`ChoiceMenu` 是非模态选择菜单，用于筛选和偏好设置，使用真实 menuitemradio 语义，不伪装成 combobox。需要搜索的 combobox 留待独立设计。

Field 负责 label、description、error、required、disabled 的关联。需要显式 ID 时把 ID 传给 Field；内部控件不要另设不同 ID。非 MDS 控件可以通过 `useFieldProps` 接入。

所有浮层都放在当前 ThemeProvider 的 portal 容器下，保留品牌和明暗 token。菜单默认不锁滚动（ChoiceMenu 固定非模态；DropdownMenu 使用时明确 `modal={false}`）；真正的模态 Dialog 使用 Radix 的焦点与滚动锁。宿主需要避免在 ThemeProvider 祖先上设置 transform/filter/contain:paint，以免改变 fixed 浮层定位。

## 发布与升级

详见 [发布规范](docs/releasing.md)、[主题与组件边界](docs/architecture.md)、[动效规范](docs/motion.md)。

预览包使用 `next` dist-tag，稳定包使用 `latest`。消费者固定版本，通过 MR 升级；不会静默改变 MT0 的依赖。独立 repo 的建立不意味着 MT0 已完成迁移。

## 来源与设计依据

- 复用 [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) 的交互基础，MDS 负责视觉、组件组合和主题边界。
- [shadcn 共享 UI 包](https://ui.shadcn.com/docs/monorepo) 提供独立组件包组织方式的参考；本项目发布编译 CSS，避免消费方需要扫描包源码。
- 对照 [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) 的清晰层次与克制交互；MDS 是独立实现，不声称使用 ChatGPT 内部代码。
- [GitLab npm Registry](https://docs.gitlab.com/user/packages/npm_registry/) 用于私有包分发。

内部软件，未授予公开再分发许可；第三方依赖保留各自许可。

## Usage and AI guides / 组件使用文档

See [documentation maintenance and source](docs/README.md), [integration](docs/guides/integration.md), and [design guidance](docs/guides/design-and-accessibility.md). The [portal](https://mds-b1761b.gitlab.io/#docs) includes 45 component guides with type-checked examples; authorized AI clients can start at [llms.txt](https://mds-b1761b.gitlab.io/llms.txt).
