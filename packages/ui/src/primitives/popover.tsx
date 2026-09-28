import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "./slot.js";
import { useControllableState } from "./state.js";
import { useFloatingPosition, type FloatingPlacement } from "./floating.js";

type ContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	openOn: "click" | "hover";
	scheduleOpen: () => void;
	scheduleClose: () => void;
	cancelScheduledClose: () => void;
	trigger: React.MutableRefObject<HTMLElement | null>;
	anchor: React.MutableRefObject<HTMLElement | null>;
};
const Context = createContext<ContextValue | null>(null);
export function Root({
	open,
	defaultOpen = false,
	onOpenChange,
	openOn = "click",
	openDelay = 100,
	closeDelay = 120,
	children,
}: {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	openOn?: "click" | "hover";
	openDelay?: number;
	closeDelay?: number;
	modal?: boolean;
	children: ReactNode;
}) {
	const [current, setCurrent] = useControllableState({
			value: open,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		}),
		trigger = useRef<HTMLElement | null>(null),
		anchor = useRef<HTMLElement | null>(null),
		openTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
		closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clearTimers = () => {
		if (openTimer.current) clearTimeout(openTimer.current);
		if (closeTimer.current) clearTimeout(closeTimer.current);
		openTimer.current = null;
		closeTimer.current = null;
	};
	const setOpen = (next: boolean) => {
		clearTimers();
		setCurrent(next);
	};
	const scheduleOpen = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		if (openTimer.current) return;
		openTimer.current = setTimeout(() => {
			openTimer.current = null;
			setCurrent(true);
		}, openDelay);
	};
	const scheduleClose = () => {
		if (openTimer.current) clearTimeout(openTimer.current);
		openTimer.current = null;
		if (closeTimer.current) return;
		closeTimer.current = setTimeout(() => {
			closeTimer.current = null;
			setCurrent(false);
		}, closeDelay);
	};
	useEffect(() => clearTimers, []);
	return (
		<Context.Provider
			value={{
				open: current,
				setOpen,
				openOn,
				scheduleOpen,
				scheduleClose,
				cancelScheduledClose: () => {
					if (closeTimer.current) clearTimeout(closeTimer.current);
					closeTimer.current = null;
				},
				trigger,
				anchor,
			}}
		>
			{children}
		</Context.Provider>
	);
}
export const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
	function PopoverTrigger({ asChild, onClick, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }, ref) {
		const context = useContext(Context);
		if (!context) throw new Error("Popover.Trigger requires Popover.Root");
		const shared = {
			...props,
			ref: (node: HTMLElement | null) => {
				context.trigger.current = node;
				if (typeof ref === "function") ref(node as HTMLButtonElement);
				else if (ref) ref.current = node as HTMLButtonElement;
			},
			"aria-haspopup": "dialog" as const,
			"aria-expanded": context.open,
			"data-state": context.open ? "open" : "closed",
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (!event.defaultPrevented && context.openOn === "click") context.setOpen(!context.open);
			},
			onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
				onPointerEnter?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.scheduleOpen();
			},
			onPointerLeave: (event: React.PointerEvent<HTMLButtonElement>) => {
				onPointerLeave?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.scheduleClose();
			},
			onFocus: (event: React.FocusEvent<HTMLButtonElement>) => {
				onFocus?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.setOpen(true);
			},
			onBlur: (event: React.FocusEvent<HTMLButtonElement>) => {
				onBlur?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.scheduleClose();
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export const Anchor = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { asChild?: boolean }>(
	function PopoverAnchor({ asChild, ...props }, ref) {
		const context = useContext(Context);
		const shared = {
			...props,
			ref: (node: HTMLElement | null) => {
				if (context) context.anchor.current = node;
				if (typeof ref === "function") ref(node as HTMLDivElement);
				else if (ref) ref.current = node as HTMLDivElement;
			},
		};
		return asChild ? <Slot {...shared} /> : <div {...shared} />;
	},
);
export function Portal({ container, children }: { container?: HTMLElement | null; children: ReactNode }) {
	const context = useContext(Context);
	return context?.open && container ? createPortal(children, container) : null;
}
export const Content = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		side?: "top" | "bottom" | "left" | "right";
		align?: "start" | "center" | "end";
		placement?: FloatingPlacement;
		sideOffset?: number;
		collisionPadding?: number;
		onOpenAutoFocus?: (event: Event) => void;
		onCloseAutoFocus?: (event: Event) => void;
		onEscapeKeyDown?: (event: KeyboardEvent) => void;
	}
