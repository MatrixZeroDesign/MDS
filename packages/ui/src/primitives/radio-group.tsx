import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import { useControllableState } from "./state.js";

type ContextValue = {
	value: string;
	setValue: (value: string) => void;
	disabled?: boolean;
	name?: string;
	orientation?: "horizontal" | "vertical";
	dir?: "ltr" | "rtl";
};
const Context = createContext<ContextValue | null>(null);
const ItemContext = createContext(false);
export interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	orientation?: "horizontal" | "vertical";
	dir?: "ltr" | "rtl";
	loop?: boolean;
}
export const Root = forwardRef<HTMLDivElement, RootProps>(function RadioRoot(
	{ value, defaultValue = "", onValueChange, name, disabled, required, orientation, dir, children, ...props },
	ref,
) {
	const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
	return (
		<Context.Provider value={{ value: current, setValue: setCurrent, disabled, name, orientation, dir }}>
			<div
				{...props}
				ref={ref}
				role="radiogroup"
				aria-required={required || undefined}
				aria-disabled={disabled || undefined}
			>
				{children}
			</div>
		</Context.Provider>
	);
});
export interface ItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
	value: string;
}
export const Item = forwardRef<HTMLButtonElement, ItemProps>(function RadioItem(
	{ value, disabled, children, onClick, onKeyDown, ...props },
	ref,
) {
	const context = useContext(Context);
	if (!context) throw new Error("RadioGroup.Item requires RadioGroup.Root");
	const checked = context.value === value;
	const move = (event: KeyboardEvent<HTMLButtonElement>) => {
		const horizontal = context.orientation !== "vertical";
		const nextKey = horizontal ? (context.dir === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
		const previousKey = horizontal ? (context.dir === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
		if (event.key !== nextKey && event.key !== previousKey) return;
		event.preventDefault();
		const items = [
			...event.currentTarget
				.closest('[role="radiogroup"]')!
				.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
		];
		const index = items.indexOf(event.currentTarget);
		const target = items[(index + (event.key === nextKey ? 1 : -1) + items.length) % items.length];
		target?.focus();
		target?.click();
	};
	return (
		<ItemContext.Provider value={checked}>
			<button
				{...props}
				ref={ref}
				type="button"
				value={value}
				role="radio"
				aria-checked={checked}
				data-state={checked ? "checked" : "unchecked"}
				disabled={disabled || context.disabled}
				tabIndex={checked || !context.value ? 0 : -1}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented) context.setValue(value);
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (!event.defaultPrevented) move(event);
				}}
			>
				{children}
				{context.name && checked && <input type="hidden" name={context.name} value={value} />}
			</button>
		</ItemContext.Provider>
	);
});
export function Indicator({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
	return useContext(ItemContext) ? <span {...props}>{children}</span> : null;
}
