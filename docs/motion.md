# 微动效

动效用于解释状态变化与提供触感，不作为背景装饰。

| Token                 |                   默认值 | 用途                     |
| --------------------- | -----------------------: | ------------------------ |
| --mds-duration-fast   |                    120ms | 菜单、勾选、hover        |
| --mds-duration-normal |                    180ms | Switch、Dialog、状态进入 |
| --mds-duration-slow   |                    240ms | 为后续复杂展开保留       |
| --mds-ease-out        | cubic-bezier(.16,1,.3,1) | 轻快进入、柔和停止       |
| --mds-ease-switch     | cubic-bezier(.2,.8,.2,1) | 开关滑动                 |

SideSheet / NavDrawer 用 240ms 从所在侧进入，Collapse 使用内容高度展开。菜单只移动自身 3px，Dialog 只移动自身 6px。不开启整页缩放、背景平移或弹性抖动。按钮使用颜色反馈，不靠改变布局尺寸制造“按下”。

加载使用明确的 busy 状态；装饰动效不是唯一状态提示。Progress 同时保留 progressbar 值，Switch/Checkbox 使用真实 checked 状态，步骤通过 aria-current 表示位置。

prefers-reduced-motion: reduce 时禁用动画与过渡，保留所有状态和交互。主题切换不添加全页动画。浏览器测试检查菜单和开关的减少动态效果行为。
