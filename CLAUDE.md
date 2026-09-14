# Matrix Design System

- 遵循工作区 CLAUDE.md；改动走分支和 MR，合并由 Ethan 操作。
- 组件源代码只在 packages/ui/src；展示站 apps/docs 必须通过 @matrixzero/ui 导入，不复制组件实现。
- 所有 CSS 必须在 .mds-root 作用域内。禁止修改宿主 html/body 的主题、滚动或颜色。
- 使用 Radix 的键盘、焦点、表单与无障碍行为；不要把 menuitemradio 伪装成 combobox。
- 文案由使用方传入，不把产品术语、网络请求、权限或路由逻辑放进组件。
- 组件文字和背景成对使用 MDS token；品牌资源显式导入，不运行时下载字体或样式。
- 中英文、明暗主题、系统主题、多实例隔离、减少动态效果均属于验收范围。
- 微动效只作用于局部组件；默认 120–240ms，不移动或缩放背景。减少动态效果时移除非必要动效。
- 提交前运行 npm run check。发布前检查 tarball 安装、导出、SSR 和 CI。
- scratchpad、凭证、node_modules、构建产物不提交；包仅包含 dist 和必要使用文档。

## 文档与场景必须由 MDS 组件构建

- 开始实现 docs、showcase 或用户场景前，先检查 `@matrixzero/ui` 现有导出和对应文档，优先组合已有 MDS 组件。
- 交互控件和通用界面结构必须使用语义正确的 MDS 组件，例如 Button、Card、Tabs、NavDrawer、Grid、Divider、Typography、List 和表单控件。不要用原生元素加局部 CSS 重新仿制已有组件，也不要为了复用而使用语义不匹配的组件。
- 页面 CSS 只负责布局、内容编排和场景特有的视觉表达；组件的 hover、active、focus、disabled、主题、density、圆角和无障碍行为由 MDS 组件负责。
- 如果现有组件无法合理表达设计，先把缺失能力提炼成通用的 prop、variant、slot 或新组件，在 `packages/ui/src` 中实现并补齐文档与必要验证；随后再在 docs/showcase 中使用它。不要以临时样式或错误组件绕过能力缺口。
- 新增场景后检查其组件清单与实际实现一致，并验证 light/dark、density、响应式、键盘操作以及适用语言的 LTR/RTL 表现。
