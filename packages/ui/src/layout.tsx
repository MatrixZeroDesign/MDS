import type { ComponentProps, CSSProperties, ElementType } from "react";
import { cx } from "./controls.js";
export interface ContainerProps extends ComponentProps<"div"> {
	as?: "div" | "main" | "section" | "article" | "aside";
	maxWidth?: CSSProperties["maxWidth"];
	gutter?: CSSProperties["paddingInline"];
	centered?: boolean;
}
/** Width includes the inline gutters; narrow parents remain fluid. */
export function Container({
	as: Tag = "div",
	maxWidth = 1200,
	gutter = 24,
	centered = true,
	className,
	style,
	...props
}: ContainerProps) {
	const length = (value: string | number | undefined) => (typeof value === "number" ? `${value}px` : value);
	return (
		<Tag
			{...props}
			data-centered={centered}
			className={cx("mds-container", className)}
			style={
				{ "--mds-container-max": length(maxWidth), "--mds-container-gutter": length(gutter), ...style } as CSSProperties
			}
		/>
	);
}

export interface GridProps extends ComponentProps<"div"> {
	as?: "div" | "main" | "section" | "article" | "aside" | "ul" | "ol";
	/** Fixed equal-width column count. Ignored when minColumnWidth is set. */
	columns?: number;
	/** Enables a responsive auto-fit grid whose items never become narrower than this value. */
	minColumnWidth?: CSSProperties["minWidth"];
	gap?: CSSProperties["gap"];
	rowGap?: CSSProperties["rowGap"];
	columnGap?: CSSProperties["columnGap"];
}

/** Equal-width and auto-fit layouts that stay fluid inside narrow parents. */
export function Grid({
	as: Tag = "div",
	columns = 1,
	minColumnWidth,
	gap,
	rowGap,
	columnGap,
	className,
	style,
	...props
}: GridProps) {
	const Component = Tag as ElementType;
	const length = (value: string | number | undefined) => (typeof value === "number" ? `${value}px` : value);
	const safeColumns = Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 1;
	return (
		<Component
			{...props}
			className={cx("mds-grid", className)}
			data-auto-fit={minColumnWidth != null || undefined}
			style={
				{
					"--mds-grid-columns": safeColumns,
					"--mds-grid-min-column": length(minColumnWidth),
					"--mds-grid-gap": length(gap),
					"--mds-grid-row-gap": length(rowGap),
					"--mds-grid-column-gap": length(columnGap),
					...style,
				} as CSSProperties
			}
		/>
	);
}

export interface DividerProps extends ComponentProps<"div"> {
	orientation?: "horizontal" | "vertical";
	/** Removes separator semantics when the line is only visual. */
	decorative?: boolean;
}

/** A theme-aware rule for separating adjacent groups of content. */
export function Divider({ orientation = "horizontal", decorative = false, className, ...props }: DividerProps) {
	return (
		<div
			{...props}
			role={decorative ? "none" : "separator"}
			aria-hidden={decorative ? true : props["aria-hidden"]}
			aria-orientation={decorative ? undefined : orientation}
			data-orientation={orientation}
			className={cx("mds-divider", className)}
		/>
	);
}

export interface CardProps extends ComponentProps<"div"> {
	density?: "comfortable" | "compact";
	variant?: "outlined" | "elevated" | "subtle" | "plain";
}
export function Card({ variant = "outlined", className, density, ...props }: CardProps) {
	return <div {...props} data-mds-density={density} data-variant={variant} className={cx("mds-card", className)} />;
}
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
	return <div {...props} className={cx("mds-card-header", className)} />;
}
export function CardTitle({
	as: Tag = "h3",
	className,
	...props
}: ComponentProps<"h3"> & { as?: "h2" | "h3" | "h4" | "h5" | "h6" }) {
	return <Tag {...props} className={cx("mds-card-title", className)} />;
}
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
	return <p {...props} className={cx("mds-card-description", className)} />;
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
	return <div {...props} className={cx("mds-card-content", className)} />;
}
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
	return <div {...props} className={cx("mds-card-footer", className)} />;
}

export interface AtmosphereProps extends ComponentProps<"div"> {
	tone?: "brand" | "iris" | "mint" | "peach";
	as?: "div" | "section" | "article";
}
/** Decorative color stays behind content; theme colors provide the foreground contract. */
export function Atmosphere({ tone = "brand", as: Tag = "div", className, ...props }: AtmosphereProps) {
	return <Tag {...props} data-tone={tone} className={cx("mds-atmosphere", className)} />;
}
