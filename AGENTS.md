请先读 CLAUDE.md 和工作区 CLAUDE.md。组件修改遵循其中的主题隔离、中英文、无障碍、动效、测试和 MR 约定。

实现 docs、showcase 或用户场景时，必须先复用 `@matrixzero/ui` 中语义正确的现有组件。现有能力不足时，先在 `packages/ui/src` 增强或新增通用 MDS 组件并补齐文档与验证，再用它构建场景；不要用页面级 CSS 仿制组件，也不要勉强使用语义不匹配的组件。详细规则见 `CLAUDE.md` 的“文档与场景必须由 MDS 组件构建”。
