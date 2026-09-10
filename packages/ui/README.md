# @matrixzero/ui

Matrix Design System（MDS / Matrix UI）：面向多品牌产品的 React 19 组件、中英文排版、明暗主题与局部微动效。

内部预览版本，未授予公开再分发许可。

## 安装与使用

通过 Matrix GitLab npm Registry 安装，固定版本：

```ini
@matrixzero:registry=https://gitlab.com/api/v4/projects/86296621/packages/npm/
//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}
```

令牌使用环境变量注入。需要 registry 读权限，跨项目 CI 使用 job token 时需要 allowlist。

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.5
```

```tsx
import { ThemeProvider, Button, Field, Input } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";

export function Settings() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			<Field label="工作区名称 / Workspace name" required>
				<Input name="workspace" defaultValue="Engineering" />
			</Field>
			<Button variant="primary">保存 Save</Button>
		</ThemeProvider>
	);
}
```

CSS 独立导入，不要求使用方安装 Tailwind。React / React DOM 是 peer dependencies。

## 核心约定

- ThemeProvider 控制 brand、mode（light/dark/system）、density（comfortable/compact）；不改变宿主页面主题。
- mt0 主题显式导入；默认 neutral 基础值不包含厂商品牌或字体资源。
- Field 自动关联 Input / Select / Textarea 的标签、说明与校验。显式 id 传给 Field，内部控件不另设冲突 id。
- Select 使用统一主题的 listbox、options/onValueChange API，保留提交、重置与必填校验；旧版 option children/onChange API 改用 NativeSelect。ChoiceMenu 是非模态筛选菜单，使用 menuitemradio 语义，受控 value/onValueChange。
- 浮层进入当前 ThemeProvider 容器，保留主题。避免 ThemeProvider 的祖先使用 transform/filter/contain:paint。
- 字体使用本机拉丁与中文回退字体；微动效遵循 prefers-reduced-motion。
- 所有文案和业务行为由调用方传入。

完整 API 由随包发布的 TypeScript 声明提供；使用示例、设计边界、测试和发布规范见 [MDS 仓库](https://gitlab.com/matrixzero/mds)。

## Layout and notices

Callout provides persistent contextual notes; Banner provides dismissible page-level notices. Card composes Header, Title, Description, Content and Footer. Container constrains maxWidth and inline gutter with optional centering. Each has a complete usage guide and type-checked example in the docs portal.

Accessibility: keep control outlines on --mds-control-border and decorative dividers on --mds-border. Default text pairs target 4.5:1; essential control/focus outlines target 3:1. Validate your own token overrides, keyboard interaction and content composition.
