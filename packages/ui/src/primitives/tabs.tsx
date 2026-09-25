import {
	createContext,
	forwardRef,
	useContext,
	useId,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type KeyboardEvent,
} from "react";
import { useControllableState } from "./state.js";

type ContextValue = {
	value: string;
	setValue: (value: string) => void;
	orientation: "horizontal" | "vertical";
	dir: "ltr" | "rtl";
	activationMode: "automatic" | "manual";
	baseId: string;
};
const Context = createContext<ContextValue | null>(null);
export interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "horizontal" | "vertical";
	dir?: "ltr" | "rtl";
	activationMode?: "automatic" | "manual";
}
export const Root = forwardRef<HTMLDivElement, RootProps>(function TabsRoot(
	{
		value,
		defaultValue = "",
		onValueChange,
		orientation = "horizontal",
		dir = "ltr",
		activationMode = "automatic",
		children,
		...props
	},
	ref,
) {
	const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
	const baseId = useId();
	return (
		<Context.Provider value={{ value: current, setValue: setCurrent, orientation, dir, activationMode, baseId }}>
			<div {...props} ref={ref} dir={dir} data-orientation={orientation}>
				{children}
			</div>
		</Context.Provider>
	);
});
export const List = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TabsList(props, ref) {
	const context = useContext(Context);
	if (!context) throw new Error("Tabs.List requires Tabs.Root");
	return (
		<div
			{...props}
			ref={ref}
			role="tablist"
			aria-orientation={context.orientation}
			data-orientation={context.orientation}
		/>
	);
});
export interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function TabsTrigger(
	{ value, disabled, onClick, onKeyDown, ...props },
	ref,
) {
	const context = useContext(Context);
	if (!context) throw new Error("Tabs.Trigger requires Tabs.Root");
	const selected = context.value === value;
	const keydown = (event: KeyboardEvent<HTMLButtonElement>) => {
		const nextKey =
			context.orientation === "vertical" ? "ArrowDown" : context.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
		const previousKey =
			context.orientation === "vertical" ? "ArrowUp" : context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
		if (![nextKey, previousKey, "Home", "End"].includes(event.key)) return;
		event.preventDefault();
		const tabs = [
			...event.currentTarget
				.closest('[role="tablist"]')!
				.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
		];
		const index = tabs.indexOf(event.currentTarget);
		const target =
			event.key === "Home"
				? tabs[0]
				: event.key === "End"
					? tabs.at(-1)
					: tabs[(index + (event.key === nextKey ? 1 : -1) + tabs.length) % tabs.length];
		target?.focus();
		if (context.activationMode === "automatic") target?.click();
	};
	return (
		<button
			{...props}
			ref={ref}
			type="button"
			role="tab"
			id={`${context.baseId}-tab-${value}`}
			aria-controls={`${context.baseId}-panel-${value}`}
			aria-selected={selected}
			data-state={selected ? "active" : "inactive"}
			data-orientation={context.orientation}
			disabled={disabled}
			tabIndex={selected ? 0 : -1}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) context.setValue(value);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (!event.defaultPrevented) keydown(event);
			}}
		/>
	);
});
export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	forceMount?: true;
}
export const Content = forwardRef<HTMLDivElement, ContentProps>(function TabsContent(
	{ value, forceMount, ...props },
	ref,
) {
	const context = useContext(Context);
	if (!context) throw new Error("Tabs.Content requires Tabs.Root");
	const selected = context.value === value;
	if (!selected && !forceMount) return null;
	return (
		<div
			{...props}
			ref={ref}
			role="tabpanel"
			id={`${context.baseId}-panel-${value}`}
			aria-labelledby={`${context.baseId}-tab-${value}`}
			hidden={!selected}
			data-state={selected ? "active" : "inactive"}
		/>
	);
});
