Read the repository and workspace `CLAUDE.md` files first. Component changes must follow their rules for theme isolation, localization, accessibility, motion, testing, and pull requests.

Use English for source code, comments, tests, commit messages, pull requests, issues, and documentation source. Other languages are allowed only in i18n translation resources.

When implementing docs, showcases, or user scenarios, first reuse semantically correct components from `@matrixzero/ui`. If the existing API is insufficient, enhance or add a reusable MDS component in `packages/ui/src`, document and validate it, and then use it in the scenario. Do not imitate components with page-level CSS or force a semantically incorrect component into the design. See “Build documentation and scenarios with MDS components” in `CLAUDE.md` for details.
