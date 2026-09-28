import {
	Children,
	cloneElement,
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useId,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactElement,
} from "react";
import { useControllableState } from "./state.js";

type ContextValue = { open: boolean; setOpen: (open: boolean) => void; disabled?: boolean; contentId: string };
const Context = createContext<ContextValue | null>(null);
export interface RootProps extends HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
}
export const Root = forwardRef<HTMLDivElement, RootProps>(function CollapsibleRoot(
	{ open, defaultOpen = false, onOpenChange, disabled, children, ...props },
	ref,
) {
	const [current, setCurrent] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const contentId = useId();
	return (
		<Context.Provider value={{ open: current, setOpen: setCurrent, disabled, contentId }}>
			<div {...props} ref={ref} data-state={current ? "open" : "closed"} data-disabled={disabled || undefined}>
				{children}
			</div>
		</Context.Provider>
	);
});
export interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
}
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function CollapsibleTrigger(
	{ asChild, children, onClick, ...props },
	ref,
) {
	const context = useContext(Context);
	if (!context) throw new Error("Collapsible.Trigger requires Collapsible.Root");
	const shared = {
		...props,
		ref,
		"aria-expanded": context.open,
		"aria-controls": context.contentId,
		"data-state": context.open ? "open" : "closed",
		disabled: props.disabled || context.disabled,
		onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event);
			if (!event.defaultPrevented) context.setOpen(!context.open);
		},
	};
	if (asChild && isValidElement(children)) return cloneElement(Children.only(children) as ReactElement<any>, shared);
	return (
		<button type="button" {...shared}>
			{children}
		</button>
	);
});
export const Content = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { forceMount?: boolean }>(
	function CollapsibleContent({ forceMount, ...props }, ref) {
		const context = useContext(Context);
		if (!context) throw new Error("Collapsible.Content requires Collapsible.Root");
		if (!context.open && !forceMount) return null;
		return (
			<div
				{...props}
				ref={ref}
				id={context.contentId}
				data-state={context.open ? "open" : "closed"}
				hidden={!context.open}
			/>
		);
	},
);
