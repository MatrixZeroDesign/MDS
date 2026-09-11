import { forwardRef, type ReactNode, type SVGProps } from "react";
export interface IconProps extends SVGProps<SVGSVGElement> {
	size?: number | string;
	/** Filled is available for catalog entries that advertise it; others remain outlined. */
	variant?: "outlined" | "filled";
	absoluteStrokeWidth?: boolean;
}
/** Compact silhouettes, softened corners and generous interior space on a 24px grid. */
export function defineIcon(name: string, drawing: ReactNode, filledDrawing?: () => ReactNode) {
	const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
		{ variant = "outlined", size = 16, strokeWidth = 1.75, absoluteStrokeWidth = false, children, ...props },
		ref,
	) {
		const labelled = Boolean(props["aria-label"] || props["aria-labelledby"]);
		const numericSize = typeof size === "number" ? size : Number(size);
		const width = absoluteStrokeWidth && numericSize > 0 ? (Number(strokeWidth) * 24) / numericSize : strokeWidth;
		return (
			<svg
				ref={ref}
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 24 24"
				data-variant={variant === "filled" && filledDrawing ? "filled" : "outlined"}
				fill="none"
				stroke="currentColor"
				strokeWidth={width}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden={labelled ? undefined : true}
				role={labelled ? "img" : undefined}
				focusable="false"
				{...props}
			>
				{variant === "filled" && filledDrawing ? filledDrawing() : drawing}
				{children}
			</svg>
		);
	});
	Icon.displayName = name;
	return Icon;
}
