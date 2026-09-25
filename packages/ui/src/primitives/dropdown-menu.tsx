import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "./slot.js";
import { useControllableState } from "./state.js";

type RootContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	trigger: React.MutableRefObject<HTMLElement | null>;
};
const RootContext = createContext<RootContextValue | null>(null);
const RadioContext = createContext<{ value: string; setValue: (value: string) => void } | null>(null);
const ItemContext = createContext(false);
export function Root({
	open,
	defaultOpen = false,
	onOpenChange,
	children,
}: {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	modal?: boolean;
	dir?: string;
	children: ReactNode;
}) {
	const [current, setCurrent] = useControllableState({
			value: open,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		}),
		trigger = useRef<HTMLElement | null>(null);
	return (
		<RootContext.Provider value={{ open: current, setOpen: setCurrent, trigger }}>{children}</RootContext.Provider>
	);
}
export const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
	function MenuTrigger({ asChild, onClick, onKeyDown, ...props }, ref) {
		const context = useContext(RootContext);
		if (!context) throw new Error("DropdownMenu.Trigger requires DropdownMenu.Root");
		const shared = {
			...props,
			ref: (node: HTMLElement | null) => {
				context.trigger.current = node;
				if (typeof ref === "function") ref(node as HTMLButtonElement);
				else if (ref) ref.current = node as HTMLButtonElement;
			},
			"aria-haspopup": "menu" as const,
			"aria-expanded": context.open,
			"data-state": context.open ? "open" : "closed",
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (!event.defaultPrevented) context.setOpen(!context.open);
			},
			onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
				onKeyDown?.(event);
				if (!event.defaultPrevented && ["Enter", " ", "ArrowDown"].includes(event.key)) {
					event.preventDefault();
					context.setOpen(true);
					queueMicrotask(() =>
						context.trigger.current?.parentElement?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus(),
					);
				}
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export function Portal({ container, children }: { container?: HTMLElement | null; children: ReactNode }) {
	const context = useContext(RootContext);
	return context?.open && container ? createPortal(children, container) : null;
}
export const Content = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		align?: "start" | "center" | "end";
		side?: "top" | "bottom" | "left" | "right";
		sideOffset?: number;
		collisionPadding?: number;
		loop?: boolean;
		onCloseAutoFocus?: (event: Event) => void;
	}
