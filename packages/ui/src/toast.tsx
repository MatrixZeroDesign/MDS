import { Check, X, Info, AlertCircle } from "@matrixzero/icons";
import * as Primitive from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePortalContainer } from "./theme.js";

export interface ToastOptions {
	title: string;
	description?: ReactNode;
	tone?: "neutral" | "success" | "info" | "warning" | "danger";
	/** Milliseconds; Infinity keeps the notification open until dismissed. */
	duration?: number;
	action?: { label: string; altText: string; onClick: () => void };
}
type Entry = ToastOptions & { id: number };
type ToastContextValue = {
	entries: Entry[];
	toast: (options: ToastOptions) => number;
	dismiss: (id: number) => void;
	clear: () => void;
};
const Context = createContext<ToastContextValue | null>(null);
export function useToast() {
	const context = useContext(Context);
	if (!context) throw new Error("useToast requires ToastProvider");
	return context;
}
export function ToastProvider({
	children,
	duration = 5000,
	label = "Notification",
}: {
	children: ReactNode;
	duration?: number;
	label?: string;
}) {
	const [entries, setEntries] = useState<Entry[]>([]);
	const sequence = useRef(0);
	const toast = useCallback((options: ToastOptions) => {
		const id = ++sequence.current;
		setEntries((current) => [...current, { ...options, id }]);
		return id;
	}, []);
	const dismiss = useCallback((id: number) => setEntries((current) => current.filter((entry) => entry.id !== id)), []);
	const clear = useCallback(() => setEntries([]), []);
	return (
		<Context.Provider value={{ entries, toast, dismiss, clear }}>
			<Primitive.Provider duration={duration} label={label}>
				{children}
			</Primitive.Provider>
		</Context.Provider>
	);
}
export function Toaster({
	label = "Notifications ({hotkey})",
	closeLabel = "Dismiss notification",
	placement = "fixed",
}: {
	label?: string;
	closeLabel?: string;
	/** Fixed notifications use the theme portal; inline notifications render where Toaster is placed. */
	placement?: "fixed" | "inline";
}) {
	const { entries, dismiss } = useToast();
	const container = usePortalContainer();
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	useEffect(() => {
		if (!entries.length) {
			setHovered(false);
			setFocused(false);
		}
	}, [entries.length]);
	const [heights, setHeights] = useState<Record<number, number>>({});
	const measure = useCallback(
		(id: number, height: number) =>
			setHeights((current) => {
				if (height === 0) {
					const next = { ...current };
					delete next[id];
					return next;
				}
				return current[id] === height ? current : { ...current, [id]: height };
			}),
		[],
	);
	const expanded = hovered || focused;
	// Newest at the bottom, preserving chronological DOM and announcement order.
	const offsets = entries.map((_, index) =>
		entries.slice(index + 1).reduce((sum, entry) => sum + (heights[entry.id] ?? 88) + 10, 0),
	);
	const height = entries.length
		? expanded
			? entries.reduce((sum, entry) => sum + (heights[entry.id] ?? 88) + 10, -10)
			: (heights[entries.at(-1)!.id] ?? 88) + Math.min(entries.length - 1, 2) * 8
		: 0;
	if (!entries.length) return null;
	const toaster = (
		<div
			className="mds-toaster"
			data-expanded={expanded}
			data-placement={placement}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocusCapture={() => setFocused(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
			}}
			style={{ "--toast-height": `${height}px` } as CSSProperties}
		>
			{entries.map((entry, index) => (
				<ToastItem
					key={entry.id}
					entry={entry}
					dismiss={dismiss}
					measure={measure}
					closeLabel={closeLabel}
					expanded={expanded}
					depth={entries.length - 1 - index}
					offset={offsets[index]}
				/>
			))}
			<Primitive.Viewport className="mds-toast-viewport" label={label} />
		</div>
	);
	return placement === "inline" ? toaster : container ? createPortal(toaster, container) : null;
}
function ToastItem({
	entry,
	dismiss,
	measure,
	closeLabel,
	expanded,
	depth,
	offset,
}: {
	entry: Entry;
	dismiss: (id: number) => void;
	measure: (id: number, height: number) => void;
	closeLabel: string;
	expanded: boolean;
	depth: number;
	offset: number;
}) {
	const [element, setElement] = useState<HTMLLIElement | null>(null);
	useLayoutEffect(() => {
		if (!element) return;
		const observer = new ResizeObserver(() => measure(entry.id, element.offsetHeight));
		observer.observe(element);
		measure(entry.id, element.offsetHeight);
		return () => {
			observer.disconnect();
			measure(entry.id, 0);
		};
	}, [entry.id, measure, element]);
	return (
		<Primitive.Root
			ref={setElement}
			className="mds-toast"
			type="background"
			data-tone={entry.tone ?? "neutral"}
			data-covered={!expanded && depth > 0}
			duration={entry.duration}
			onOpenChange={(open) => {
				if (!open) dismiss(entry.id);
			}}
			style={
				{
					"--toast-offset": `${expanded ? offset : Math.min(depth, 2) * 8}px`,
					"--toast-scale": expanded ? 1 : 1 - Math.min(depth, 2) * 0.035,
					zIndex: 1000 - depth,
					opacity: !expanded && depth > 2 ? 0 : 1,
				} as CSSProperties
			}
		>
			<span className="mds-toast-symbol" aria-hidden="true">
				{entry.tone === "success" ? (
					<Check size={14} />
				) : entry.tone === "warning" || entry.tone === "danger" ? (
					<AlertCircle size={18} />
				) : (
					<Info size={18} />
				)}
			</span>
			<div className="mds-toast-copy">
				<Primitive.Title className="mds-toast-title">{entry.title}</Primitive.Title>
				{entry.description && (
					<Primitive.Description className="mds-toast-description">{entry.description}</Primitive.Description>
				)}
				{entry.action && (
					<Primitive.Action className="mds-toast-action" altText={entry.action.altText} onClick={entry.action.onClick}>
						{entry.action.label}
					</Primitive.Action>
				)}
			</div>
			<Primitive.Close className="mds-toast-close" aria-label={closeLabel}>
				<X size={14} />
			</Primitive.Close>
		</Primitive.Root>
	);
}
