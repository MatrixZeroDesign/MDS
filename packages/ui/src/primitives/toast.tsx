import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from "react";

const DurationContext = createContext(5000);
const CloseContext = createContext<() => void>(() => {});
export function Provider({ duration = 5000, children }: { duration?: number; label?: string; children: ReactNode }) {
	return <DurationContext.Provider value={duration}>{children}</DurationContext.Provider>;
}
export interface RootProps extends HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	duration?: number;
	type?: "foreground" | "background";
	paused?: boolean;
}
export const Root = forwardRef<HTMLDivElement, RootProps>(function ToastRoot(
	{
		open,
		defaultOpen = true,
		onOpenChange,
		duration,
		paused,
		onPointerEnter,
		onPointerLeave,
		onFocus,
		onBlur,
		...props
	},
	ref,
) {
	const providerDuration = useContext(DurationContext);
	const [internal, setInternal] = useState(defaultOpen);
	const shown = open ?? internal;
	const remaining = useRef(duration ?? providerDuration);
	const started = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const close = () => {
		if (open === undefined) setInternal(false);
		onOpenChange?.(false);
	};
	const pause = () => {
		if (!timer.current) return;
		clearTimeout(timer.current);
		timer.current = null;
		remaining.current -= performance.now() - started.current;
	};
	const resume = () => {
		if (!shown || !Number.isFinite(remaining.current) || timer.current) return;
		started.current = performance.now();
		timer.current = setTimeout(close, Math.max(0, remaining.current));
	};
	useEffect(() => {
		remaining.current = duration ?? providerDuration;
		resume();
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [shown, duration, providerDuration]);
	useEffect(() => {
		if (!shown) return;
		if (paused) pause();
		else resume();
	}, [shown, paused]);
	if (!shown) return null;
	return (
		<CloseContext.Provider value={close}>
			<div
				{...props}
				ref={ref}
				role="status"
				onPointerEnter={(event) => {
					onPointerEnter?.(event);
					pause();
				}}
				onPointerLeave={(event) => {
					onPointerLeave?.(event);
					resume();
				}}
				onFocus={(event) => {
					onFocus?.(event);
					pause();
				}}
				onBlur={(event) => {
					onBlur?.(event);
					if (!event.currentTarget.contains(event.relatedTarget)) resume();
				}}
			/>
		</CloseContext.Provider>
	);
});
export const Title = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToastTitle(props, ref) {
	return <div {...props} ref={ref} />;
});
export const Description = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	function ToastDescription(props, ref) {
		return <div {...props} ref={ref} />;
	},
);
export const Action = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { altText: string }>(
	function ToastAction({ altText: _altText, ...props }, ref) {
		return <button {...props} ref={ref} type={props.type ?? "button"} />;
	},
);
export const Close = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function ToastClose(
	{ onClick, ...props },
	ref,
) {
	const close = useContext(CloseContext);
	return (
		<button
			{...props}
			ref={ref}
			type={props.type ?? "button"}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					event.currentTarget.blur();
					close();
				}
			}}
		/>
	);
});
export const Viewport = forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement> & { label?: string }>(
	function ToastViewport({ label, ...props }, ref) {
		return <ol {...props} ref={ref} aria-label={label} />;
	},
);
