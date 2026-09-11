import { useDirection } from "@radix-ui/react-direction";
import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import * as A from "@radix-ui/react-avatar";
import * as P from "@radix-ui/react-progress";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Check, Info, AlertCircle, X } from "@matrixzero/icons";
import { cx, Button, IconButton } from "./controls.js";
export function Badge({
	tone = "neutral",
	className,
	...props
}: ComponentProps<"span"> & { tone?: "neutral" | "success" | "warning" | "danger" }) {
	return <span {...props} className={cx("mds-badge", className)} data-tone={tone} />;
}
export function Avatar({
	src,
	alt,
	fallback,
	size = "md",
	className,
	...props
}: ComponentProps<typeof A.Root> & { src?: string; alt: string; fallback: string; size?: "sm" | "md" | "lg" }) {
	return (
		<A.Root {...props} className={cx("mds-avatar", className)} data-size={size}>
			<A.Image className="mds-avatar-image" src={src} alt={alt} />
			<A.Fallback className="mds-avatar-fallback" role="img" aria-label={alt}>
				{fallback}
			</A.Fallback>
		</A.Root>
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
export function Progress({ className, ...props }: ComponentProps<typeof P.Root>) {
	const value = props.value == null ? null : Math.max(0, Math.min(100, props.value));
	return (
		<P.Root {...props} max={100} value={value} className={cx("mds-progress", className)}>
			<P.Indicator className="mds-progress-indicator" style={{ width: value === null ? "35%" : `${value}%` }} />
		</P.Root>
	);
}
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
	return <div {...props} aria-hidden="true" className={cx("mds-skeleton", className)} />;
}
export function Alert({
	tone = "info",
	className,
	...props
}: ComponentProps<"div"> & { tone?: "info" | "success" | "warning" | "danger" }) {
	return (
		<div
			role={tone === "danger" ? "alert" : "status"}
			{...props}
			className={cx("mds-alert", className)}
			data-tone={tone}
		/>
	);
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
export interface TabsProps extends ComponentProps<typeof TabsPrimitive.Root> {
	variant?: "default" | "segmented";
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
}
const TabsStyleContext = createContext({ variant: "default", size: "md", shape: "rounded", direction: "ltr" });
export function Tabs({ variant = "default", size = "md", shape = "rounded", ...props }: TabsProps) {
	const direction = useDirection(props.dir);
	return (
		<TabsStyleContext.Provider value={{ variant, size, shape, direction }}>
			<TabsPrimitive.Root {...props} />
		</TabsStyleContext.Provider>
	);
}
export function TabList({ className, children, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
	const style = useContext(TabsStyleContext);
	const anchor = useRef<HTMLSpanElement>(null);
	const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	useLayoutEffect(() => {
		const root = anchor.current?.parentElement;
		if (!root || style.variant !== "segmented") {
			setPosition(null);
			return;
		}
		const measure = () => {
			const selected = root.querySelector<HTMLElement>('.mds-tab[data-state="active"]');
			const next = selected
				? { x: selected.offsetLeft, y: selected.offsetTop, width: selected.offsetWidth, height: selected.offsetHeight }
				: null;
			setPosition((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
		};
		const resize = new ResizeObserver(measure);
		resize.observe(root);
		root.querySelectorAll(".mds-tab").forEach((item) => resize.observe(item));
		const mutation = new MutationObserver(measure);
		mutation.observe(root, {
			subtree: true,
			attributes: true,
			attributeFilter: ["data-state", "dir"],
			childList: true,
		});
		measure();
		return () => {
			resize.disconnect();
			mutation.disconnect();
		};
	}, [style.variant, style.size, style.shape, style.direction, children]);
	return (
		<TabsPrimitive.List
			{...props}
			className={cx("mds-tabs", className)}
			data-variant={style.variant}
			data-size={style.size}
			data-shape={style.shape}
		>
			<span ref={anchor} hidden aria-hidden="true" />
			{position && (
				<span
					aria-hidden="true"
					className="mds-segment-indicator"
					style={{
						width: position.width,
						height: position.height,
						transform: `translate(${position.x}px, ${position.y}px)`,
					}}
				/>
			)}
			{children}
		</TabsPrimitive.List>
	);
}
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
			{leading}
			<div className="mds-list-copy">{children}</div>
			{trailing}
		</li>
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
/** Persistent explanatory content; use Alert for live status announcements. */
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
