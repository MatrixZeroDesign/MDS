import { brandCatalog, type BrandIconName } from "./catalog.js";
import { BrandMark, type BrandMarkProps } from "./BrandMark.js";

export type BrandIconVariant = "mono" | "color";
export type BrandIconFormat = "mark" | "wordmark";

export interface BrandIconProps
	extends Omit<
		BrandMarkProps,
		| "asset"
		| "brandColor"
		| "colorAsset"
		| "wordmarkAsset"
		| "colorWordmarkAsset"
		| "wordmarkAspectRatio"
		| "opticalScale"
		| "opticalShiftY"
	> {
	name: BrandIconName;
}

const byName = new Map(brandCatalog.map((brand) => [brand.name, brand]));

export function BrandIcon({ name, ...props }: BrandIconProps) {
	const brand = byName.get(name);
	if (!brand) return null;
	return (
		<BrandMark
			{...props}
			asset={brand.asset}
			brandColor={brand.brandColor}
			colorAsset={brand.colorAsset}
			wordmarkAsset={brand.wordmarkAsset}
			colorWordmarkAsset={brand.colorWordmarkAsset}
			wordmarkAspectRatio={brand.wordmarkAspectRatio}
			opticalScale={brand.opticalScale}
			opticalShiftY={brand.opticalShiftY}
		/>
	);
}
