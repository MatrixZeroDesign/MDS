import type { ComponentProps, ReactNode } from "react";
import * as A from "@radix-ui/react-avatar";
import * as P from "@radix-ui/react-progress";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Check } from "@matrixzero/icons";
import { cx, Button } from "./controls.js";
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
}: {
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	icon?: ReactNode;
}) {
	return (
		<div className="mds-empty">
			{icon && (
				<div className="mds-empty-icon" aria-hidden="true">
					{icon}
				</div>
			)}
			<h3>{title}</h3>
			{description && <p className="mds-description">{description}</p>}
			{action}
		</div>
	);
}
export const Tabs = TabsPrimitive.Root;
export const TabList = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) => (
	<TabsPrimitive.List {...props} className={cx("mds-tabs", className)} />
);
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
