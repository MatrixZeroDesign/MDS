# Integration guide / 接入指南

Applies to React 19, @matrixzero/ui 0.1.0-alpha.11, @matrixzero/icons 0.1.0-alpha.4 and @matrixzero/charts 0.1.0-alpha.4. Pin these versions when reproducing examples. This is an alpha API; inspect the installed declarations before upgrading.

适用于 React 19 与以上固定版本。升级时检查变更记录及安装包的类型声明，不要套用 shadcn 的组件 API。

## Install / 安装

Install from the public npm registry; no project-level registry configuration is required:

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.11 @matrixzero/icons@0.1.0-alpha.4
# Optional charts / 按需安装图表
npm install --save-exact @matrixzero/charts@0.1.0-alpha.4
```

React and react-dom 19 must also be installed. Packages and documentation are public; AI tools may also use a local checkout of docs/.

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

## Color families and appearance / 配色与显示模式

`ThemeProvider palette="mono"` selects the monochrome family. Other presets are `mint`, `blue`, `violet`, `rose` and `amber`. Palette and `mode` are independent: each family supports light, dark and system. Nested roots inherit palette; set `palette={null}` to restore that root's brand tokens. Inline token overrides still take precedence. Success, warning, danger and information colors keep their semantic roles.

`palette` 与明暗模式独立，嵌套根继承配色，传入 null 恢复品牌色。文档站默认跟随系统；用户选择的 mode 保存至本地，下次加载优先读取有效记录。存储不可用时仍可切换本次会话。

## Forms / 表单

Use `Form` with `Field` and controls. Native validation runs on submit; native `action`, `method`, `onSubmit` and `onReset` remain available. For managed async submission, provide `onSubmitAsync`; `FormSubmit` reads its pending state. A rejected promise displays the localized `submitErrorMessage`. Use `errors` and matching `Field.error` for application validation, with stable `fieldId` values for focus navigation.

With an external form library, use its native `onSubmit` handler and pass `submitting` yourself. Do not add `onSubmitAsync` to a handler that calls `preventDefault`. The MDS `useFormStatus` hook reads MDS Form state; it is distinct from React DOM's hook of the same name.

## Tabs 与 SegmentedControl / Tabs and SegmentedControl

Tabs 用下划线导航关联的内容面板。SegmentedControl 选择单个值，独占分段滑块外观，并支持 size="sm|md|lg" 与 shape="rounded|pill"。alpha.9 的 Tabs 分段样式在 alpha.10 移除：内容导航去掉 variant/size/shape，模式和周期选择迁移至 SegmentedControl。

Tabs use underlined navigation for associated panels. SegmentedControl selects one value and owns the segmented appearance, with size and shape options. In alpha.10, remove alpha.9’s variant/size/shape props from Tabs; use SegmentedControl for mode and billing-cycle selection.

## 产品场景 / Product scenarios

Showcase 提供 12 个中英文场景，覆盖企业和消费产品，新增场景包含交互、源码和组件清单。状态只在当前演示页面保留；不会发送消息、扣款、预订住宿或播放音频。

Showcase offers 12 bilingual business and consumer scenarios. New scenes include interactions, source and component inventories. State remains in the current demo; no messages, payments, bookings or audio playback are performed.
