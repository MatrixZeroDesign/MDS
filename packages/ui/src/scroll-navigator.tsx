import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDirection } from "@radix-ui/react-direction";
import { cx } from "./controls.js";
import { usePortalContainer } from "./theme.js";

export interface ScrollNavigatorItem {
	/** ID of the corresponding content element. Must be unique on the page. */
	id: string;
	label: string;
	/** Non-interactive preview content. */
	description?: ReactNode;
}
export interface ScrollNavigatorProps {
	items: readonly ScrollNavigatorItem[];
	label: string;
	/** Defaults to the document viewport. */
	scrollContainer?: HTMLElement | null;
	/** Distance from the scrolling viewport's top used for tracking and navigation. */
	offset?: number;
	activeId?: string;
	onActiveChange?: (id: string) => void;
	className?: string;
	style?: CSSProperties;
}
/** Compact content minimap with accessible section navigation and preview tooltips. */
export function ScrollNavigator({
	items,
	label,
	scrollContainer,
	offset = 24,
	activeId,
	onActiveChange,
	className,
	style,
}: ScrollNavigatorProps) {
	const [tracked, setTracked] = useState(items[0]?.id ?? "");
	const [hovered, setHovered] = useState(-1);
	const [focusIndex, setFocusIndex] = useState(0);
	const nav = useRef<HTMLElement>(null);
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);
	const portal = usePortalContainer();
	const direction = useDirection();
	const current = activeId ?? tracked;
	const callback = useRef(onActiveChange);
	const previousId = useRef(tracked);
	callback.current = onActiveChange;
	const ids = items.map((item) => item.id).join("\u0000");
	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const top = (scrollContainer?.getBoundingClientRect().top ?? 0) + offset + 1;
			const targets = ids
				.split("\u0000")
				.map((id) => document.getElementById(id))
				.filter((element): element is HTMLElement =>
					Boolean(element && (!scrollContainer || scrollContainer.contains(element))),
				);
			let selected = targets[0]?.id ?? "";
			for (const target of targets) if (target.getBoundingClientRect().top <= top) selected = target.id;
			const viewport = scrollContainer ?? document.documentElement;
			const scrollTop = scrollContainer?.scrollTop ?? window.scrollY;
			if (scrollTop > 0 && scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2)
				selected = targets.at(-1)?.id ?? selected;
			if (selected !== previousId.current) {
				previousId.current = selected;
				setTracked(selected);
				callback.current?.(selected);
			}
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		const source = scrollContainer ?? window;
		source.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		const observer = new ResizeObserver(schedule);
		observer.observe(scrollContainer ?? document.documentElement);
		for (const id of ids.split("\u0000")) {
			const target = document.getElementById(id);
			if (target) observer.observe(target);
		}
		update();
		return () => {
			source.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [ids, offset, scrollContainer]);
	useEffect(() => {
		const index = items.findIndex((item) => item.id === current);
		const button = buttons.current[index];
		if (button && nav.current) {
			const root = nav.current;
			const top = button.offsetTop;
			if (top < root.scrollTop) root.scrollTop = top;
			else if (top + button.offsetHeight > root.scrollTop + root.clientHeight)
				root.scrollTop = top + button.offsetHeight - root.clientHeight;
		}
	}, [current, ids]);
	function navigate(id: string) {
		const target = document.getElementById(id);
		if (!target || (scrollContainer && !scrollContainer.contains(target))) return;
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
		const top =
			target.getBoundingClientRect().top -
			(scrollContainer?.getBoundingClientRect().top ?? 0) +
			(scrollContainer?.scrollTop ?? window.scrollY) -
			offset;
		(scrollContainer ?? window).scrollTo({ top, behavior });
	}
	return (
		<Tooltip.Provider delayDuration={120} skipDelayDuration={0}>
			<nav
				ref={nav}
				aria-label={label}
				className={cx("mds-scroll-navigator", className)}
				style={style}
				onPointerLeave={() => setHovered(-1)}
			>
				{items.map((item, index) => (
					<Tooltip.Root key={item.id}>
						<Tooltip.Trigger asChild>
							<button
								type="button"
								ref={(element) => {
									buttons.current[index] = element;
								}}
								aria-label={item.label}
								aria-current={current === item.id ? "location" : undefined}
								tabIndex={index === Math.min(focusIndex, items.length - 1) ? 0 : -1}
								className="mds-scroll-navigator-tick"
								style={
									{
										"--mds-tick-width": `${hovered < 0 ? 12 : Math.max(12, 30 - Math.abs(index - hovered) * 6)}px`,
									} as CSSProperties
								}
								onPointerEnter={() => setHovered(index)}
								onFocus={() => {
									setFocusIndex(index);
									setHovered(index);
								}}
								onBlur={() => setHovered(-1)}
								onClick={() => navigate(item.id)}
								onKeyDown={(event) => {
									const next =
										event.key === "ArrowDown"
											? Math.min(items.length - 1, index + 1)
											: event.key === "ArrowUp"
												? Math.max(0, index - 1)
												: event.key === "Home"
													? 0
													: event.key === "End"
														? items.length - 1
														: -1;
									if (next >= 0) {
										event.preventDefault();
										setFocusIndex(next);
										buttons.current[next]?.focus({ preventScroll: true });
										const button = buttons.current[next];
										const root = nav.current;
										if (button && root) {
											if (button.offsetTop < root.scrollTop) root.scrollTop = button.offsetTop;
											else if (button.offsetTop + button.offsetHeight > root.scrollTop + root.clientHeight)
												root.scrollTop = button.offsetTop + button.offsetHeight - root.clientHeight;
										}
									}
								}}
							>
								<span aria-hidden="true" />
							</button>
						</Tooltip.Trigger>
						{portal && (
							<Tooltip.Portal container={portal}>
								<Tooltip.Content
									side={direction === "rtl" ? "left" : "right"}
									sideOffset={12}
									collisionPadding={16}
									className="mds-scroll-navigator-preview"
								>
									<strong>{item.label}</strong>
									{item.description && <div>{item.description}</div>}
								</Tooltip.Content>
							</Tooltip.Portal>
						)}
					</Tooltip.Root>
				))}
			</nav>
		</Tooltip.Provider>
	);
}
