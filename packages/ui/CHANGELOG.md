# 0.1.0-alpha.12

- Add automatic SegmentedControl overflow arrows, single-line options, edge fades, and accessible scroll labels.
- Preserve selected indicators and keyboard navigation when scrolling in LTR and RTL layouts.
- Use a single surface for modal navigation drawers so inactive items stay transparent.

# 0.1.0-alpha.11

- 新增 Typography、Grid 与 Divider，覆盖排版层级、响应式规则网格和横纵内容分隔。
- Navbar 与 NavDrawer 的高度、内边距和条目节奏完整跟随全局 density。
- Toaster 新增 `placement="inline"`，可在面板或内容区域内展示带操作的通知。
- 新增 DateField、DatePicker、TimeField、TimePicker，自定义输入和主题弹层。
- 新增 AudioPlayer、Spinner，完善 Slider 的进度与音量使用。
- 多色主题背景随配色变化，Atmosphere 默认跟随品牌配色；文档默认黑白主题。

# 0.1.0-alpha.10

- Tabs 统一为下划线内容导航，移除 alpha.9 新增的 segmented、size、shape 配置；胶囊与分段选择改用 SegmentedControl，新增 size、shape。
- 迁移：内容面板继续使用 Tabs 并移除上述属性；周期、模式等单值选择使用 SegmentedControl。

# 0.1.0-alpha.9

- Tabs 新增 segmented 样式、尺寸和圆角选项，支持滑块动画、RTL、键盘及减少动态效果。首页与文档统一使用真实组件 API。

# Changelog

## 0.1.0-alpha.8

- ThemeProvider 新增六套可继承 palette；文档默认跟随系统，手动模式保存到本地。

- 新增 Form、FormSubmit、FormErrorSummary 与提交状态 hook，保留原生表单能力并支持异步提交与错误定位。
- Switch 支持 checkedIcon / uncheckedIcon 自定义滑块图标。
- 文档 API 改为按组件分组的属性表。

- SegmentedControl 使用连续滑移的选中背景，适配内容尺寸、RTL、键盘与减少动态效果。

- EmptyState 新增 thumbnail 与 thumbnailSize，支持不裁切的图片、插画和图标；保留旧 icon 用法。
- 文档提供配图与尺寸选择，同步源码和无障碍指南。

## 0.1.0-alpha.7

- 新增 ToastProvider、Toaster 和 useToast：多条通知堆叠、悬停或聚焦展开并暂停计时、定时及手动关闭、持久通知与动作。
- Table 区分列标题与行标题，修复数据行不完整的表头底色，统一标题间距与行分隔。

- ChoiceMenu 使用紧凑胶囊工具栏样式，菜单与触发器起始边对齐，区别于表单 Select；当前值作为可访问描述。

- ThemeProvider 支持 dir=ltr/rtl，并向 Radix 交互与浮层传递方向；嵌套根继承或独立覆盖。
- SideSheet 增加 start/end，默认 end；NavDrawer 从 start 展开。修正 RTL 开关与原生选择器。

## 0.1.0-alpha.6

- Banner 默认使用顶部窄条样式，标题和正文横向排列，与正文 Callout 区分；窄屏保留完整内容和关闭操作。

## 0.1.0-alpha.5

- 新增 AvatarGroup，支持三种尺寸、叠放头像、本地化人数溢出标签及独立文档示例。

- 新增 Atmosphere 渐变展示面，提供 iris、mint、peach 明暗主题配色；不引入持续动画。
- Button 增加 contrast 语义与 pill 形状，支持明暗主题中的展示型主操作。
- 新增欢迎卡片和功能介绍弹窗组合示例、键盘与渐变对比度验收。

## 0.1.0-alpha.4

- Select 改用统一主题 listbox 与 options/onValueChange API；原生实现保留为 NativeSelect。支持表单提交、必填校验、重置、键盘与主题浮层。
- 新增 Callout、Banner、Card 组合和 Container，附完整指南与示例。
- 增加可辨识控件边界 token，修正 placeholder 对比度，扩展明暗主题与键盘验收。

- 更新 icons 依赖至 0.1.0-alpha.3，统一安装时获得修正后的 Webhook 图形。

## 0.1.0-alpha.1

- 建立 Matrix Design System 初始组件与中英文排版规范。
- 提供独立作用域的明暗/系统主题、密度与 mt0 品牌入口。
- 覆盖表单、浮层、导航、列表、头像、表格、步骤与反馈组件。
- 增加 IconButton、SegmentedControl 和整卡可操作的 RadioCard。
- 提供 Navbar、可折叠 NavRail、移动 NavDrawer、SideSheet 和独立 Collapse。
- 增加 120–240ms 局部微动效与减少动态效果支持。
- 提供真实组件展示站、浏览器交互/无障碍测试和 tarball 安装验证。

## 0.1.0-alpha.2

- 依赖扩展后的 Icons 0.1.0-alpha.2，保留现有组件 API。

## 0.1.0-alpha.3

- 暖白与松石青绿配色，明暗主题使用独立的文字、强调色和强调色上文字。
- 主按钮、勾选、开关、导航、Tab 与进度使用操作强调色，状态提示使用成对前景/底色。
- 增加 info、状态背景、on-accent、hover/pressed 和 data-1…6 语义 token。
