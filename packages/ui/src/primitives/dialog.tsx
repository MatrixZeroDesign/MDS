import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useId,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "./slot.js";
import { useControllableState } from "./state.js";

type ContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	trigger: React.MutableRefObject<HTMLElement | null>;
	titleId: string;
};
const Context = createContext<ContextValue | null>(null);
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
	children: ReactNode;
}) {
	const [current, setCurrent] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const trigger = useRef<HTMLElement | null>(null);
	const titleId = useId();
	return (
		<Context.Provider value={{ open: current, setOpen: setCurrent, trigger, titleId }}>{children}</Context.Provider>
	);
}
export const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
	function DialogTrigger({ asChild, onClick, ...props }, ref) {
		const context = useContext(Context);
		if (!context) throw new Error("Dialog.Trigger requires Dialog.Root");
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
				if (!event.defaultPrevented) context.setOpen(true);
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export function Portal({ container, children }: { container?: HTMLElement | null; children: ReactNode }) {
	const context = useContext(Context);
	return context?.open && container ? createPortal(children, container) : null;
}
export const Overlay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogOverlay(
	{ onPointerDown, ...props },
	ref,
) {
	const context = useContext(Context);
	return (
		<div
			{...props}
			ref={ref}
			data-state={context?.open ? "open" : "closed"}
			onPointerDown={(event) => {
				onPointerDown?.(event);
				if (!event.defaultPrevented && event.target === event.currentTarget) context?.setOpen(false);
			}}
		/>
	);
});
const focusables = (node: HTMLElement) =>
	[
		...node.querySelectorAll<HTMLElement>(
			'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
		),
	].filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
export const Content = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		onOpenAutoFocus?: (event: Event) => void;
		onCloseAutoFocus?: (event: Event) => void;
	}
>(function DialogContent({ onKeyDown, onOpenAutoFocus, onCloseAutoFocus, ...props }, forwardedRef) {
	const context = useContext(Context);
	const localRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!context?.open || !localRef.current) return;
		const openEvent = new Event("openAutoFocus", { cancelable: true });
		onOpenAutoFocus?.(openEvent);
		if (!openEvent.defaultPrevented)
			queueMicrotask(() => focusables(localRef.current!)[0]?.focus() ?? localRef.current?.focus());
		return () => {
			const closeEvent = new Event("closeAutoFocus", { cancelable: true });
			onCloseAutoFocus?.(closeEvent);
			if (!closeEvent.defaultPrevented) queueMicrotask(() => context.trigger.current?.focus());
		};
	}, [context?.open]);
	if (!context?.open) return null;
	return (
		<div
			{...props}
			ref={(node) => {
				localRef.current = node;
				if (typeof forwardedRef === "function") forwardedRef(node);
				else if (forwardedRef) forwardedRef.current = node;
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby={props["aria-label"] ? undefined : context.titleId}
			tabIndex={-1}
			data-state="open"
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "Escape") {
					event.preventDefault();
					context.setOpen(false);
					return;
				}
				if (event.key !== "Tab") return;
				const items = focusables(event.currentTarget);
				if (!items.length) {
					event.preventDefault();
					return;
				}
				const first = items[0],
					last = items.at(-1)!;
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}}
		/>
	);
});
export const Close = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
	function DialogClose({ asChild, onClick, ...props }, ref) {
		const context = useContext(Context);
		const shared = {
			...props,
			ref,
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (!event.defaultPrevented) context?.setOpen(false);
			},
		};
		return asChild ? <Slot {...shared} /> : <button type="button" {...shared} />;
	},
);
export const Title = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	function DialogTitle(props, ref) {
		const context = useContext(Context);
		return <h2 {...props} ref={ref} id={props.id ?? context?.titleId} />;
	},
);
export const Description = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	function DialogDescription(props, ref) {
		return <p {...props} ref={ref} />;
	},
);
