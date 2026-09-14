import type { ComponentProps } from "react";
import { useDirection } from "@radix-ui/react-direction";
import * as Navigation from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "@matrixzero/icons";
import { cx } from "./controls.js";

export interface MegaMenuProps extends ComponentProps<typeof Navigation.Root> {
	label: string;
}
/** Multi-column site navigation. value/onValueChange optionally control the open item. */
export function MegaMenu({ label, className, children, delayDuration = 180, ...props }: MegaMenuProps) {
	const direction = useDirection();
	return (
		<Navigation.Root
			{...props}
			dir={props.dir ?? direction}
			aria-label={label}
			delayDuration={delayDuration}
			className={cx("mds-mega-menu", className)}
		>
			{children}
			<div className="mds-mega-menu-position">
				<Navigation.Viewport className="mds-mega-menu-viewport" />
			</div>
		</Navigation.Root>
	);
}
export function MegaMenuList({ className, ...props }: ComponentProps<typeof Navigation.List>) {
	return <Navigation.List {...props} className={cx("mds-mega-menu-list", className)} />;
}
export const MegaMenuItem = Navigation.Item;
export function MegaMenuTrigger({ className, children, ...props }: ComponentProps<typeof Navigation.Trigger>) {
	return (
		<Navigation.Trigger {...props} className={cx("mds-mega-menu-trigger", className)}>
			{children}
			<ChevronDown size={14} aria-hidden="true" />
		</Navigation.Trigger>
	);
}
export interface MegaMenuContentProps extends ComponentProps<typeof Navigation.Content> {
	columns?: 1 | 2 | 3 | 4;
}
export function MegaMenuContent({ className, columns = 3, ...props }: MegaMenuContentProps) {
	return <Navigation.Content {...props} className={cx("mds-mega-menu-content", className)} data-columns={columns} />;
}
export function MegaMenuGroup({
	title,
	className,
	children,
	...props
}: Omit<ComponentProps<"section">, "title"> & { title: string }) {
	return (
		<section {...props} className={cx("mds-mega-menu-group", className)}>
			<h3>{title}</h3>
			{children}
		</section>
	);
}
export interface MegaMenuLinkProps extends ComponentProps<typeof Navigation.Link> {
	description?: string;
}
export function MegaMenuLink({ className, children, description, asChild, ...props }: MegaMenuLinkProps) {
	return (
		<Navigation.Link {...props} asChild={asChild} className={cx("mds-mega-menu-link", className)}>
			{asChild ? (
				children
			) : (
				<>
					<span className="mds-mega-menu-link-title">{children}</span>
					{description && <span className="mds-mega-menu-link-description">{description}</span>}
				</>
			)}
		</Navigation.Link>
	);
}
