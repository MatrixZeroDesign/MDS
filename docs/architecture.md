# 主题与组件边界

## 分层

1. 基础 token：字体栈、尺寸、间距、动效时长和曲线。
2. 语义 token：背景、面、正文、辅助文字、边线、焦点、强调和状态。
3. 组件：通过语义 token 实现状态和排版，调用方使用受约束的 API。
4. 组合：Field、CheckField、EmptyState 等共享结构。
5. 产品：数据、路由、权限、持久化、业务表格列定义留在 MT0。

首版保持一个 @matrixzero/ui 包。只有存在独立使用方和发布周期时才拆包；独立仓库不等于每一层都需要独立版本。

## 主题契约

ThemeProvider 的 brand 是调用方显式选择，mode 是 light/dark/system，density 是 comfortable/compact。系统模式通过媒体查询实现，SSR 不访问 window/localStorage。不会联网加载主题，也不会根据名字自动导入任何厂商资源。

styles.css 提供中性的默认语义值。themes/mt0.css 是可选 mt0 品牌值。OEM 由对应模块定义其显式 CSS 与资产；基础包不包含 onesaig 或其他厂商 Logo/专属字体，也不在缺少 OEM 配置时切回 mt0 品牌。

每个自定义品牌至少审查以下 token 在 light/dark 中的有效值：

| 类别     | CSS token                                                            |
| -------- | -------------------------------------------------------------------- |
| 面与文字 | --mds-bg、--mds-surface、--mds-soft、--mds-text、--mds-muted         |
| 状态     | --mds-accent、--mds-tint、--mds-success、--mds-warning、--mds-danger |
| 交互     | --mds-border、--mds-focus、--mds-overlay、--mds-shadow               |
| 字体     | --mds-font-latin、--mds-font-cjk、--mds-font-mono                    |

未知 brand 保持中性的基础值，不代表品牌配置已验收。产品的 BRAND_PROFILE 构建必须自行拒绝未知配置；MDS 不管理产品构建选择。

## 样式隔离

所有样式受 .mds-root 约束，正文、表格、输入和浮层显式绑定 MDS 语义色。不同 ThemeProvider 可以同时存在，portal 进入各自容器。禁止全局颜色覆盖或改写 body 滚动来修复局部组件问题。

React 19 作为 peer dependency，保留原生 props、ref 和 Radix 受控/非受控接口。通用组件不捆绑 i18next：所有可访问标签和文案由使用方传入。

## 为什么区分 Select 和 ChoiceMenu

原型曾因模态下拉触发全局滚动锁，产生背景位移风险。首版把两种用途分开：

- Select：原生表单语义，提交/重置与平台无障碍行为。
- ChoiceMenu：Radix 非模态选择菜单，radio menu item 语义，用于筛选与偏好。

不通过手工 ARIA 角色把 menu 伪装成 combobox。支持搜索、大数据虚拟化的 combobox 需要独立设计和测试，不在 alpha.1 中宣称支持。

## 首版边界

尚未迁移 MT0 页面，尚未定义 onesaig 的最终品牌资产。展示站的保存、创建和导出是局部演示，不调用后端。未内置日期选择器、文件上传、虚拟表格或数据可视化库。新增组件需先证明业务用途、组合规则与无障碍行为。
