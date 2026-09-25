import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useFloatingPosition, type FloatingAlign, type FloatingPlacement } from "./floating.js";
import { Slot } from "./slot.js";

const DelayContext = createContext(400);
type ContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	trigger: React.MutableRefObject<HTMLElement | null>;
	timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
};
const Context = createContext<ContextValue | null>(null);
export function Provider({
	delayDuration = 400,
	children,
}: {
	delayDuration?: number;
	skipDelayDuration?: number;
	disableHoverableContent?: boolean;
	children: ReactNode;
}) {
	return <DelayContext.Provider value={delayDuration}>{children}</DelayContext.Provider>;
}
export function Root({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
}: {
	children: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	delayDuration?: number;
}) {
	const [internal, setInternal] = useState(defaultOpen),
		trigger = useRef<HTMLElement | null>(null),
		timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const current = open ?? internal;
	const setOpen = (next: boolean) => {
		if (open === undefined) setInternal(next);
		onOpenChange?.(next);
	};
	return <Context.Provider value={{ open: current, setOpen, trigger, timer }}>{children}</Context.Provider>;
}
export const Trigger = forwardRef<HTMLElement, { asChild?: boolean; children?: ReactNode } & Record<string, any>>(
	function TooltipTrigger({ asChild, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }, ref) {
		const context = useContext(Context),
			delay = useContext(DelayContext);
		if (!context) throw new Error("Tooltip.Trigger requires Tooltip.Root");
		const openSoon = () => {
			if (context.timer.current) clearTimeout(context.timer.current);
			context.timer.current = setTimeout(() => context.setOpen(true), delay);
		};
		const close = () => {
			if (context.timer.current) clearTimeout(context.timer.current);
			context.setOpen(false);
		};
		const shared = {
			...props,
			ref: (node: HTMLElement | null) => {
				context.trigger.current = node;
				if (typeof ref === "function") ref(node);
				else if (ref) ref.current = node;
			},
			onPointerEnter: (event: React.PointerEvent) => {
				onPointerEnter?.(event);
				if (!event.defaultPrevented) openSoon();
			},
			onPointerLeave: (event: React.PointerEvent) => {
				onPointerLeave?.(event);
				if (!event.defaultPrevented) close();
			},
			onFocus: (event: React.FocusEvent) => {
				onFocus?.(event);
				if (!event.defaultPrevented) openSoon();
			},
			onBlur: (event: React.FocusEvent) => {
				onBlur?.(event);
				if (!event.defaultPrevented) close();
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export function Portal({ container, children }: { container?: HTMLElement | null; children: ReactNode }) {
	const context = useContext(Context);
	return context?.open && container ? createPortal(children, container) : null;
}
export const Content = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		sideOffset?: number;
		collisionPadding?: number;
		side?: "top" | "right" | "bottom" | "left";
		align?: FloatingAlign;
		placement?: FloatingPlacement;
	}
>(function TooltipContent(
	{ sideOffset = 6, collisionPadding = 8, side = "top", align = "center", placement, dir, style, ...props },
	ref,
) {
	const context = useContext(Context),
		local = useRef<HTMLDivElement | null>(null);
	const position = useFloatingPosition({
		open: !!context?.open,
		anchor: context?.trigger ?? { current: null },
		content: local,
		side,
		align,
		placement,
		direction: dir,
		sideOffset,
		collisionPadding,
	});
	useEffect(() => {
		if (!context?.open) return;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") context.setOpen(false);
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [context?.open]);
	if (!context?.open) return null;
	return (
		<div
			{...props}
			ref={(node) => {
				local.current = node;
				if (typeof ref === "function") ref(node);
				else if (ref) ref.current = node;
			}}
			role="tooltip"
			dir={dir}
			data-side={position.side}
			data-align={position.align}
			data-placement={position.placement}
			style={{ ...position.style, ...style }}
		/>
	);
});
export const Arrow = forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(function TooltipArrow(props, ref) {
	return (
		<svg {...props} ref={ref} width="8" height="4" viewBox="0 0 8 4" aria-hidden="true">
			<path d="M0 4 4 0l4 4Z" />
		</svg>
	);
});
