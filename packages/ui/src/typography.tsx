import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "./controls.js";

export type TypographyVariant =
	| "display"
	| "title-lg"
	| "title"
	| "title-sm"
	| "body-lg"
	| "body"
	| "body-sm"
	| "label"
	| "caption"
	| "overline"
	| "code";

export interface TypographyProps extends ComponentPropsWithoutRef<"p"> {
	as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "code";
	variant?: TypographyVariant;
	tone?: "default" | "muted" | "inherit";
	truncate?: boolean;
	/** Adds a variant-aware bottom gutter for natural document flow. */
	gutter?: boolean;
}

/** Applies an MDS type style while keeping the chosen HTML semantics explicit. */
export function Typography({
	as: Tag = "p",
	variant = "body",
	tone = "default",
	truncate = false,
	gutter = false,
	className,
	...props
}: TypographyProps) {
	const Component = Tag as ElementType;
	return (
		<Component
			{...props}
			className={cx("mds-typography", className)}
			data-variant={variant}
			data-tone={tone}
			data-truncate={truncate || undefined}
			data-gutter={gutter || undefined}
		/>
	);
}
