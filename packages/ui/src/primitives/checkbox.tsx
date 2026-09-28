import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type ReactNode,
} from "react";
import { useControllableState } from "./state.js";

export type CheckedState = boolean | "indeterminate";
type ContextValue = { checked: CheckedState };
const Context = createContext<ContextValue>({ checked: false });

export interface RootProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "defaultChecked" | "onChange"> {
	checked?: CheckedState;
	defaultChecked?: CheckedState;
	onCheckedChange?: (checked: CheckedState) => void;
	name?: string;
	value?: string;
	required?: boolean;
}

export const Root = forwardRef<HTMLButtonElement, RootProps>(function CheckboxRoot(
	{
		checked,
		defaultChecked = false,
		onCheckedChange,
		name,
		value = "on",
		required,
		disabled,
		children,
		onClick,
		...props
	},
	forwardedRef,
) {
	const localRef = useRef<HTMLButtonElement | null>(null);
	const [current, setCurrent] = useControllableState({
		value: checked,
		defaultValue: defaultChecked,
		onChange: onCheckedChange,
	});
	useEffect(() => {
		const form = localRef.current?.closest("form");
		if (!form || checked !== undefined) return;
		const reset = () => queueMicrotask(() => setCurrent(defaultChecked));
		form.addEventListener("reset", reset);
		return () => form.removeEventListener("reset", reset);
	}, [checked, defaultChecked, setCurrent]);
	const state = current === "indeterminate" ? "indeterminate" : current ? "checked" : "unchecked";
	return (
		<Context.Provider value={{ checked: current }}>
			<button
				{...props}
				ref={(node) => {
					localRef.current = node;
					if (typeof forwardedRef === "function") forwardedRef(node);
					else if (forwardedRef) forwardedRef.current = node;
				}}
				type="button"
				role="checkbox"
				aria-checked={current === "indeterminate" ? "mixed" : current}
				aria-required={required || undefined}
				data-state={state}
				disabled={disabled}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented) setCurrent(current === "indeterminate" ? true : !current);
				}}
			>
				{children}
				{name && current === true && <input type="hidden" name={name} value={value} />}
			</button>
		</Context.Provider>
	);
});

export function Indicator({ children, ...props }: { children?: ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
	const { checked } = useContext(Context);
	return checked ? <span {...props}>{children}</span> : null;
}
