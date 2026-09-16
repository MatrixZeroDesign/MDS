# @matrixzero/icons

Matrix Design System maintains 381 SVG icons with hand-authored geometric paths. They do not depend on Lucide or a runtime icon service. The default is 16px with a 1.75px stroke, `currentColor`, rounded caps and joins, and support for 16 / 20 / 24px.

## Visual language

Icons use a 24 × 24 optical grid, usually bounded by 3.5–20.5, with compact outlines, soft rectangles, and consistent internal whitespace. Panels and blocks share a radius rhythm, sliders use rounded-square control points, and menus use short terminal strokes for slight asymmetry. Notification and information dots use solid geometry for small-size legibility. Common arrows and plus/minus symbols preserve familiar meaning rather than sacrificing recognition for styling.

Lucide is a reference for linear icon legibility and semantic naming. Every SVG path in this package is independently authored for MDS; no path data is copied. Common geometric symbols may naturally resemble other libraries, and no claim is made that every basic symbol is unique.

```tsx
import {Plus, Search} from '@matrixzero/icons';
import {IconButton} from '@matrixzero/ui';

<IconButton label="Add app" icon={<Plus />} />
<Search size={20} aria-label="Search" />
<Search size={24} strokeWidth={1.75} absoluteStrokeWidth />
```

## Usage conventions

- Icons are decorative and `aria-hidden` by default. When an icon conveys meaning by itself, provide `aria-label` or `aria-labelledby`; it then receives `role="img"`.
- Put an icon button's accessible name on the button and keep its inner icon decorative.
- SVG attributes, `className`, `style`, `ref`, and events are supported; icons do not provide click, focus, or button behavior themselves.
- Stroke width scales with icon size by default. Use `absoluteStrokeWidth` with a numeric size or numeric string to preserve a physical stroke width.
- No animation or CSS is built in. Consumers control loading motion according to their reduced-motion preference.
- Check new icons at 16 / 20 / 24px, on light and dark backgrounds, for optical balance and semantic clarity; keep existing export names stable.

React is a peer dependency. See NOTICE.md for source notices.

## Categories and search

The catalog contains 11 categories: navigation, layout, editing, files, communication, media, development, security, data, business, and everyday. Import search metadata through `@matrixzero/icons/catalog` for names, categories, and bilingual keywords. Normal icon imports do not include the catalog.

```tsx
import { iconCatalog } from "@matrixzero/icons/catalog";
const matches = iconCatalog.filter((icon) => icon.keywords.some((word) => word.includes("file")));
```

All existing names remain compatible. Named icon imports are tree-shakable, and the docs catalog loads on demand. New icons must update the catalog; the build verifies a one-to-one match, and tests prevent duplicate drawings and unnecessary full-library bundling.

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
