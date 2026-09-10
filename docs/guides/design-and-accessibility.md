# Design and accessibility / 设计与无障碍

## Choosing a component / 组件选型

| Intent / 意图                        | Component                      | Reason / 原因                                  |
| ------------------------------------ | ------------------------------ | ---------------------------------------------- |
| Submit a value / 提交表单值          | Select                         | Native form and reset semantics / 原生表单语义 |
| Choose a preference / 切换偏好       | ChoiceMenu or SegmentedControl | Menu/radio selection / 菜单或单选语义          |
| Switch content / 切换面板            | Tabs                           | Associated panels / 关联内容面板               |
| Navigate to URL / 跳转页面           | NavLink                        | Real anchor / 原生链接                         |
| Perform action / 执行动作            | Button or DropdownItem         | Action semantics / 操作语义                    |
| Immediate boolean / 立即生效开关     | Switch                         | Stable on/off preference / 二元偏好            |
| Selection before submit / 待提交选择 | Checkbox                       | Independent selection / 独立选择               |
| Focused short task / 短任务          | Dialog                         | Modal focus / 模态焦点                         |
| Contextual details / 上下文详情      | SideSheet                      | More vertical space / 更大的纵向空间           |
| Explain optional detail / 补充帮助   | Tooltip                        | Noninteractive short text / 非交互短文案       |

## Color and typography / 颜色与字体

Use semantic pairs: --mds-text on --mds-surface; --mds-accent with --mds-on-accent; status foregrounds with their matching --mds-\*-bg. Reserve status colors for meaning. Charts use --mds-chart-1 through --mds-chart-6, which inherit --mds-data-1 through --mds-data-6. Do not assume accent text works on every background.

使用成对前景/背景 token；品牌强调色、状态色和图表分类色有不同职责。覆盖颜色时同时检查 light/dark 与 hover/pressed/focus。

The font stack separates --mds-font-latin, --mds-font-cjk and --mds-font-mono. Supply locally available or explicitly bundled licensed fonts. Test real Chinese and English together, long labels, numerals and fallback glyphs. MDS never downloads fonts at runtime. Set the document lang to the actual interface language and translate labels, errors and close actions.

中英文字体分别配置并在混排中验收，不只检查中文。使用产品负责加载的授权字体；组件不会自行下载字体。

## Motion / 微动效

Use --mds-duration-fast (120ms), --mds-duration-normal (180ms) and --mds-duration-slow (240ms) when extending local component motion. Existing components use brief local transitions (120–240ms) and respect prefers-reduced-motion. Do not animate the page behind a menu or scale the background. Chart data should appear without interpolating values.

扩展动效前检查安装版本的实际 token 名称。动效只作用于局部反馈，尊重减少动态效果，不缩放或移动浮层后面的页面。

## Keyboard and focus / 键盘与焦点

Keep visible focus indicators. Use actual buttons/links, name controls, preserve Radix keyboard handlers and avoid nested interactive elements. A Dialog/SideSheet normally returns focus to its Trigger. For programmatic opening without a Trigger, store the exact opener and restore it in onCloseAutoFocus:

```tsx
onCloseAutoFocus={(event) => {
  event.preventDefault();
  openerRef.current?.focus();
}}
```

The opener must remain mounted and enabled. If it disappears, focus a stable control near the completed task. Never move focus to body as the default recovery strategy.

## Acceptance / 验收

Validate zh/en, light/dark/system, multiple theme roots, reduced motion, keyboard-only usage and 320px layouts. Check loading/error/empty/disabled states, real API latency and native form reset. A static preview does not validate behavior. For charts, inspect exact-value tables and missing data, and retain both labels and colors.
