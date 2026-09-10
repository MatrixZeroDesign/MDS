# MDS documentation / 文档维护

## Read / 阅读

- Start with [integration](guides/integration.md) and [design and accessibility](guides/design-and-accessibility.md).
- [content.json](content.json) is the canonical component usage/guide/API/accessibility/pitfalls catalogue, in Chinese and English.
- Complete, type-checked examples are in [apps/docs/src/examples](../apps/docs/src/examples).
- The [docs portal](https://mds-b1761b.gitlab.io/#docs) renders this same content. `#docs/dialog` and equivalent component routes support reload and sharing.
- AI clients can read `llms.txt`, `llms-full.txt`, `docs/manifest.json`, `docs/components/<slug>.md`, `docs/examples/<slug>.tsx` and `docs/api/<package>.md` from the portal. `docs/icons.json` contains all maintained icon names, categories and keywords. Private Pages requires authorized access; local agents can use the source files above.

## Maintain / 维护

1. Update the real package API, its entry in content.json, and its complete example together. Document defaults, required props, selection guidance, accessibility and limitations; do not invent APIs from another library.
2. Each example exports a React component and is included in the docs TypeScript project. Global CSS and ThemeProvider follow the integration guide. Examples are displayed as raw source; they are not bundled as executable gallery components.
3. `npm run build` builds packages first, then `scripts/build-docs.mjs` generates static Markdown, raw examples, exact built declarations, the icon catalogue, versioned manifest and AI indexes into apps/docs/public/. Generated files are ignored by Git and copied into the Vite production output.
4. The generator rejects undocumented exported UI components. Browser tests fetch every generated entry and raw example and check deep links, reload, narrow layouts and accessibility. Run `npm run check` before opening/updating an MR.
5. Update installation guidance when releasing new versions. The manifest and per-component package versions are read directly from package.json. Docs-only updates do not republish unchanged packages.

生成物不手工编辑。网站和 AI 文档共用内容；新组件必须同时补充用途、属性、示例、无障碍和误用说明。完整类型声明从构建后的安装包生成，包含继承属性，不依赖手写的属性摘要。
