import type { ComponentProps, CSSProperties } from "react";
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
export interface CardProps extends ComponentProps<"div"> {
	variant?: "outlined" | "elevated" | "subtle";
}
export function Card({ variant = "outlined", className, ...props }: CardProps) {
	return <div {...props} data-variant={variant} className={cx("mds-card", className)} />;
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
	tone?: "iris" | "mint" | "peach";
	as?: "div" | "section" | "article";
}
/** Decorative color stays behind content; theme colors provide the foreground contract. */
export function Atmosphere({ tone = "iris", as: Tag = "div", className, ...props }: AtmosphereProps) {
	return <Tag {...props} data-tone={tone} className={cx("mds-atmosphere", className)} />;
}
