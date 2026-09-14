# Matrix Design System

- Follow the workspace `CLAUDE.md`. Make changes on a branch and open a pull request; Ethan performs merges.
- Use English for source code, comments, tests, commit messages, pull requests, issues, and documentation source. Other languages are allowed only in i18n translation resources.
- Component source code belongs only in `packages/ui/src`. The docs app must import components from `@matrixzero/ui` and must not copy component implementations.
- Scope all CSS under `.mds-root`. Do not change the host `html` or `body` theme, scrolling, or colors.
- Preserve Radix keyboard, focus, form, and accessibility behavior. Do not present `menuitemradio` as a combobox.
- Consumers provide copy. Do not place product terminology, network requests, permissions, or routing logic in components.
- Pair component text and backgrounds with MDS tokens. Import brand assets explicitly; do not download fonts or styles at runtime.
- Validate supported languages, light and dark themes, system theme, multi-instance isolation, and reduced motion.
- Keep motion local to components and use 120–240 ms by default. Do not move or scale page backgrounds. Remove nonessential motion under reduced-motion preferences.
- Run `npm run check` before submitting. Verify tarball installation, exports, SSR, and CI before publishing.
- Do not commit scratchpads, credentials, `node_modules`, or build output. Packages should contain only `dist` and required usage documentation.

## Build documentation and scenarios with MDS components

- Before implementing docs, showcases, or user scenarios, inspect the existing `@matrixzero/ui` exports and documentation, then compose the available MDS components first.
- Interactive controls and common interface structures must use semantically correct MDS components such as Button, Card, Tabs, NavDrawer, Grid, Divider, Typography, List, and form controls. Do not recreate an existing component with native elements and local CSS, and do not use a semantically incorrect component merely for reuse.
- Page CSS handles layout, content composition, and scenario-specific visual expression. Components own hover, active, focus, disabled, theme, density, radius, and accessibility behavior.
- When the existing component API cannot express a design, first define a reusable prop, variant, slot, or component in `packages/ui/src`, then add documentation and necessary validation before using it in docs or showcases. Do not bypass a capability gap with temporary styles or the wrong component.
- After adding a scenario, verify that its component inventory matches the implementation and test light and dark themes, density, responsive behavior, keyboard operation, and applicable LTR/RTL layouts.
