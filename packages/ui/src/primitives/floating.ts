import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export type FloatingSide = "top" | "bottom" | "left" | "right";
export type FloatingAlign = "start" | "center" | "end";

type FloatingOptions = {
	open: boolean;
	anchor: RefObject<HTMLElement | null>;
	content: RefObject<HTMLElement | null>;
	side?: FloatingSide;
	align?: FloatingAlign;
	sideOffset?: number;
	collisionPadding?: number;
	matchAnchorWidth?: boolean;
	minWidth?: number;
	maxWidth?: number;
};

type FloatingPosition = {
	style: CSSProperties;
	side: FloatingSide;
	positioned: boolean;
};

const initialPosition: FloatingPosition = {
	style: { position: "fixed", visibility: "hidden" },
	side: "bottom",
	positioned: false,
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Positions a portalled surface against an anchor and keeps it attached while
 * any scroll container, the viewport, or either element changes size.
 */
export function useFloatingPosition({
	open,
	anchor,
	content,
	side = "bottom",
	align = "center",
	sideOffset = 0,
	collisionPadding = 8,
	matchAnchorWidth = false,
	minWidth,
	maxWidth,
}: FloatingOptions) {
	const [position, setPosition] = useState<FloatingPosition>(initialPosition);
	const update = useCallback(() => {
		const anchorNode = anchor.current,
			contentNode = content.current;
		if (!open || !anchorNode || !contentNode) return;
		const anchorRect = anchorNode.getBoundingClientRect();
		const availableWidth = Math.max(0, window.innerWidth - collisionPadding * 2);
		const width = matchAnchorWidth
			? clamp(anchorRect.width, minWidth ?? 0, Math.min(maxWidth ?? availableWidth, availableWidth))
			: undefined;
		if (width !== undefined) contentNode.style.width = `${width}px`;
		const contentRect = contentNode.getBoundingClientRect();
		const contentWidth = width ?? contentRect.width;
		const contentHeight = contentRect.height;
		const spaces = {
			top: anchorRect.top - collisionPadding,
			bottom: window.innerHeight - anchorRect.bottom - collisionPadding,
			left: anchorRect.left - collisionPadding,
			right: window.innerWidth - anchorRect.right - collisionPadding,
		};
		const opposite: Record<FloatingSide, FloatingSide> = {
			top: "bottom",
			bottom: "top",
			left: "right",
			right: "left",
		};
		const needed = side === "top" || side === "bottom" ? contentHeight : contentWidth;
		const actualSide =
			spaces[side] >= needed + sideOffset || spaces[side] >= spaces[opposite[side]] ? side : opposite[side];
		let left: number;
		let top: number;
		if (actualSide === "top" || actualSide === "bottom") {
			top = actualSide === "bottom" ? anchorRect.bottom + sideOffset : anchorRect.top - contentHeight - sideOffset;
			left =
				align === "start"
					? anchorRect.left
					: align === "end"
						? anchorRect.right - contentWidth
						: anchorRect.left + (anchorRect.width - contentWidth) / 2;
		} else {
			left = actualSide === "right" ? anchorRect.right + sideOffset : anchorRect.left - contentWidth - sideOffset;
			top =
				align === "start"
					? anchorRect.top
					: align === "end"
						? anchorRect.bottom - contentHeight
						: anchorRect.top + (anchorRect.height - contentHeight) / 2;
		}
		left = clamp(left, collisionPadding, window.innerWidth - contentWidth - collisionPadding);
		top = clamp(top, collisionPadding, window.innerHeight - contentHeight - collisionPadding);
		setPosition({
			style: { position: "fixed", left: Math.round(left), top: Math.round(top), visibility: "visible", width },
			side: actualSide,
			positioned: true,
		});
	}, [open, anchor, content, side, align, sideOffset, collisionPadding, matchAnchorWidth, minWidth, maxWidth]);

	useLayoutEffect(() => {
		if (!open) {
			setPosition((current) => (current.positioned ? initialPosition : current));
			return;
		}
		update();
		const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
		if (anchor.current) observer?.observe(anchor.current);
		if (content.current) observer?.observe(content.current);
		window.addEventListener("resize", update);
		document.addEventListener("scroll", update, true);
		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", update);
			document.removeEventListener("scroll", update, true);
		};
	}, [open, anchor, content, update]);

	return position;
}

export function useTypeahead<T>(items: readonly T[], getText: (item: T) => string, onMatch: (item: T) => void) {
	const search = useRef("");
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	return useCallback(
		(key: string, current?: T) => {
			if (timer.current) clearTimeout(timer.current);
			search.current += key.toLocaleLowerCase();
			const repeated =
				search.current.length > 1 && [...search.current].every((character) => character === search.current[0]);
			const query = repeated ? search.current[0] : search.current;
			const start = current ? Math.max(0, items.indexOf(current) + 1) : 0;
			const ordered = [...items.slice(start), ...items.slice(0, start)];
			const match = ordered.find((item) => getText(item).trim().toLocaleLowerCase().startsWith(query));
			if (match) onMatch(match);
			timer.current = setTimeout(() => {
				search.current = "";
			}, 1000);
		},
		[items, getText, onMatch],
	);
}

/** Temporarily removes everything outside a modal-style portalled surface from the accessibility tree. */
export function hideOutside(content: HTMLElement) {
	const changed: Array<{ element: HTMLElement; previous: string | null }> = [];
	let node: HTMLElement | null = content;
	while (node?.parentElement) {
		for (const sibling of node.parentElement.children) {
			if (!(sibling instanceof HTMLElement) || sibling === node || sibling.matches("script, style")) continue;
			changed.push({ element: sibling, previous: sibling.getAttribute("aria-hidden") });
			sibling.setAttribute("aria-hidden", "true");
		}
		node = node.parentElement;
	}
	return () => {
		for (const { element, previous } of changed) {
			if (previous === null) element.removeAttribute("aria-hidden");
			else element.setAttribute("aria-hidden", previous);
		}
	};
}