>(function MenuContent(
	{
		align = "start",
		side = "bottom",
		sideOffset = 0,
		collisionPadding: _collisionPadding,
		loop: _loop,
		onKeyDown,
		style,
		...props
	},
	ref,
) {
	const context = useContext(RootContext),
		local = useRef<HTMLDivElement | null>(null);
	const [position, setPosition] = useState<CSSProperties>({ position: "fixed", visibility: "hidden" });
	useLayoutEffect(() => {
		if (!context?.open) return;
		const update = () => {
			const rect = context.trigger.current?.getBoundingClientRect();
			if (!rect) return;
			const viewportWidth = window.innerWidth;
			const height = local.current?.getBoundingClientRect().height ?? 0;
			const preferredTop = side === "top" ? rect.top - height - sideOffset : rect.bottom + sideOffset;
			const top =
				preferredTop + height > window.innerHeight - 8
					? Math.max(8, rect.top - height - sideOffset)
					: preferredTop < 8
						? rect.bottom + sideOffset
						: preferredTop;
			const start = Math.max(8, Math.min(rect.left, Math.max(8, viewportWidth - 328)));
			setPosition(
				align === "end"
					? { position: "fixed", top, right: Math.max(8, viewportWidth - rect.right) }
					: {
							position: "fixed",
							top,
							left: align === "center" ? rect.left + rect.width / 2 : start,
							transform: align === "center" ? "translateX(-50%)" : undefined,
						},
			);
		};
		update();
		window.addEventListener("resize", update);
		document.addEventListener("scroll", update, true);
		return () => {
			window.removeEventListener("resize", update);
			document.removeEventListener("scroll", update, true);
		};
	}, [context?.open, align, side, sideOffset]);
	useEffect(() => {
		if (!context?.open) return;
		queueMicrotask(() =>
			local.current?.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')?.focus(),
		);
		const outside = (event: PointerEvent) => {
			if (!local.current?.contains(event.target as Node) && !context.trigger.current?.contains(event.target as Node))
				context.setOpen(false);
		};
		document.addEventListener("pointerdown", outside);
		return () => document.removeEventListener("pointerdown", outside);
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
			role="menu"
			tabIndex={-1}
			data-state="open"
			data-side={side}
			data-align={align}
			style={{ ...position, ...style }}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "Escape") {
					event.preventDefault();
					context.setOpen(false);
					context.trigger.current?.focus();
					return;
				}
				const items = [
					...event.currentTarget.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])'),
				];
				const index = items.indexOf(document.activeElement as HTMLElement);
				const target =
					event.key === "ArrowDown"
						? items[(index + 1) % items.length]
						: event.key === "ArrowUp"
							? items[(index - 1 + items.length) % items.length]
							: event.key === "Home"
								? items[0]
								: event.key === "End"
									? items.at(-1)
									: null;
				if (target) {
					event.preventDefault();
					target.focus();
				}
			}}
		/>
	);
});
export const Item = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & { disabled?: boolean; onSelect?: (event: Event) => void; textValue?: string }
>(function MenuItem({ disabled, onSelect, onClick, onPointerMove, textValue: _textValue, role, ...props }, ref) {
	const root = useContext(RootContext);
	return (
		<div
			{...props}
			ref={ref}
			role={role ?? "menuitem"}
			tabIndex={disabled ? undefined : -1}
			aria-disabled={disabled || undefined}
			data-disabled={disabled ? "" : undefined}
			onPointerMove={(event) => {
				onPointerMove?.(event);
				if (!event.defaultPrevented && !disabled && document.activeElement !== event.currentTarget)
					event.currentTarget.focus({ preventScroll: true });
			}}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented || disabled) return;
				const selectEvent = new Event("select", { cancelable: true });
				onSelect?.(selectEvent);
				if (!selectEvent.defaultPrevented) {
					root?.setOpen(false);
					queueMicrotask(() => root?.trigger.current?.focus());
				}
			}}
		/>
	);
});
export const Label = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function MenuLabel(props, ref) {
	return <div {...props} ref={ref} />;
});
export const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function MenuSeparator(props, ref) {
	return <div {...props} ref={ref} role="separator" />;
});
export function RadioGroup({
	value,
	onValueChange,
	children,
}: {
	value: string;
	onValueChange: (value: string) => void;
	children: ReactNode;
}) {
	return <RadioContext.Provider value={{ value, setValue: onValueChange }}>{children}</RadioContext.Provider>;
}
export const RadioItem = forwardRef<
	HTMLDivElement,
	Omit<HTMLAttributes<HTMLDivElement>, "value"> & { value: string; disabled?: boolean; textValue?: string }
>(function MenuRadioItem({ value, disabled, onClick, onPointerMove, textValue: _textValue, ...props }, ref) {
	const radio = useContext(RadioContext),
		root = useContext(RootContext),
		checked = radio?.value === value;
	return (
		<ItemContext.Provider value={checked}>
			<div
				{...props}
				ref={ref}
				role="menuitemradio"
				aria-checked={checked}
				aria-disabled={disabled || undefined}
				data-state={checked ? "checked" : "unchecked"}
				data-disabled={disabled ? "" : undefined}
				tabIndex={disabled ? undefined : -1}
				onPointerMove={(event) => {
					onPointerMove?.(event);
					if (!event.defaultPrevented && !disabled && document.activeElement !== event.currentTarget)
						event.currentTarget.focus({ preventScroll: true });
				}}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented && !disabled) {
						radio?.setValue(value);
						root?.setOpen(false);
						queueMicrotask(() => root?.trigger.current?.focus());
					}
				}}
			/>
		</ItemContext.Provider>
	);
});
export function ItemIndicator({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
	return useContext(ItemContext) ? <span {...props}>{children}</span> : null;
}
