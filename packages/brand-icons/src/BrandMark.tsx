import type { CSSProperties, HTMLAttributes } from "react";
import type { BrandIconFormat, BrandIconVariant } from "./BrandIcon.js";

export interface BrandMarkProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
	asset: string;
	brandColor?: string;
	colorAsset?: string;
	wordmarkAsset?: string;
	colorWordmarkAsset?: string;
	wordmarkAspectRatio?: number;
	opticalScale: number;
	opticalShiftY: number;
	size?: number | string;
	variant?: BrandIconVariant;
	format?: BrandIconFormat;
}

function cssSize(size: number | string) {
	return typeof size === "number" ? `${size}px` : size;
}

export function BrandMark({
	asset,
	brandColor,
	colorAsset,
	wordmarkAsset,
	colorWordmarkAsset,
	wordmarkAspectRatio,
	opticalScale,
	opticalShiftY,
	size = "1em",
	variant = "mono",
	format = "mark",
	style,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	...props
}: BrandMarkProps) {
	const dimension = cssSize(size);
	const accessible = Boolean(ariaLabel || ariaLabelledBy);
	const usesWordmark = format === "wordmark" && Boolean(wordmarkAsset);
	const monoSource = usesWordmark ? wordmarkAsset! : asset;
	const colorSource = usesWordmark ? colorWordmarkAsset : colorAsset;
	const source = variant === "color" && colorSource ? colorSource : monoSource;
	const inlineDimension = usesWordmark
		? typeof size === "number"
			? `${size * (wordmarkAspectRatio ?? 1)}px`
			: `calc(${dimension} * ${wordmarkAspectRatio ?? 1})`
		: dimension;
	const drawingStyle: CSSProperties = {
		blockSize: usesWordmark ? "100%" : `${opticalScale * 100}%`,
		inlineSize: usesWordmark ? "100%" : `${opticalScale * 100}%`,
		transform: usesWordmark ? undefined : `translateY(${opticalShiftY * 100}%)`,
	};
	return (
		<span
			{...props}
			aria-hidden={accessible ? undefined : true}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			role={accessible ? "img" : undefined}
			data-format={usesWordmark ? "wordmark" : "mark"}
			style={{
				alignItems: "center",
				display: "inline-flex",
				flex: "0 0 auto",
				blockSize: dimension,
				inlineSize: inlineDimension,
				justifyContent: "center",
				lineHeight: 0,
				...style,
			}}
		>
			{variant === "color" && colorSource ? (
				<img alt="" decoding="async" loading="lazy" src={source} style={{ ...drawingStyle, objectFit: "contain" }} />
			) : (
				<span
					style={{
						...drawingStyle,
						backgroundColor: variant === "color" && brandColor ? brandColor : "currentColor",
						maskImage: `url("${source}")`,
						maskPosition: "center",
						maskRepeat: "no-repeat",
						maskSize: "contain",
						WebkitMaskImage: `url("${source}")`,
						WebkitMaskPosition: "center",
						WebkitMaskRepeat: "no-repeat",
						WebkitMaskSize: "contain",
					}}
				/>
			)}
		</span>
	);
}
