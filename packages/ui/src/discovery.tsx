import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type ComponentProps } from "react";
import { Dialog, DialogContent } from "./overlays.js";
import { Input, cx } from "./controls.js";
export interface SpotlightItem {
	id: string;
	label: string;
	description?: string;
	keywords?: string;
	icon?: ReactNode;
	disabled?: boolean;
	onSelect: () => void;
}
export interface SpotlightProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	searchLabel: string;
	placeholder?: string;
	emptyLabel: string;
	closeLabel: string;
	items: readonly SpotlightItem[];
}
export function Spotlight({
	open,
	onOpenChange,
	title,
	searchLabel,
	placeholder,
	emptyLabel,
	closeLabel,
	items,
}: SpotlightProps) {
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const id = useId();
	const list = useRef<HTMLDivElement>(null);
	const matches = items.filter((item) =>
		(item.label + " " + (item.description ?? "") + " " + (item.keywords ?? ""))
			.toLocaleLowerCase()
			.includes(query.trim().toLocaleLowerCase()),
	);
	const enabled = matches.filter((item) => !item.disabled);
	const selected = enabled[Math.min(active, Math.max(0, enabled.length - 1))];
	useEffect(() => {
		if (open) {
			setQuery("");
			setActive(0);
		}
	}, [open]);
	useEffect(() => {
		list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
	}, [active, query]);
	const choose = (item: SpotlightItem) => {
		if (item.disabled) return;
		onOpenChange(false);
		item.onSelect();
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent title={title} closeLabel={closeLabel} className="mds-spotlight">
				<Input
					role="combobox"
					aria-label={searchLabel}
					placeholder={placeholder}
					value={query}
					aria-expanded={true}
					aria-controls={id}
					aria-autocomplete="list"
					aria-activedescendant={selected ? id + "-" + encodeURIComponent(selected.id) : undefined}
					onChange={(event) => {
						setQuery(event.target.value);
						setActive(0);
					}}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							setActive((index) =>
								enabled.length ? (index + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length : 0,
							);
						}
						if (event.key === "Enter" && selected) {
							event.preventDefault();
							choose(selected);
						}
					}}
				/>
				<div ref={list} id={id} role="listbox" aria-label={searchLabel} className="mds-spotlight-results">
					{matches.map((item) => (
						<div
							key={item.id}
							id={id + "-" + encodeURIComponent(item.id)}
							role="option"
							aria-disabled={item.disabled || undefined}
							aria-selected={item === selected}
							className="mds-spotlight-option"
							onPointerMove={() => {
								const index = enabled.indexOf(item);
								if (index >= 0) setActive(index);
							}}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => choose(item)}
						>
							{item.icon && <span aria-hidden="true">{item.icon}</span>}
							<span>
								<strong>{item.label}</strong>
								{item.description && <small>{item.description}</small>}
							</span>
						</div>
					))}
				</div>
				{!matches.length && <p role="status">{emptyLabel}</p>}
			</DialogContent>
		</Dialog>
	);
}
export interface AnchorItem {
	id: string;
	label: string;
	children?: readonly AnchorItem[];
}
export interface AnchorProps extends Omit<ComponentProps<"nav">, "children"> {
	label: string;
	items: readonly AnchorItem[];
	offset?: number;
	smooth?: boolean;
}
export function Anchor({ label, items, offset = 80, smooth = true, className, ...props }: AnchorProps) {
	const [active, setActive] = useState("");
	const programmaticTarget = useRef("");
	const releaseTargetTimer = useRef<number | undefined>(undefined);
	const updateActive = useCallback(() => {
		if (programmaticTarget.current) {
			setActive(programmaticTarget.current);
			return;
		}
		const flatten = (list: readonly AnchorItem[]): AnchorItem[] =>
			list.flatMap((item) => [item, ...flatten(item.children ?? [])]);
		const flat = flatten(items);
		let current = flat[0]?.id ?? "";
		for (const item of flat) {
			const element = document.getElementById(item.id);
			if (element && element.getBoundingClientRect().top <= offset + 1) current = item.id;
		}
		setActive(current);
	}, [items, offset]);
	useEffect(() => {
		const finishProgrammaticScroll = () => {
			if (!programmaticTarget.current) return;
			programmaticTarget.current = "";
			window.clearTimeout(releaseTargetTimer.current);
			updateActive();
		};
		updateActive();
		window.addEventListener("scroll", updateActive, { passive: true });
		window.addEventListener("scrollend", finishProgrammaticScroll);
		window.addEventListener("resize", updateActive);
		return () => {
			window.removeEventListener("scroll", updateActive);
			window.removeEventListener("scrollend", finishProgrammaticScroll);
			window.removeEventListener("resize", updateActive);
			window.clearTimeout(releaseTargetTimer.current);
		};
	}, [updateActive]);
	const renderItems = (list: readonly AnchorItem[], depth = 0): ReactNode => (
		<ul className="mds-anchor-list">
			{list.map((item) => (
				<li key={item.id}>
					<a
						href={"#" + encodeURIComponent(item.id)}
						style={{ "--mds-anchor-depth": depth } as React.CSSProperties}
						aria-current={active === item.id ? "location" : undefined}
						onClick={(event) => {
							if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
							const target = document.getElementById(item.id);
							if (!target) return;
							event.preventDefault();
							const shouldSmooth = smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
							if (shouldSmooth) {
								programmaticTarget.current = item.id;
								window.clearTimeout(releaseTargetTimer.current);
								releaseTargetTimer.current = window.setTimeout(() => {
									programmaticTarget.current = "";
									updateActive();
								}, 1200);
							}
							window.scrollTo({
								top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset),
								behavior: shouldSmooth ? "smooth" : "instant",
							});
							history.replaceState(null, "", "#" + encodeURIComponent(item.id));
							if (!target.hasAttribute("tabindex")) {
								target.setAttribute("tabindex", "-1");
								target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
							}
							target.focus({ preventScroll: true });
							setActive(item.id);
						}}
					>
						{item.label}
					</a>
					{item.children?.length ? renderItems(item.children, depth + 1) : null}
				</li>
			))}
		</ul>
	);
	return (
		<nav {...props} aria-label={label} className={cx("mds-anchor", className)}>
			{renderItems(items)}
		</nav>
	);
}
export interface FeatureHighlightProps extends ComponentProps<"span"> {
	effect?: "theme" | "spectrum";
	active?: boolean;
	/** Number of gentle sweeps; use "infinite" only for ongoing discovery. */
	iterations?: number | "infinite";
}
export function FeatureHighlight({
	active = true,
	iterations = 3,
	effect = "theme",
	className,
	style,
	children,
	...props
}: FeatureHighlightProps) {
	return (
		<span
			{...props}
			className={cx("mds-feature-highlight", className)}
			data-effect={effect}
			data-active={active || undefined}
			style={{ ...style, "--mds-highlight-iterations": iterations } as React.CSSProperties}
		>
			{children}
		</span>
	);
}
