# Release and consumption

The MatrixZeroDesign/MDS repository contains independently versioned `@matrixzero/icons`, `@matrixzero/ui`, `@matrixzero/brand-icons` and `@matrixzero/charts` packages published to the public npm registry. UI depends on icons; charts and brand icons are optional.

## Preview releases

1. Update the relevant package prerelease version and changelog on a feature branch.
2. Run `npm run check`, commit and open a pull request.
3. After merging, create the matching version tag. GitHub Actions publishes in dependency order.
4. Preview versions use the `next` dist-tag and always receive a new version; they never overwrite a published version.

## Stable releases

Create an `icons-vX.Y.Z`, `ui-vX.Y.Z`, `brand-icons-vX.Y.Z` or `charts-vX.Y.Z` tag on `main`. GitHub Actions runs the full checks and publishes the matching package. The release script verifies package name, version, tag and that the commit belongs to `origin/main`.

The GitHub `npm` environment must contain the `NPM_TOKEN` secret. Temporary npm configuration stores only an environment-variable placeholder and is removed after the run. Tokens are passed through the child-process environment and never committed, logged or included in packages.

## Documentation site

GitHub Pages hosts https://matrixzerodesign.github.io/MDS/. Public repositories use standard GitHub-hosted runners and Pages without a separate usage charge.

The `CI` workflow runs checks on branches and pull requests. `Deploy documentation` builds and deploys Pages after updates to `main`; the site uses `/MDS/` as its base path and supports direct content routes. Component, chart and icon entry points are `/MDS/system`, `/MDS/charts` and `/MDS/icons`; installation and API documentation lives under `/MDS/docs/`.

## Consumption and rollback

Pin dependency versions and commit the lockfile. Upgrade only after validating the consumer project. Roll back dependency versions when needed and never delete a package already in use. Cross-project CI should use consumer-scoped read-only package credentials.
