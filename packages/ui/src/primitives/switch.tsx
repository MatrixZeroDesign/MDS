import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from "react";
import { useControllableState } from "./state.js";

const Context = createContext(false);
export interface RootProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "defaultChecked" | "onChange"> {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	name?: string;
	value?: string;
	required?: boolean;
}
export const Root = forwardRef<HTMLButtonElement, RootProps>(function SwitchRoot(
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
	return (
		<Context.Provider value={current}>
			<button
				{...props}
				ref={(node) => {
					localRef.current = node;
					if (typeof forwardedRef === "function") forwardedRef(node);
					else if (forwardedRef) forwardedRef.current = node;
				}}
				type="button"
				role="switch"
				aria-checked={current}
				aria-required={required || undefined}
				data-state={current ? "checked" : "unchecked"}
				disabled={disabled}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented) setCurrent(!current);
				}}
			>
				{children}
				{name && current && <input type="hidden" name={name} value={value} />}
			</button>
		</Context.Provider>
	);
});
export const Thumb = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function SwitchThumb(props, ref) {
	const checked = useContext(Context);
	return <span {...props} ref={ref} data-state={checked ? "checked" : "unchecked"} />;
});
