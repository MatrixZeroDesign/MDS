import {
	createContext,
	forwardRef,
	useContext,
	useId,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { useControllableState } from "./state.js";

type RootValue = string | string[];
type RootContextValue = {
	value: RootValue;
	setValue: (value: RootValue) => void;
	type: "single" | "multiple";
	collapsible: boolean;
	disabled?: boolean;
	baseId: string;
};
const RootContext = createContext<RootContextValue | null>(null);
const ItemContext = createContext<{ value: string; open: boolean; disabled?: boolean } | null>(null);
export type RootProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
	type: "single" | "multiple";
	value?: RootValue;
	defaultValue?: RootValue;
	onValueChange?: (value: any) => void;
	collapsible?: boolean;
	disabled?: boolean;
};
export const Root = forwardRef<HTMLDivElement, RootProps>(function AccordionRoot(
	{
		type,
		value,
		defaultValue = type === "multiple" ? [] : "",
		onValueChange,
		collapsible = false,
		disabled,
		children,
		...props
	},
	ref,
) {
	const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
	const baseId = useId();
	return (
		<RootContext.Provider value={{ value: current, setValue: setCurrent, type, collapsible, disabled, baseId }}>
			<div {...props} ref={ref}>
				{children}
			</div>
		</RootContext.Provider>
	);
});
export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	disabled?: boolean;
}
export const Item = forwardRef<HTMLDivElement, ItemProps>(function AccordionItem(
	{ value, disabled, children, ...props },
	ref,
) {
	const root = useContext(RootContext);
	if (!root) throw new Error("Accordion.Item requires Accordion.Root");
	const open = Array.isArray(root.value) ? root.value.includes(value) : root.value === value;
	return (
		<ItemContext.Provider value={{ value, open, disabled: disabled || root.disabled }}>
			<div
				{...props}
				ref={ref}
				data-state={open ? "open" : "closed"}
				data-disabled={disabled || root.disabled || undefined}
			>
				{children}
			</div>
		</ItemContext.Provider>
	);
});
export const Header = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	function AccordionHeader(props, ref) {
		return <h3 {...props} ref={ref} />;
	},
);
export const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function AccordionTrigger(
	{ onClick, onKeyDown, ...props },
	ref,
) {
	const root = useContext(RootContext),
		item = useContext(ItemContext);
	if (!root || !item) throw new Error("Accordion.Trigger requires Accordion.Item");
	const toggle = () => {
		if (root.type === "multiple") {
			const values = root.value as string[];
			root.setValue(item.open ? values.filter((value) => value !== item.value) : [...values, item.value]);
		} else if (!item.open || root.collapsible) root.setValue(item.open ? "" : item.value);
	};
	return (
		<button
			{...props}
			ref={ref}
			type="button"
			id={`${root.baseId}-trigger-${item.value}`}
			aria-expanded={item.open}
			aria-controls={`${root.baseId}-content-${item.value}`}
			data-state={item.open ? "open" : "closed"}
			disabled={item.disabled}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) toggle();
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
				event.preventDefault();
				const buttons = [
					...(event.currentTarget
						.closest("[data-accordion-root], .mds-accordion")
						?.querySelectorAll<HTMLButtonElement>(".mds-accordion-trigger:not(:disabled)") ?? []),
				];
				const index = buttons.indexOf(event.currentTarget);
				const target =
					event.key === "Home"
						? buttons[0]
						: event.key === "End"
							? buttons.at(-1)
							: buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length];
				target?.focus();
			}}
		/>
	);
});
export const Content = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	function AccordionContent(props, ref) {
		const root = useContext(RootContext),
			item = useContext(ItemContext);
		if (!root || !item) throw new Error("Accordion.Content requires Accordion.Item");
		return (
			<div
				{...props}
				ref={ref}
				role="region"
				id={`${root.baseId}-content-${item.value}`}
				aria-labelledby={`${root.baseId}-trigger-${item.value}`}
				data-state={item.open ? "open" : "closed"}
				hidden={!item.open}
			/>
		);
	},
);
