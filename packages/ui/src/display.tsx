import { createContext, forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ComponentPropsWithoutRef, ComponentRef, CSSProperties, ReactNode } from "react";
import * as TabsPrimitive from "./primitives/tabs.js";
import * as AccordionPrimitive from "./primitives/accordion.js";
import { ChevronDown, ChevronLeft, ChevronRight, Check, Info, AlertCircle, X } from "@matrixzero/icons";
import { cx, Button, IconButton } from "./controls.js";
export function Badge({
	tone = "neutral",
	variant = "soft",
	className,
	...props
}: ComponentProps<"span"> & {
	tone?: "neutral" | "success" | "warning" | "danger";
	variant?: "soft" | "outline";
}) {
	return <span {...props} className={cx("mds-badge", className)} data-tone={tone} data-variant={variant} />;
}

export interface NotificationBadgeProps extends Omit<ComponentProps<"span">, "children"> {
	children: ReactNode;
	label: string;
	variant?: "dot" | "count";
	count?: number;
	max?: number;
	showZero?: boolean;
	invisible?: boolean;
	placement?: "top-start" | "top-end";
}

/** Places an unread dot or count on another component without changing its layout. */
export function NotificationBadge({
	children,
	label,
	variant = "dot",
	count = 0,
	max = 99,
	showZero = false,
	invisible = false,
	placement = "top-end",
	className,
	...props
}: NotificationBadgeProps) {
	const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
	const safeMax = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 99;
	const hidden = invisible || (variant === "count" && safeCount === 0 && !showZero);
	const displayCount = safeCount > safeMax ? `${safeMax}+` : String(safeCount);

	return (
		<span
			{...props}
			className={cx("mds-notification-badge", className)}
			data-placement={placement}
			data-variant={variant}
		>
			{children}
			{!hidden && (
				<>
					<span className="mds-notification-badge-indicator" aria-hidden="true">
						{variant === "count" ? displayCount : null}
					</span>
					<span className="mds-visually-hidden">{label}</span>
				</>
			)}
		</span>
	);
}
export function Avatar({
	src,
	alt,
	fallback,
	size = "md",
	className,
	...props
}: ComponentProps<"span"> & { src?: string; alt: string; fallback: string; size?: "sm" | "md" | "lg" }) {
	const [loaded, setLoaded] = useState(false);
	useEffect(() => setLoaded(false), [src]);
	return (
		<span {...props} className={cx("mds-avatar", className)} data-size={size}>
			{src && (
				<img
					className="mds-avatar-image"
					src={src}
					alt={alt}
					style={{ display: loaded ? undefined : "none" }}
					onLoad={() => setLoaded(true)}
					onError={() => setLoaded(false)}
				/>
			)}
			{!loaded && (
				<span className="mds-avatar-fallback" role="img" aria-label={alt}>
					{fallback}
				</span>
			)}
		</span>
	);
}
export interface AvatarGroupProps extends Omit<ComponentProps<"div">, "children"> {
	label: string;
	members: readonly { name: string; fallback: string; src?: string }[];
	max?: number;
	size?: "sm" | "md" | "lg";
	overflowLabel: (count: number) => string;
}
export function AvatarGroup({
	label,
	members,
	max = 4,
	size = "md",
	overflowLabel,
	className,
	...props
}: AvatarGroupProps) {
	const limit = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 4;
	const visible = members.slice(0, limit);
	const remaining = members.length - visible.length;
	return (
		<div {...props} role="group" aria-label={label} className={cx("mds-avatar-group", className)} data-size={size}>
			{visible.map((member, index) => (
				<Avatar key={index} alt={member.name} fallback={member.fallback} src={member.src} size={size} />
			))}
			{remaining > 0 && (
				<span
					className="mds-avatar mds-avatar-overflow"
					data-size={size}
					role="img"
					aria-label={overflowLabel(remaining)}
					title={members
						.slice(limit)
						.map((member) => member.name)
						.join(", ")}
				>
					+{remaining}
				</span>
			)}
		</div>
	);
}
export function Progress({
	className,
	value: rawValue,
	max: _max,
	...props
}: ComponentProps<"div"> & { value?: number | null; max?: number }) {
	const value = rawValue == null ? null : Math.max(0, Math.min(100, rawValue));
	return (
		<div
			{...props}
			role="progressbar"
			aria-valuemin={value === null ? undefined : 0}
			aria-valuemax={value === null ? undefined : 100}
			aria-valuenow={value ?? undefined}
			className={cx("mds-progress", className)}
		>
			<div className="mds-progress-indicator" style={{ width: value === null ? "35%" : `${value}%` }} />
		</div>
	);
}
export interface CircularProgressProps extends Omit<ComponentProps<"div">, "children"> {
	value?: number | null;
	size?: "xs" | "sm" | "md" | "lg" | number;
	strokeWidth?: number;
	showValue?: boolean;
	color?: string;
	trackColor?: string;
	state?: "loading" | "success" | "error";
}
export function CircularProgress({
	value,
	size = "md",
	strokeWidth = 4,
	showValue = false,
	color,
	trackColor,
	state = "loading",
	className,
	style,
	...props
}: CircularProgressProps) {
	const determinate = value != null;
	const normalized = determinate ? Math.max(0, Math.min(100, value)) : null;
	const dimension = typeof size === "number" ? size : undefined;
	return (
		<div
			{...props}
			role={state === "loading" ? "progressbar" : "status"}
			aria-valuemin={state === "loading" && determinate ? 0 : undefined}
			aria-valuemax={state === "loading" && determinate ? 100 : undefined}
			aria-valuenow={state === "loading" && determinate ? normalized! : undefined}
			className={cx("mds-circular-progress", className)}
			data-size={typeof size === "string" ? size : "custom"}
			data-state={state}
			data-indeterminate={state === "loading" && !determinate ? "" : undefined}
			style={{ width: dimension, height: dimension, color, ...style }}
		>
			<svg viewBox="0 0 48 48" aria-hidden="true">
				<circle
					className="mds-circular-progress-track"
					cx="24"
					cy="24"
					r="20"
					strokeWidth={strokeWidth}
					style={{ stroke: trackColor }}
				/>
				{state === "loading" && (
					<circle
						className="mds-circular-progress-indicator"
						cx="24"
						cy="24"
						r="20"
						strokeWidth={strokeWidth}
						pathLength="100"
						style={{ strokeDashoffset: normalized === null ? 72 : 100 - normalized }}
					/>
				)}
				{state === "success" && <path className="mds-circular-progress-status" d="m14 25 6 6 14-15" />}
				{state === "error" && <path className="mds-circular-progress-status" d="m17 17 14 14m0-14L17 31" />}
			</svg>
			{showValue && normalized !== null && state === "loading" && <span>{Math.round(normalized)}%</span>}
		</div>
	);
}
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
	return <div {...props} aria-hidden="true" className={cx("mds-skeleton", className)} />;
}
/** @deprecated Use Callout. Pass role="status" or role="alert" explicitly for live feedback. */
export function Alert(props: CalloutProps) {
	return <Callout {...props} />;
}
export function EmptyState({
	title,
	description,
	action,
	icon,
	thumbnail,
	thumbnailSize = "md",
}: {
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	icon?: ReactNode;
	/** Optional image, illustration or icon. Takes precedence over icon. */
	thumbnail?: ReactNode;
	thumbnailSize?: "sm" | "md" | "lg";
}) {
	return (
		<div className="mds-empty">
			{thumbnail != null ? (
				<div className="mds-empty-thumbnail" data-size={thumbnailSize}>
					{thumbnail}
				</div>
			) : icon ? (
				<div className="mds-empty-icon" aria-hidden="true">
					{icon}
				</div>
			) : null}
			<h3>{title}</h3>
			{description && <p className="mds-description">{description}</p>}
			{action}
		</div>
	);
}
export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;
export const Tabs = TabsPrimitive.Root;
type TabIndicator = { offset: number; size: number; visible: boolean };
type TabScrollState = { overflow: boolean; canScrollLeft: boolean; canScrollRight: boolean; vertical: boolean };
export interface TabListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
	/** Accessible label for the button that reveals tabs to the left. */
	scrollLeftLabel?: string;
	/** Accessible label for the button that reveals tabs to the right. */
	scrollRightLabel?: string;
}
export const TabList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabListProps>(function TabList(
	{ className, children, scrollLeftLabel = "Scroll tabs left", scrollRightLabel = "Scroll tabs right", ...props },
	forwardedRef,
) {
	const listRef = useRef<ComponentRef<typeof TabsPrimitive.List> | null>(null);
	const [indicator, setIndicator] = useState<TabIndicator>({ offset: 0, size: 0, visible: false });
	const [scrollState, setScrollState] = useState<TabScrollState>({
		overflow: false,
		canScrollLeft: false,
		canScrollRight: false,
		vertical: false,
	});
	useLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const reducedMotion = () =>
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			Number.parseFloat(getComputedStyle(list).getPropertyValue("--mds-duration-normal")) === 0;
		const update = () => {
			const vertical = list.dataset.orientation === "vertical";
			const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
			const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
			if (!active) {
				setIndicator((current) => (current.visible ? { ...current, visible: false } : current));
			} else {
				const next = {
					offset: vertical ? active.offsetTop : active.offsetLeft,
					size: vertical ? active.offsetHeight : active.offsetWidth,
					visible: true,
				};
				setIndicator((current) =>
					current.offset === next.offset && current.size === next.size && current.visible === next.visible
						? current
						: next,
				);
			}
			const listRect = list.getBoundingClientRect();
			const overflow = !vertical && list.scrollWidth > list.clientWidth + 1;
			const nextScrollState = {
				overflow,
				canScrollLeft: overflow && tabs.some((tab) => tab.getBoundingClientRect().left < listRect.left - 1),
				canScrollRight: overflow && tabs.some((tab) => tab.getBoundingClientRect().right > listRect.right + 1),
				vertical,
			};
			setScrollState((current) =>
				current.overflow === nextScrollState.overflow &&
				current.canScrollLeft === nextScrollState.canScrollLeft &&
				current.canScrollRight === nextScrollState.canScrollRight &&
				current.vertical === nextScrollState.vertical
					? current
					: nextScrollState,
			);
		};
		const revealActive = () => {
			const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
			if (!active) return;
			const listRect = list.getBoundingClientRect();
			const activeRect = active.getBoundingClientRect();
			const vertical = list.dataset.orientation === "vertical";
			const delta = vertical
				? activeRect.top < listRect.top
					? activeRect.top - listRect.top
					: activeRect.bottom > listRect.bottom
						? activeRect.bottom - listRect.bottom
						: 0
				: activeRect.left < listRect.left
					? activeRect.left - listRect.left
					: activeRect.right > listRect.right
						? activeRect.right - listRect.right
						: 0;
			if (delta) list.scrollBy({ [vertical ? "top" : "left"]: delta, behavior: reducedMotion() ? "auto" : "smooth" });
		};
		update();
		revealActive();
		const mutations = new MutationObserver((records) => {
			update();
			if (records.some((record) => record.type === "childList" || record.attributeName === "data-state"))
				revealActive();
		});
		mutations.observe(list, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ["data-state", "data-orientation"],
		});
		const resize = new ResizeObserver(update);
		resize.observe(list);
		list.querySelectorAll('[role="tab"]').forEach((tab) => resize.observe(tab));
		list.addEventListener("scroll", update, { passive: true });
		return () => {
			mutations.disconnect();
			resize.disconnect();
			list.removeEventListener("scroll", update);
		};
	}, [children]);
	const scrollByPage = (direction: -1 | 1) => {
		const list = listRef.current;
		if (!list) return;
		const reducedMotion =
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			Number.parseFloat(getComputedStyle(list).getPropertyValue("--mds-duration-normal")) === 0;
		list.scrollBy({
			left: direction * Math.max(120, list.clientWidth * 0.75),
			behavior: reducedMotion ? "auto" : "smooth",
		});
	};
	const indicatorStyle = {
		"--mds-tab-indicator-offset": `${indicator.offset}px`,
		"--mds-tab-indicator-size": `${indicator.size}px`,
	} as CSSProperties;
	return (
		<div
			className="mds-tabs-scroll-shell"
			data-can-scroll-left={scrollState.canScrollLeft ? "true" : undefined}
			data-can-scroll-right={scrollState.canScrollRight ? "true" : undefined}
			data-orientation={scrollState.vertical ? "vertical" : "horizontal"}
		>
			{scrollState.overflow && (
				<IconButton
					className="mds-tabs-scroll-button"
					disabled={!scrollState.canScrollLeft}
					icon={<ChevronLeft size={16} />}
					label={scrollLeftLabel}
					onClick={() => scrollByPage(-1)}
					size="sm"
					variant="ghost"
				/>
			)}
			<TabsPrimitive.List
				{...props}
				ref={(node) => {
					listRef.current = node;
					if (typeof forwardedRef === "function") forwardedRef(node);
					else if (forwardedRef) forwardedRef.current = node;
				}}
				className={cx("mds-tabs", className)}
			>
				{children}
				<span
					aria-hidden="true"
					className="mds-tab-indicator"
					data-visible={indicator.visible || undefined}
					style={indicatorStyle}
				/>
			</TabsPrimitive.List>
			{scrollState.overflow && (
				<IconButton
					className="mds-tabs-scroll-button"
					disabled={!scrollState.canScrollRight}
					icon={<ChevronRight size={16} />}
					label={scrollRightLabel}
					onClick={() => scrollByPage(1)}
					size="sm"
					variant="ghost"
				/>
			)}
		</div>
	);
});
export const Tab = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) => (
	<TabsPrimitive.Trigger {...props} className={cx("mds-tab", className)} />
);
export const TabPanel = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) => (
	<TabsPrimitive.Content {...props} className={cx("mds-tab-panel", className)} />
);
export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = ({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) => (
	<AccordionPrimitive.Item {...props} className={cx("mds-accordion-item", className)} />
);
export function AccordionTrigger({ children, className, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="mds-accordion-heading">
			<AccordionPrimitive.Trigger {...props} className={cx("mds-accordion-trigger", className)}>
				{children}
				<ChevronDown size={16} aria-hidden="true" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}
export const AccordionContent = ({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) => (
	<AccordionPrimitive.Content {...props} className={cx("mds-accordion-content", className)} />
);
export function Steps({
	steps,
	current,
	label,
}: {
	steps: readonly { id: string; label: ReactNode; description?: ReactNode }[];
	current: number;
	label: string;
}) {
	return (
		<ol className="mds-steps" aria-label={label}>
			{steps.map((s, i) => (
				<li key={s.id} aria-current={i === current ? "step" : undefined} data-complete={i < current || undefined}>
					<span className="mds-step-number" aria-hidden="true">
						{i < current ? <Check size={14} /> : i + 1}
					</span>
					<span>
						{s.label}
						{s.description && <span className="mds-description">{s.description}</span>}
					</span>
				</li>
			))}
		</ol>
	);
}
export function List({ className, ...props }: ComponentProps<"ul">) {
	return <ul {...props} className={cx("mds-list", className)} />;
}
export function ListItem({
	leading,
	trailing,
	children,
	...props
}: ComponentProps<"li"> & { leading?: ReactNode; trailing?: ReactNode }) {
	return (
		<li {...props} className={cx("mds-list-item", props.className)}>
			{leading !== undefined && <span className="mds-list-leading">{leading}</span>}
			<div className="mds-list-copy">{children}</div>
			{trailing !== undefined && <span className="mds-list-trailing">{trailing}</span>}
		</li>
	);
}

type SelectionListContextValue = {
	value: string;
	onValueChange: (value: string) => void;
	indicator: "none" | "bar" | "dot";
};
const SelectionListContext = createContext<SelectionListContextValue | null>(null);

export interface SelectionListProps extends Omit<ComponentProps<"div">, "onChange"> {
	label: string;
	value: string;
	onValueChange: (value: string) => void;
	/** Optional location marker for dense tools. Default none keeps selection quiet. */
	indicator?: "none" | "bar" | "dot";
}

/** Single-selection list for master-detail views. Use RadioGroup when the choice is form data. */
export function SelectionList({
	label,
	value,
	onValueChange,
	indicator = "none",
	className,
	...props
}: SelectionListProps) {
	return (
		<SelectionListContext.Provider value={{ value, onValueChange, indicator }}>
			<div {...props} role="listbox" aria-label={label} className={cx("mds-selection-list", className)} />
		</SelectionListContext.Provider>
	);
}

export interface SelectionListItemProps extends Omit<ComponentProps<"button">, "value"> {
	value: string;
	leading?: ReactNode;
	trailing?: ReactNode;
}

export function SelectionListItem({
	value,
	leading,
	trailing,
	children,
	className,
	onClick,
	onKeyDown,
	...props
}: SelectionListItemProps) {
	const context = useContext(SelectionListContext);
	if (!context) throw new Error("SelectionListItem must be used inside SelectionList");
	const selected = context.value === value;
	return (
		<button
			{...props}
			type={props.type ?? "button"}
			role="option"
			aria-selected={selected}
			data-selected={selected || undefined}
			data-indicator={context.indicator}
			tabIndex={selected ? 0 : -1}
			className={cx("mds-selection-list-item", className)}
			onClick={(event) => {
				context.onValueChange(value);
				onClick?.(event);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				const direction =
					event.key === "ArrowDown" || event.key === "ArrowRight"
						? 1
						: event.key === "ArrowUp" || event.key === "ArrowLeft"
							? -1
							: 0;
				const options = Array.from(
					event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='option']:not(:disabled)") ??
						[],
				);
				const current = options.indexOf(event.currentTarget);
				const next =
					event.key === "Home"
						? 0
						: event.key === "End"
							? options.length - 1
							: direction
								? (current + direction + options.length) % options.length
								: -1;
				if (next < 0) return;
				event.preventDefault();
				options[next]?.focus();
				options[next]?.click();
			}}
		>
			{leading && <span className="mds-selection-list-leading">{leading}</span>}
			<span className="mds-selection-list-copy">{children}</span>
			{trailing && <span className="mds-selection-list-trailing">{trailing}</span>}
			<span className="mds-selection-list-indicator" aria-hidden="true" />
		</button>
	);
}
export function Table({ className, ...props }: ComponentProps<"table">) {
	return (
		<div className="mds-table-scroll">
			<table {...props} className={cx("mds-table", className)} />
		</div>
	);
}
export function Pagination({
	page,
	pages,
	onPageChange,
	label,
	previousLabel,
	nextLabel,
}: {
	page: number;
	pages: number;
	onPageChange: (page: number) => void;
	label: string;
	previousLabel: string;
	nextLabel: string;
}) {
	return (
		<nav className="mds-pagination" aria-label={label}>
			<Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
				{previousLabel}
			</Button>
			<span aria-live="polite">
				{page} / {Math.max(1, pages)}
			</span>
			<Button disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
				{nextLabel}
			</Button>
		</nav>
	);
}

export interface CalloutProps extends Omit<ComponentProps<"div">, "title"> {
	tone?: "info" | "success" | "warning" | "danger" | "neutral";
	title?: ReactNode;
	icon?: ReactNode | false;
	action?: ReactNode;
}
/** Static by default. Opt into role="status" or role="alert" for dynamic announcements. */
export function Callout({ tone = "info", title, icon, action, children, className, ...props }: CalloutProps) {
	const DefaultIcon = tone === "success" ? Check : tone === "warning" || tone === "danger" ? AlertCircle : Info;
	return (
		<div role="note" {...props} data-tone={tone} className={cx("mds-alert", "mds-callout", className)}>
			{icon !== false && (
				<span className="mds-callout-icon" aria-hidden="true">
					{icon ?? <DefaultIcon size={18} />}
				</span>
			)}
			<div className="mds-callout-copy">
				{title && <strong className="mds-callout-title">{title}</strong>}
				{children && <div className="mds-callout-body">{children}</div>}
				{action && <div className="mds-callout-action">{action}</div>}
			</div>
		</div>
	);
}

export type BannerProps = Omit<ComponentProps<"div">, "title"> & {
	label: string;
	title?: ReactNode;
	tone?: "neutral" | "info" | "success" | "warning" | "danger";
	icon?: ReactNode | false;
	action?: ReactNode;
} & ({ onDismiss: () => void; dismissLabel: string } | { onDismiss?: never; dismissLabel?: never });
/** A page-level notice; the application controls visibility and persistence. */
export function Banner({
	label,
	title,
	tone = "info",
	icon,
	action,
	onDismiss,
	dismissLabel,
	children,
	className,
	...props
}: BannerProps) {
	const DefaultIcon = tone === "success" ? Check : tone === "warning" || tone === "danger" ? AlertCircle : Info;
	return (
		<div
			role="region"
			aria-label={label}
			{...props}
			data-tone={tone}
			className={cx("mds-alert", "mds-banner", className)}
		>
			{icon !== false && (
				<span className="mds-callout-icon" aria-hidden="true">
					{icon ?? <DefaultIcon size={18} />}
				</span>
			)}
			<div className="mds-banner-copy">
				{title && <strong>{title}</strong>}
				{children && <div>{children}</div>}
			</div>
			{action && <div className="mds-banner-action">{action}</div>}
			{onDismiss && (
				<IconButton variant="ghost" size="sm" label={dismissLabel} icon={<X size={16} />} onClick={onDismiss} />
			)}
		</div>
	);
}