>(function PopoverContent(
	{
		side = "bottom",
		align = "center",
		placement,
		dir,
		sideOffset = 0,
		collisionPadding = 8,
		onOpenAutoFocus,
		onCloseAutoFocus,
		onEscapeKeyDown,
		onKeyDown,
		onPointerEnter,
		onPointerLeave,
		onFocus,
		onBlur,
		style,
		...props
	},
	ref,
) {
	const context = useContext(Context),
		local = useRef<HTMLDivElement | null>(null);
	const openAutoFocus = useRef(onOpenAutoFocus),
		closeAutoFocus = useRef(onCloseAutoFocus);
	openAutoFocus.current = onOpenAutoFocus;
	closeAutoFocus.current = onCloseAutoFocus;
	const reference = context?.anchor.current ? context.anchor : context?.trigger;
	const position = useFloatingPosition({
		open: !!context?.open,
		anchor: reference ?? { current: null },
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
		const focusEvent = new Event("openAutoFocus", { cancelable: true });
		openAutoFocus.current?.(focusEvent);
		if (!focusEvent.defaultPrevented && context.openOn === "click") {
			queueMicrotask(() =>
				local.current
					?.querySelector<HTMLElement>(
						'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
					)
					?.focus(),
			);
		}
		const close = (event: PointerEvent) => {
			if (!local.current?.contains(event.target as Node) && !context.trigger.current?.contains(event.target as Node))
				context.setOpen(false);
		};
		document.addEventListener("pointerdown", close);
		return () => {
			document.removeEventListener("pointerdown", close);
			const focusEvent = new Event("closeAutoFocus", { cancelable: true });
			closeAutoFocus.current?.(focusEvent);
			if (!focusEvent.defaultPrevented && context.openOn === "click")
				context.trigger.current?.focus({ preventScroll: true });
		};
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
			role="dialog"
			dir={dir}
			data-state="open"
			data-side={position.side}
			data-align={position.align}
			data-placement={position.placement}
			style={{ ...position.style, ...style }}
			onPointerEnter={(event) => {
				onPointerEnter?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.cancelScheduledClose();
			}}
			onPointerLeave={(event) => {
				onPointerLeave?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.scheduleClose();
			}}
			onFocus={(event) => {
				onFocus?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.cancelScheduledClose();
			}}
			onBlur={(event) => {
				onBlur?.(event);
				if (!event.defaultPrevented && context.openOn === "hover") context.scheduleClose();
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (!event.defaultPrevented && event.key === "Escape") {
					const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", cancelable: true });
					onEscapeKeyDown?.(escapeEvent);
					if (escapeEvent.defaultPrevented) return;
					event.preventDefault();
					context.setOpen(false);
					context.trigger.current?.focus();
				}
			}}
		/>
	);
});
export const Close = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
	function PopoverClose({ asChild, onClick, ...props }, ref) {
		const context = useContext(Context);
		const shared = {
			...props,
			ref,
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					context?.setOpen(false);
					queueMicrotask(() => context?.trigger.current?.focus());
				}
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export const Arrow = forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(function PopoverArrow(props, ref) {
	return (
		<svg {...props} ref={ref} viewBox="0 0 12 6" aria-hidden="true">
			<path d="M0 6 6 0l6 6Z" />
			<path data-arrow-outline="" d="M0 6 6 0l6 6" />
		</svg>
	);
});
