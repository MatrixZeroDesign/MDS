import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type ComponentProps,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "@matrixzero/icons";
import { cx } from "./controls.js";
import { useDirection } from "./primitives/direction.js";
import { useControllableState } from "./primitives/state.js";
import { Slot } from "./primitives/slot.js";

interface MenuContextValue {
	value: string;
	setValue: (value: string) => void;
	viewport: React.MutableRefObject<HTMLDivElement | null>;
	delay: number;
}
const MenuContext = createContext<MenuContextValue | null>(null);
const ItemContext = createContext("");

export interface MegaMenuProps extends Omit<ComponentProps<"nav">, "defaultValue" | "onChange"> {
	label: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	delayDuration?: number;
}
/** Multi-column site navigation. value/onValueChange optionally control the open item. */
export function MegaMenu({
	label,
	className,
	children,
	value,
	defaultValue = "",
	onValueChange,
	delayDuration = 180,
	dir,
	...props
}: MegaMenuProps) {
	const inheritedDirection = useDirection();
	const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
	const viewport = useRef<HTMLDivElement | null>(null);
	const root = useRef<HTMLElement | null>(null);
	useEffect(() => {
		if (!current) return;
		const close = (event: PointerEvent) => {
			if (!root.current?.contains(event.target as Node)) setCurrent("");
		};
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, [current, setCurrent]);
	return (
		<MenuContext.Provider value={{ value: current, setValue: setCurrent, viewport, delay: delayDuration }}>
			<nav
				{...props}
				ref={root}
				dir={dir ?? inheritedDirection}
				aria-label={label}
				className={cx("mds-mega-menu", className)}
				onKeyDown={(event) => {
					props.onKeyDown?.(event);
					if (!event.defaultPrevented && event.key === "Escape" && current) {
						event.preventDefault();
						setCurrent("");
						(root.current?.querySelector(`[data-mega-value="${CSS.escape(current)}"]`) as HTMLElement | null)?.focus();
					}
				}}
			>
				{children}
				<div className="mds-mega-menu-position">
					<div ref={viewport} className="mds-mega-menu-viewport" hidden={!current} />
				</div>
			</nav>
		</MenuContext.Provider>
	);
}
export function MegaMenuList({ className, ...props }: ComponentProps<"ul">) {
	return <ul {...props} className={cx("mds-mega-menu-list", className)} />;
}
export interface MegaMenuItemProps extends ComponentProps<"li"> {
	value: string;
}
export function MegaMenuItem({ value, ...props }: MegaMenuItemProps) {
	return (
		<ItemContext.Provider value={value}>
			<li {...props} />
		</ItemContext.Provider>
	);
}
export const MegaMenuTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
	function MegaMenuTrigger({ className, children, onClick, onPointerMove, onPointerLeave, ...props }, ref) {
		const menu = useContext(MenuContext);
		const value = useContext(ItemContext);
		const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
		if (!menu) throw new Error("MegaMenuTrigger requires MegaMenu");
		const open = menu.value === value;
		return (
			<button
				{...props}
				ref={ref}
				type="button"
				className={cx("mds-mega-menu-trigger", className)}
				data-state={open ? "open" : "closed"}
				data-mega-value={value}
				aria-expanded={open}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented) menu.setValue(open ? "" : value);
				}}
				onPointerMove={(event) => {
					onPointerMove?.(event);
					if (!event.defaultPrevented && event.pointerType !== "touch" && !open) {
						if (timer.current) clearTimeout(timer.current);
						timer.current = setTimeout(() => menu.setValue(value), menu.delay);
					}
				}}
				onPointerLeave={(event) => {
					onPointerLeave?.(event);
					if (timer.current) clearTimeout(timer.current);
				}}
			>
				{children}
				<ChevronDown size={14} aria-hidden="true" />
			</button>
		);
	},
);
export interface MegaMenuContentProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 1 | 2 | 3 | 4;
}
export function MegaMenuContent({ className, columns = 3, ...props }: MegaMenuContentProps) {
	const menu = useContext(MenuContext);
	const value = useContext(ItemContext);
	if (!menu?.viewport.current || menu.value !== value) return null;
	return createPortal(
		<div {...props} className={cx("mds-mega-menu-content", className)} data-columns={columns} />,
		menu.viewport.current,
	);
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
export interface MegaMenuLinkProps extends ComponentProps<"a"> {
	description?: string;
	asChild?: boolean;
	active?: boolean;
}
export const MegaMenuLink = forwardRef<HTMLAnchorElement, MegaMenuLinkProps>(function MegaMenuLink(
	{ className, children, description, asChild, active, ...props },
	ref,
) {
	const shared = {
		...props,
		ref,
		className: cx("mds-mega-menu-link", className),
		"data-active": active ? "" : undefined,
	};
	if (asChild) return <Slot {...shared}>{children}</Slot>;
	return (
		<a {...shared}>
			<span className="mds-mega-menu-link-title">{children}</span>
			{description && <span className="mds-mega-menu-link-description">{description}</span>}
		</a>
	);
});
