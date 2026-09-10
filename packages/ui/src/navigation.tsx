import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cx } from "./controls.js";
import { SideSheet, SideSheetTrigger, SideSheetContent, SideSheetClose } from "./overlays.js";

export function Navbar({ className, ...props }: ComponentProps<"header">) {
	return <header {...props} className={cx("mds-navbar", className)} />;
}
const RailContext = createContext(false);
export interface NavRailProps extends ComponentProps<"nav"> {
	collapsed?: boolean;
	label: string;
}
export function NavRail({ collapsed = false, label, className, children, ...props }: NavRailProps) {
	return (
		<RailContext.Provider value={collapsed}>
			<nav
				{...props}
				aria-label={label}
				data-collapsed={collapsed || undefined}
				className={cx("mds-navrail", className)}
			>
				{children}
			</nav>
		</RailContext.Provider>
	);
}
export interface NavItemProps extends ComponentProps<"button"> {
	active?: boolean;
	icon?: ReactNode;
}
export function NavItem({ active, icon, children, className, type = "button", ...props }: NavItemProps) {
	const collapsed = useContext(RailContext);
	return (
		<button
			{...props}
			type={type}
			aria-current={active ? "page" : undefined}
			title={collapsed && typeof children === "string" ? children : props.title}
			className={cx("mds-navitem", className)}
		>
			{icon && (
				<span className="mds-navitem-icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<span className="mds-navitem-label">{children}</span>
		</button>
	);
}
export interface NavLinkProps extends ComponentProps<"a"> {
	active?: boolean;
	icon?: ReactNode;
}
export function NavLink({ active, icon, children, className, ...props }: NavLinkProps) {
	return (
		<a {...props} aria-current={active ? "page" : undefined} className={cx("mds-navitem", className)}>
			{icon && (
				<span className="mds-navitem-icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<span className="mds-navitem-label">{children}</span>
		</a>
	);
}
export const NavDrawer = SideSheet;
export const NavDrawerTrigger = SideSheetTrigger;
export const NavDrawerClose = SideSheetClose;
export function NavDrawerContent({
	children,
	navigationLabel,
	...props
}: ComponentProps<typeof SideSheetContent> & { navigationLabel: string }) {
	return (
		<SideSheetContent {...props} side="left">
			<NavRail label={navigationLabel}>{children}</NavRail>
		</SideSheetContent>
	);
}
export const Collapse = CollapsiblePrimitive.Root;
export const CollapseTrigger = CollapsiblePrimitive.Trigger;
export function CollapseContent({ className, ...props }: ComponentProps<typeof CollapsiblePrimitive.Content>) {
	return <CollapsiblePrimitive.Content {...props} className={cx("mds-collapse-content", className)} />;
}
