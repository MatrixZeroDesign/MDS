import { Popover, PopoverTrigger, PopoverContent } from "./popover.js";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cx } from "./controls.js";
import { SideSheet, SideSheetTrigger, SideSheetContent, SideSheetClose, Tooltip, TooltipProvider } from "./overlays.js";

export interface NavbarProps extends ComponentProps<"header"> {
	/** Remain at the top of the nearest scroll container. */
	sticky?: boolean;
	/** Top offset in CSS pixels, for a banner or another bar above. */
	stickyOffset?: number;
	/** Hide scrolling down and reveal scrolling up. Implies sticky. */
	hideOnScroll?: boolean;
}
export function Navbar({
	className,
	sticky = false,
	stickyOffset = 0,
	hideOnScroll = false,
	style,
	onFocusCapture,
	...props
}: NavbarProps) {
	const root = useRef<HTMLElement>(null);
	const [hidden, setHidden] = useState(false);
	useEffect(() => {
		setHidden(false);
		if (!hideOnScroll || !root.current) return;
		const element = root.current;
		let parent = element.parentElement;
		while (parent && !/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement;
		const target: HTMLElement | Window = parent ?? window;
		const position = () => Math.max(0, parent ? parent.scrollTop : window.scrollY);
		let previous = position(),
			distance = 0,
			direction = 0;
		const update = () => {
			const current = position(),
				delta = current - previous;
			previous = current;
			if (current <= Math.max(0, stickyOffset) + element.offsetHeight || element.contains(document.activeElement)) {
				setHidden(false);
				distance = 0;
				return;
			}
			const nextDirection = Math.sign(delta);
			if (!nextDirection) return;
			distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
			direction = nextDirection;
			if (distance >= 12) {
				setHidden(direction > 0);
				distance = 0;
			}
		};
		target.addEventListener("scroll", update, { passive: true });
		return () => target.removeEventListener("scroll", update);
	}, [hideOnScroll, stickyOffset]);
	return (
		<header
			{...props}
			ref={root}
			data-sticky={sticky || hideOnScroll || undefined}
			data-scroll-hidden={(hideOnScroll && hidden) || undefined}
			onFocusCapture={(event) => {
				setHidden(false);
				onFocusCapture?.(event);
			}}
			className={cx("mds-navbar", className)}
			style={{ ...(sticky || hideOnScroll ? { top: stickyOffset } : {}), ...style }}
		/>
	);
}
const RailContext = createContext<boolean | null>(null);
export interface NavRailProps extends ComponentProps<"nav"> {
	/** Show labels beneath icons. False keeps accessible names and tooltips. */
	showLabels?: boolean;
	/** @deprecated Use showLabels={false}. */
	collapsed?: boolean;
	label: string;
}
export function NavRail({ collapsed = false, showLabels, label, className, children, ...props }: NavRailProps) {
	const iconOnly = showLabels === undefined ? collapsed : !showLabels;
	return (
		<RailContext.Provider value={iconOnly}>
			<nav
				{...props}
				aria-label={label}
				data-collapsed={iconOnly || undefined}
				className={cx("mds-navrail", className)}
			>
				<TooltipProvider>{children}</TooltipProvider>
			</nav>
		</RailContext.Provider>
	);
}
export interface NavItemProps extends ComponentProps<"button"> {
	active?: boolean;
	icon?: ReactNode;
	/** Optional concise rail label; children remains the full accessible name and tooltip. */
	shortLabel?: string;
}
export function NavItem({ active, icon, shortLabel, children, className, type = "button", ...props }: NavItemProps) {
	const collapsed = useContext(RailContext);
	const item = (
		<button
			{...props}
			type={type}
			aria-label={
				props["aria-label"] ?? (collapsed !== null && shortLabel && typeof children === "string" ? children : undefined)
			}
			aria-current={active ? "page" : undefined}
			title={collapsed && typeof children === "string" ? children : props.title}
			className={cx("mds-navitem", className)}
		>
			{icon && (
				<span className="mds-navitem-icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<span className="mds-navitem-label">{collapsed !== null ? (shortLabel ?? children) : children}</span>
		</button>
	);
	return collapsed !== null ? <Tooltip content={children}>{item}</Tooltip> : item;
}
export interface NavLinkProps extends ComponentProps<"a"> {
	active?: boolean;
	icon?: ReactNode;
	/** Optional concise rail label; children remains the full accessible name and tooltip. */
	shortLabel?: string;
}
export function NavLink({ active, icon, shortLabel, children, className, ...props }: NavLinkProps) {
	const rail = useContext(RailContext);
	const item = (
		<a
			{...props}
			aria-label={
				props["aria-label"] ?? (rail !== null && shortLabel && typeof children === "string" ? children : undefined)
			}
			aria-current={active ? "page" : undefined}
			className={cx("mds-navitem", className)}
		>
			{icon && (
				<span className="mds-navitem-icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<span className="mds-navitem-label">{rail !== null ? (shortLabel ?? children) : children}</span>
		</a>
	);
	return rail !== null ? <Tooltip content={children}>{item}</Tooltip> : item;
}

const DrawerContext = createContext<"standard" | "modal" | "rail">("modal");
export interface NavDrawerProps extends ComponentProps<typeof SideSheet> {
	variant?: "standard" | "modal" | "rail";
}
export function NavDrawer({ variant = "modal", children, ...props }: NavDrawerProps) {
	return (
		<DrawerContext.Provider value={variant}>
			{variant === "modal" ? <SideSheet {...props}>{children}</SideSheet> : children}
		</DrawerContext.Provider>
	);
}
export function NavDrawerTrigger(props: ComponentProps<typeof SideSheetTrigger>) {
	const variant = useContext(DrawerContext);
	return variant === "modal" ? <SideSheetTrigger {...props} /> : null;
}
export function NavDrawerClose(props: ComponentProps<typeof SideSheetClose>) {
	const variant = useContext(DrawerContext);
	return variant === "modal" ? <SideSheetClose {...props} /> : <>{props.children}</>;
}
export function NavDrawerPanel({ label, className, ...props }: ComponentProps<"nav"> & { label: string }) {
	return <nav {...props} aria-label={label} className={cx("mds-navdrawer-panel", className)} />;
}

export function NavDrawerContent({
	children,
	navigationLabel,
	...props
}: ComponentProps<typeof SideSheetContent> & { navigationLabel: string }) {
	const variant = useContext(DrawerContext);
	if (variant === "rail")
		return (
			<NavRail collapsed label={navigationLabel} className={cx("mds-navdrawer-rail", props.className)}>
				{children}
			</NavRail>
		);
	if (variant === "standard")
		return (
			<NavDrawerPanel label={navigationLabel} className={props.className}>
				{props.title && <div className="mds-navdrawer-title">{props.title}</div>}
				{children}
			</NavDrawerPanel>
		);
	return (
		<SideSheetContent {...props} side="start">
			<NavDrawerPanel label={navigationLabel}>{children}</NavDrawerPanel>
		</SideSheetContent>
	);
}
export function Collapse({ className, ...props }: ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root {...props} className={cx("mds-collapse", className)} />;
}
export function CollapseTrigger({ className, ...props }: ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
	return <CollapsiblePrimitive.Trigger {...props} className={cx("mds-collapse-trigger", className)} />;
}
export function CollapseContent({ className, ...props }: ComponentProps<typeof CollapsiblePrimitive.Content>) {
	return <CollapsiblePrimitive.Content {...props} className={cx("mds-collapse-content", className)} />;
}

export interface NavGroupProps extends Omit<ComponentProps<typeof CollapsiblePrimitive.Root>, "title"> {
	label: string;
	icon?: ReactNode;
	/** Marks a group containing the current destination, without marking the trigger as a page. */
	active?: boolean;
}
/** Expandable drawer section. Use NavItem or NavLink for its child destinations. */
export function NavGroup({ label, icon, active, children, className, ...props }: NavGroupProps) {
	const rail = useContext(RailContext);
	if (rail !== null)
		return (
			<RailNavGroup label={label} icon={icon} active={active} className={className} {...props}>
				{children}
			</RailNavGroup>
		);
	return (
		<CollapsiblePrimitive.Root {...props} className={cx("mds-navgroup", className)} data-active={active || undefined}>
			<CollapsiblePrimitive.Trigger className="mds-navitem mds-navgroup-trigger">
				{icon && (
					<span className="mds-navitem-icon" aria-hidden="true">
						{icon}
					</span>
				)}
				<span className="mds-navitem-label">{label}</span>
				<svg
					className="mds-navgroup-chevron"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.75"
					aria-hidden="true"
				>
					<path d="m9 5 7 7-7 7" />
				</svg>
			</CollapsiblePrimitive.Trigger>
			<CollapsiblePrimitive.Content className="mds-navgroup-content">
				<div className="mds-navgroup-items" role="group" aria-label={label}>
					{children}
				</div>
			</CollapsiblePrimitive.Content>
		</CollapsiblePrimitive.Root>
	);
}

function RailNavGroup({
	label,
	icon,
	active,
	children,
	className,
	open,
	onOpenChange,
	disabled,
	defaultOpen: _defaultOpen,
	...props
}: NavGroupProps) {
	const [localOpen, setLocalOpen] = useState(false);
	const visible = open ?? localOpen;
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const hover = useRef(false);
	const content = useRef<HTMLDivElement>(null);
	const cancel = () => {
		clearTimeout(timer.current);
	};
	useEffect(() => () => clearTimeout(timer.current), []);
	const change = (value: boolean) => {
		cancel();
		setLocalOpen(value);
		onOpenChange?.(value);
	};
	const enter = (event: React.PointerEvent) => {
		cancel();
		if (event.pointerType !== "mouse" || disabled || visible) return;
		timer.current = setTimeout(() => {
			hover.current = true;
			change(true);
		}, 180);
	};
	const leave = (event: React.PointerEvent) => {
		cancel();
		if (event.pointerType !== "mouse") return;
		timer.current = setTimeout(() => {
			if (!content.current?.contains(document.activeElement)) change(false);
		}, 250);
	};
	return (
		<div {...props} className={cx("mds-navgroup", className)} data-active={active || undefined}>
			<Popover
				open={visible}
				onOpenChange={(value) => {
					hover.current = false;
					change(value);
				}}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						disabled={disabled}
						aria-label={label}
						className="mds-navitem mds-navgroup-trigger"
						data-group-active={active || undefined}
						onPointerEnter={enter}
						onPointerLeave={leave}
						onPointerDown={() => {
							hover.current = false;
							cancel();
						}}
					>
						{icon && (
							<span className="mds-navitem-icon" aria-hidden="true">
								{icon}
							</span>
						)}
						<span className="mds-navitem-label">{label}</span>
					</button>
				</PopoverTrigger>
				<PopoverContent
					ref={content}
					title={label}
					side="end"
					align="start"
					className="mds-navgroup-popover"
					onPointerEnter={cancel}
					onPointerLeave={leave}
					onOpenAutoFocus={(event) => {
						if (hover.current) event.preventDefault();
					}}
					onCloseAutoFocus={(event) => {
						if (hover.current) event.preventDefault();
					}}
					onEscapeKeyDown={() => {
						hover.current = false;
					}}
					onClick={(event) => {
						const target = (event.target as HTMLElement).closest(".mds-navitem");
						if (target && !target.hasAttribute("disabled")) change(false);
					}}
				>
					<RailContext.Provider value={null}>
						<div className="mds-navgroup-popup-items">{children}</div>
					</RailContext.Provider>
				</PopoverContent>
			</Popover>
		</div>
	);
}
