# Integration guide / 接入指南

Applies to React 19, @matrixzero/ui 0.1.0-alpha.7, @matrixzero/icons 0.1.0-alpha.4 and @matrixzero/charts 0.1.0-alpha.3. Pin these versions when reproducing examples. This is an alpha API; inspect the installed declarations before upgrading.

适用于 React 19 与以上固定版本。升级时检查变更记录及安装包的类型声明，不要套用 shadcn 的组件 API。

## Install / 安装

Configure your project .npmrc with an environment variable; never store the real token in source:

```ini
@matrixzero:registry=https://gitlab.com/api/v4/projects/86296621/packages/npm/
//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}
```

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.7 @matrixzero/icons@0.1.0-alpha.4
# Optional charts / 按需安装图表
npm install --save-exact @matrixzero/charts@0.1.0-alpha.3
```

React and react-dom 19 must also be installed. The registry and documentation portal are private: AI tools need authorized GitLab access, or a local checkout of docs/. These URLs do not bypass authentication.

## Required application root / 必需的应用入口

```tsx
import { ThemeProvider } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
// Only when charts are used / 仅使用图表时
import "@matrixzero/charts/styles.css";

export function App() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			Your application
		</ThemeProvider>
	);
}
```

Every component example assumes these styles and a surrounding ThemeProvider. Examples are complete React modules with imports and local state; render them inside this root. Do not import all example files into production.

所有组件示例均假设已完成以上 CSS 导入并位于 ThemeProvider 内。示例自身包含导入与所需状态；业务请求、路由、权限、持久化由应用提供。

## Controlled state / 受控状态

Use value + onValueChange for Select, radio groups, segmented controls, tabs and ChoiceMenu; checked + onCheckedChange for Checkbox and Switch; open + onOpenChange for overlays. Native Input, Textarea, NativeSelect and Slider use onChange events. Use defaultValue/defaultChecked/defaultOpen for uncontrolled state; do not mix controlled and uncontrolled ownership. Reset controlled state explicitly when the form resets.

受控状态由应用持有，原生输入 onChange 接收事件；Radix 类控件回调接收值。不要混用 value 与 defaultValue。表单 reset 时同时重置应用持有的状态。

## Public utilities / 公共工具

- `cx(...parts: (string | undefined | false)[]): string` joins class names; it does not resolve conflicting styles.
- `useFieldProps(props?)` connects a custom control to Field context. Forward the returned id, aria-describedby, aria-invalid, required and disabled to the actual focusable input, not its wrapper.
- `usePortalContainer(): HTMLElement | null` returns the current ThemeProvider portal node. It is initially null; render custom portals only after it exists. Do not fall back to document.body and lose theme scope.

Prefer the built-in controls and overlays; these helpers are extension points, not requirements for normal usage.
