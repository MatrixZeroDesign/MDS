# MDS documentation

## Read

- Start with [integration](guides/integration.md) and [design and accessibility](guides/design-and-accessibility.md).
- [content.json](content.json) is the canonical component usage, guide, API, accessibility and pitfalls catalogue in English and Chinese.
- Complete, type-checked examples are in [apps/docs/src/examples](../apps/docs/src/examples).
- The [docs portal](https://matrixzerodesign.github.io/MDS/docs/) renders this same content. `/MDS/docs/dialog` and equivalent component routes support reload and sharing.
- AI clients can read `llms.txt`, `llms-full.txt`, `docs/manifest.json`, `docs/components/<slug>.md`, `docs/examples/<slug>.tsx` and `docs/api/<package>.md` from the portal. `docs/icons.json` contains all maintained icon names, categories and keywords. Local agents can also use the source files above.

## Maintain

1. Update the real package API, its entry in content.json, and its complete example together. Document defaults, required props, selection guidance, accessibility and limitations; do not invent APIs from another library.
2. Each example exports a React component and is included in the docs TypeScript project. Global CSS and ThemeProvider follow the integration guide. Examples are displayed as raw source; they are not bundled as executable gallery components.
3. `npm run build` builds packages first, then `scripts/build-docs.mjs` generates static Markdown, raw examples, exact built declarations, the icon catalogue, versioned manifest and AI indexes into apps/docs/public/. Generated files are ignored by Git and copied into the Vite production output.
4. The generator rejects undocumented exported UI components. Browser tests fetch every generated entry and raw example and check deep links, reload, narrow layouts and accessibility. Run `npm run check` before opening or updating a PR.
5. Update installation guidance when releasing new versions. The manifest and per-component package versions are read directly from package.json. Docs-only updates do not republish unchanged packages.

Generated files are never edited by hand. The website and AI documentation share the same content; every new component must document its purpose, properties, example, accessibility and misuse guidance. Complete type declarations are generated from built packages, including inherited properties, and do not depend on hand-written property summaries.
