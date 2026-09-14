# 发布与消费

仓库 MatrixZeroDesign/MDS 包含独立版本的 @matrixzero/icons、@matrixzero/ui 和 @matrixzero/charts，通过 npm 公共 registry 发布。UI 依赖 icons；charts 按需安装。

## 预览发布

1. 在 feature branch 更新对应包的预发布版本和 CHANGELOG。
2. 执行 npm run check，提交并创建 PR。
3. 合并后创建对应版本标签；GitHub Actions 按 icons → ui → charts 的依赖顺序发布。
4. 仅预发布版本可使用此流程，以 next dist-tag 发布；每次使用新版本号，不覆盖已发布版本。预览发布不代表 MR 合并。

## 正式发布

版本和 changelog 通过 PR，由 Ethan 合并。对 main 上的提交创建 icons-vX.Y.Z、ui-vX.Y.Z 或 charts-vX.Y.Z 标签。GitHub Actions 完整验证后自动发布对应包。脚本验证包名、版本、tag 和提交属于 origin/main。

GitHub 的 `npm` environment 需要配置 `NPM_TOKEN` secret。临时 npm 配置只保存环境变量占位符，退出后删除。实际令牌只经子进程环境传入，不放进源码、日志或包。

授权本地发布可使用环境变量 MDS_NPM_TOKEN，执行 node scripts/publish.mjs --preview --package icons（或 ui、charts）。先通过完整检查，禁止将令牌放在命令行参数中。

## 文档网站

GitHub Pages：https://matrixzerodesign.github.io/MDS/。仓库公开后，标准 GitHub-hosted runner 与 Pages 不产生用量费用。

`CI` workflow 在分支和 PR 上执行完整检查。`Deploy documentation` workflow 在 main 更新后构建并部署 Pages；站点使用 `/MDS/` base path，直接访问各内容路由仍可恢复。组件、图表、图标入口分别是 `/MDS/system`、`/MDS/charts`、`/MDS/icons`，安装和 API 文档位于 `/MDS/docs/`。

## 消费与回退

固定依赖版本并提交 lockfile，通过消费项目 MR 验证后升级。回退依赖版本，不删除已被使用的包。跨项目 CI 拉取需在 Job token permissions 允许消费项目，或者使用只读包 deploy token；不要把写权限 PAT 注入消费者。
