# 发布与消费

仓库 matrixzero/mds 包含独立版本的 @matrixzero/icons、@matrixzero/ui 和 @matrixzero/charts，使用项目 86296621 的 GitLab npm registry。UI 依赖 icons；charts 按需安装。

## 预览发布

1. 在 feature branch 更新对应包的预发布版本和 CHANGELOG。
2. 执行 npm run check，提交并创建 MR。
3. verify 通过后手动触发对应 publish-preview 作业，首次按 icons → ui → charts 顺序发布。
4. 仅预发布版本可使用此流程，以 next dist-tag 发布；每次使用新版本号，不覆盖已发布版本。预览发布不代表 MR 合并。

## 正式发布

版本和 changelog 通过 MR，由 Ethan 合并。对 main 上的提交创建 icons-vX.Y.Z、ui-vX.Y.Z 或 charts-vX.Y.Z 标签。verify 通过后手动触发 publish-tag。脚本验证包名、版本、tag 和提交属于 origin/main。

CI 使用 CI_JOB_TOKEN。临时 npm 配置只保存环境变量占位符，退出后删除。实际令牌只经子进程环境传入，不放进源码、日志或包。

授权本地发布可使用环境变量 MDS_NPM_TOKEN，执行 node scripts/publish.mjs --preview --package icons（或 ui、charts）。先通过完整检查，禁止将令牌放在命令行参数中。

## 文档网站

GitLab Pages：https://mds-b1761b.gitlab.io。访问级别 private，需要项目成员登录 GitLab。

verify 构建实际包和 docs，docs-portal 使用同一次构建的 artifacts 部署。main 自动部署；MR 手动部署，首次用于可审查的预览网站，不需要合并。后续 MR 部署会替换当前网站，应确认这是预期预览。组件、图表、图标入口分别是 /#system、/#charts、/#icons，安装和 API 文档位于 /#docs。

## 消费与回退

固定依赖版本并提交 lockfile，通过消费项目 MR 验证后升级。回退依赖版本，不删除已被使用的包。跨项目 CI 拉取需在 Job token permissions 允许消费项目，或者使用只读包 deploy token；不要把写权限 PAT 注入消费者。
