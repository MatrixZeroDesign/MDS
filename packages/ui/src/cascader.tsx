import { useRef, useState, type KeyboardEvent } from "react";
import { useDirection } from "@radix-ui/react-direction";
import { ChevronDown, Check } from "@matrixzero/icons";
import { Popover, PopoverTrigger, PopoverContent } from "./popover.js";

export interface CascaderOption {
	value: string;
	label: string;
	disabled?: boolean;
	children?: readonly CascaderOption[];
}
export interface CascaderProps {
	options: readonly CascaderOption[];
	label: string;
	value?: readonly string[];
	defaultValue?: readonly string[];
	onValueChange?: (value: string[], path: CascaderOption[]) => void;
	placeholder?: string;
	disabled?: boolean;
	/** Defaults to selecting leaf nodes only. */
	changeOnSelect?: boolean;
	clearLabel?: string;
	emptyLabel?: string;
	name?: string;
	className?: string;
}
function resolvePath(options: readonly CascaderOption[], value: readonly string[]) {
	const path: CascaderOption[] = [];
	for (const key of value) {
		const option = options.find((item) => item.value === key);
		if (!option) break;
		path.push(option);
		options = option.children ?? [];
	}
	return path;
}
/** Hierarchical single selection. Form submission serializes the selected path as JSON. */
export function Cascader({
	options,
	label,
	value,
	defaultValue = [],
	onValueChange,
	placeholder = "Select…",
	disabled,
	changeOnSelect = false,
	clearLabel,
	emptyLabel = "No options",
	name,
	className,
}: CascaderProps) {
	const [local, setLocal] = useState<readonly string[]>(defaultValue);
	const selected = value ?? local;
	const [expanded, setExpanded] = useState<readonly string[]>(selected);
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState("");
	const buttons = useRef(new Map<string, HTMLButtonElement>());
	const direction = useDirection();
	const path = resolvePath(options, selected);
	const branches = resolvePath(options, expanded);
	const columns: (readonly CascaderOption[])[] = [options];
	for (const item of branches) {
		if (item.children?.length) columns.push(item.children);
		else break;
	}
	const keyFor = (level: number, key: string) => JSON.stringify([level, key]);
	const move = (level: number, key: string) => {
		const id = keyFor(level, key);
		setFocus(id);
		requestAnimationFrame(() => buttons.current.get(id)?.focus());
	};
	const commit = (keys: string[]) => {
		setLocal(keys);
		onValueChange?.(keys, resolvePath(options, keys));
	};
	const activate = (item: CascaderOption, level: number) => {
		const keys = [...expanded.slice(0, level), item.value];
		setExpanded(keys);
		if (item.children?.length) {
			if (changeOnSelect) commit(keys);
			const first = item.children.find((child) => !child.disabled);
			if (first) move(level + 1, first.value);
		} else {
			commit(keys);
			setOpen(false);
		}
	};
	const keyboard = (event: KeyboardEvent, item: CascaderOption, level: number) => {
		const siblings = columns[level].filter((option) => !option.disabled);
		const index = siblings.findIndex((option) => option.value === item.value);
		if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
			event.preventDefault();
			const next =
				event.key === "Home"
					? 0
					: event.key === "End"
						? siblings.length - 1
						: (index + (event.key === "ArrowDown" ? 1 : -1) + siblings.length) % siblings.length;
			if (siblings[next]) move(level, siblings[next].value);
		} else if (event.key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight") && item.children?.length) {
			event.preventDefault();
			activate(item, level);
		} else if (event.key === (direction === "rtl" ? "ArrowRight" : "ArrowLeft") && level > 0) {
			event.preventDefault();
			setExpanded(expanded.slice(0, level - 1));
			move(level - 1, expanded[level - 1]);
		}
	};
	return (
		<div className={["mds-cascader", className].filter(Boolean).join(" ")}>
			{name && <input type="hidden" name={name} value={JSON.stringify(selected)} disabled={disabled} />}
			<Popover
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (next) {
						setExpanded(selected);
						setFocus("");
					}
				}}
			>
				<PopoverTrigger className="mds-input mds-select-trigger" disabled={disabled} aria-label={label}>
					<span className="mds-cascader-value">
						{path.length ? path.map((item) => item.label).join(" / ") : placeholder}
					</span>
					<ChevronDown size={16} aria-hidden="true" />
				</PopoverTrigger>
				<PopoverContent
					title={label}
					className="mds-cascader-popup"
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						const target =
							options.find((item) => item.value === selected[0] && !item.disabled) ??
							options.find((item) => !item.disabled);
						if (target) move(0, target.value);
					}}
				>
					{options.length ? (
						<div className="mds-cascader-columns">
							{columns.map((items, level) => (
								<div
									key={level}
									role="group"
									aria-label={level === 0 ? label : branches[level - 1]?.label}
									className="mds-cascader-column"
								>
									{items.map((item) => (
										<button
											key={item.value}
											ref={(el) => {
												const id = keyFor(level, item.value);
												if (el) buttons.current.set(id, el);
												else buttons.current.delete(id);
											}}
											type="button"
											disabled={item.disabled}
											className="mds-cascader-option"
											tabIndex={focus === keyFor(level, item.value) ? 0 : -1}
											aria-expanded={item.children?.length ? expanded[level] === item.value : undefined}
											aria-pressed={
												selected[level] === item.value && selected.slice(0, level).every((v, i) => v === expanded[i])
											}
											data-expanded={expanded[level] === item.value || undefined}
											onFocus={() => setFocus(keyFor(level, item.value))}
											onKeyDown={(event) => keyboard(event, item, level)}
											onClick={() => activate(item, level)}
										>
											<span>{item.label}</span>
											{item.children?.length ? (
												<span aria-hidden="true">{direction === "rtl" ? "‹" : "›"}</span>
											) : selected[level] === item.value &&
											  selected.slice(0, level).every((v, i) => v === expanded[i]) ? (
												<Check size={14} aria-hidden="true" />
											) : null}
										</button>
									))}
								</div>
							))}
						</div>
					) : (
						<p>{emptyLabel}</p>
					)}
				</PopoverContent>
			</Popover>
			{clearLabel && selected.length > 0 && (
				<button
					type="button"
					disabled={disabled}
					className="mds-cascader-clear"
					aria-label={clearLabel}
					onClick={() => {
						commit([]);
						setExpanded([]);
					}}
				>
					{clearLabel}
				</button>
			)}
		</div>
	);
}
