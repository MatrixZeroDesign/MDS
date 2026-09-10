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
