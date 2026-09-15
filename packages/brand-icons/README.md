# @matrixzero/brand-icons

Brand marks for AI providers, developer tools, cloud platforms and widely used products. Each mark uses a shared square frame with optical size correction, so mixed-brand rows have a consistent visual weight without distorting the original artwork.

```tsx
import { BrandIcon } from "@matrixzero/brand-icons";

<BrandIcon name="openai" size={24} aria-label="OpenAI" />;
<BrandIcon name="figma" size={24} variant="color" aria-label="Figma" />;
```

Use the default compact mark in controls, menus and lists. Brands that publish a separate wordmark expose it through `format="wordmark"`; `size` remains the wordmark height and its width follows the official aspect ratio.

```tsx
import { CrowdStrike } from "@matrixzero/brand-icons";

<CrowdStrike size={24} aria-label="CrowdStrike" />;
<CrowdStrike format="wordmark" size={24} aria-label="CrowdStrike" />;
```

Icons are decorative by default. Add `aria-label` or `aria-labelledby` when a brand mark conveys information on its own.

The package includes its SVG assets and performs no runtime downloads. See `NOTICE.md` before using any third-party mark.

`brandCatalog` includes each mark's category, upstream source, known guideline and license metadata, optical scale, and light/dark contrast flags. The documentation gallery uses those flags to switch a low-contrast color mark to its monochrome shape without adding a background plate.
