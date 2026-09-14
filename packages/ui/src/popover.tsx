import { useId, type ComponentProps } from "react";
import { useDirection } from "@radix-ui/react-direction";
import * as Primitive from "@radix-ui/react-popover";
import { cx } from "./controls.js";
import { usePortalContainer } from "./theme.js";

/** Anchored custom content; non-modal by default. */
export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverAnchor = Primitive.Anchor;
export const PopoverClose = Primitive.Close;
export interface PopoverContentProps extends Omit<ComponentProps<typeof Primitive.Content>, "title" | "side"> {
	/** Visible accessible heading. */
	title: string;
	description?: string;
	side?: "top" | "bottom" | "left" | "right" | "start" | "end";
	arrow?: boolean;
}
export function PopoverContent({
	title,
	description,
	side = "bottom",
	align = "start",
	sideOffset = 8,
	collisionPadding = 12,
	arrow = false,
	children,
	className,
	...props
}: PopoverContentProps) {
	const container = usePortalContainer();
	const direction = useDirection();
	const titleId = useId(),
		descriptionId = useId();
	const physicalSide =
		side === "start"
			? direction === "rtl"
				? "right"
				: "left"
			: side === "end"
				? direction === "rtl"
					? "left"
					: "right"
				: side;
	return container ? (
		<Primitive.Portal container={container}>
			<Primitive.Content
				{...props}
				dir={direction}
				side={physicalSide}
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				aria-labelledby={props["aria-labelledby"] ?? titleId}
				aria-describedby={props["aria-describedby"] ?? (description ? descriptionId : undefined)}
				className={cx("mds-popover", className)}
			>
				<div className="mds-popover-body">
					<div className="mds-popover-header">
						<h3 id={titleId} className="mds-popover-title">
							{title}
						</h3>
						{description && (
							<p id={descriptionId} className="mds-popover-description">
								{description}
							</p>
						)}
					</div>
					{children}
				</div>
				{arrow && <Primitive.Arrow className="mds-popover-arrow" width={12} height={6} />}
			</Primitive.Content>
		</Primitive.Portal>
	) : null;
}
