# @matrixzero/icons

Matrix Design System 自行维护的 340 个 SVG 图标，使用手写几何路径，不依赖 Lucide 或运行时图标服务。默认 16px、1.75px 线宽、currentColor，圆角端点与连接，支持 16 / 20 / 24px。

## 视觉语言

采用 24 × 24 光学网格，常用边界在 3.5–20.5；紧凑外轮廓、柔和矩形和留白一致的内部空间。面板与方块使用相同的圆角节奏，滑块采用圆角方形控制点，菜单以短末行形成轻微不对称。提醒、信息等图标的点使用实心几何，保证小尺寸可读性。箭头、加减等通用符号保留熟悉的语义，不为造型牺牲辨识度。

Lucide 是线性图标可读性和语义命名的参考；本包中的 SVG 路径在 MDS 中独立编写，没有复制其路径数据。通用几何符号可能自然相似，不声称每个基础符号都是独有设计。

```tsx
import {Plus, Search} from '@matrixzero/icons';
import {IconButton} from '@matrixzero/ui';

<IconButton label="添加应用" icon={<Plus />} />
<Search size={20} aria-label="搜索" />
<Search size={24} strokeWidth={1.75} absoluteStrokeWidth />
```

## 使用约定

- 默认装饰性 `aria-hidden`；独立表达含义时提供 `aria-label` 或 `aria-labelledby`，自动获得 `role="img"`。
- 图标按钮的可访问名称放在按钮上，内部图标保持装饰性。
- 支持 SVG 属性、`className`、`style`、`ref` 和事件；图标自身不提供点击、焦点或按钮行为。
- 线宽默认随图标尺寸缩放；数字尺寸或数字字符串可配合 `absoluteStrokeWidth` 保持指定物理线宽。
- 无内置动画和 CSS。加载动画由使用方按减少动态效果偏好控制。
- 新增图标需检查 16 / 20 / 24px、明暗背景、光学重心和语义；现有导出名称保持稳定。

React 是 peer dependency。来源说明见 NOTICE.md。

## 分类与检索

目录包含导航、布局、编辑、文件、通信、媒体、开发、安全、数据、商业与日常 11 类。搜索元数据通过独立入口 `@matrixzero/icons/catalog` 导入，包括名称、分类和中英文关键词。常规图标导入不会包含此目录。

```tsx
import { iconCatalog } from "@matrixzero/icons/catalog";
const matches = iconCatalog.filter((icon) => icon.keywords.some((word) => word.includes("文件")));
```

所有原有名称保持兼容。按名称导入图标可被 tree shaking；docs 的全量目录按需加载。新增图标必须同时更新 catalog，构建时校验一一对应；测试阻止重复绘图和非必要全库打包。

## Outlined and filled variants

`variant="outlined"` is the default and preserves existing rendering. `Heart`, `Bookmark`, `Star`, `Bell` and `Flag` also support `variant="filled"` with independently drawn solid silhouettes. Filled paths inherit `currentColor`; do not use the SVG `fill` property to turn outline paths into solid icons. Other icons safely retain their outlined drawing when passed `filled`. The catalog advertises paired icons through `variants: ["outlined", "filled"]`.

```tsx
import { useState } from "react";
import { Heart, Share } from "@matrixzero/icons";
import { IconButton } from "@matrixzero/ui";

function Favorite() {
	const [liked, setLiked] = useState(false);
	return (
		<IconButton
			label="Like"
			aria-pressed={liked}
			onClick={() => setLiked(!liked)}
			icon={<Heart variant={liked ? "filled" : "outlined"} />}
		/>
	);
}

<IconButton label="Share" icon={<Share />} />;
```

The icon conveys visual state; the button owns behavior and accessible state. Keep its label stable while toggling `aria-pressed`. No color change is required to distinguish the selected state. New sharing and interaction icons include `Share`, `ShareUp`, `ShareForward`, `LinkCopy`, `LinkOff`, `SendHorizontal`, `MailPlus`, `MailHeart`, `MessagePlus`, `MessageUnread`, `MessageHeart`, `ReplyQuote`, `UserHeart`, `UserCheck`, `BellOff`, `BellRing`, `BookmarkPlus`, `BookmarkCheck`, `HeartHandshake` and `NotificationDot`.
