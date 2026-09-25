import { useEffect, useImperativeHandle, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentProps } from "react";
import { Check, ChevronDown } from "@matrixzero/icons";
import { cx, useFieldProps } from "./controls.js";
import { usePortalContainer } from "./theme.js";

export interface SelectOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}
export interface SelectProps
	extends Omit<ComponentProps<"button">, "children" | "defaultValue" | "value" | "onChange" | "name"> {
	options: readonly SelectOption[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	name?: string;
	form?: string;
	required?: boolean;
	placeholder?: string;
}

export function Select({
	options,
	value,
	defaultValue = "",
	onValueChange,
	name,
	form,
	required,
	disabled,
	placeholder = "—",
	className,
	...props
}: SelectProps) {
	const field = useFieldProps({ ...props, required, disabled });
	const container = usePortalContainer();
	const trigger = useRef<HTMLButtonElement>(null),
		input = useRef<HTMLSelectElement>(null),
		content = useRef<HTMLDivElement>(null);
	useImperativeHandle(props.ref, () => trigger.current!);
	const [internal, setInternal] = useState(defaultValue),
		[open, setOpen] = useState(false),
		[validation, setValidation] = useState(""),
		[active, setActive] = useState(0);
	const errorId = useId(),
		listId = useId(),
		selected = value ?? internal,
		selectedOption = options.find((option) => option.value === selected),
		enabled = options.filter((option) => !option.disabled);
	const change = (next: string) => {
		if (value === undefined) setInternal(next);
		setValidation("");
		if (next !== selected) onValueChange?.(next);
	};
	useEffect(() => {
		const owner = input.current?.form;
		if (!owner) return;
		const reset = (event: Event) =>
			queueMicrotask(() => {
				if (event.defaultPrevented) return;
				setValidation("");
				setOpen(false);
				if (value === undefined) setInternal(defaultValue);
				if (input.current) input.current.value = value ?? defaultValue;
			});
		owner.addEventListener("reset", reset);
		return () => owner.removeEventListener("reset", reset);
	}, [form, value, defaultValue]);
	useEffect(() => {
		if (!open) return;
		const hidden = [...document.querySelectorAll<HTMLElement>('[role="listbox"], select')]
			.filter((element) => element !== content.current && element !== input.current)
			.map((element) => ({ element, previous: element.getAttribute("aria-hidden") }));
		for (const { element } of hidden) element.setAttribute("aria-hidden", "true");
		setActive(
			Math.max(
				0,
				enabled.findIndex((option) => option.value === selected),
			),
		);
		queueMicrotask(
			() =>
				content.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(selected)}"]`)?.focus() ??
				content.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])')?.focus(),
		);
		const outside = (event: PointerEvent) => {
			if (!content.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node))
				setOpen(false);
		};
		document.addEventListener("pointerdown", outside);
		return () => {
			document.removeEventListener("pointerdown", outside);
			for (const { element, previous } of hidden) {
				if (previous === null) element.removeAttribute("aria-hidden");
				else element.setAttribute("aria-hidden", previous);
			}
		};
	}, [open]);
	const focusOption = (option?: SelectOption) =>
		option && content.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(option.value)}"]`)?.focus();
	const move = (delta: number) => {
		if (!enabled.length) return;
		const next = (active + delta + enabled.length) % enabled.length;
		setActive(next);
		focusOption(enabled[next]);
	};
	const rect = trigger.current?.getBoundingClientRect();
	const popup =
		open && container
			? createPortal(
					<div
						ref={content}
						id={listId}
						role="listbox"
						aria-label={props["aria-label"]}
						className="mds-menu mds-select-content"
						style={{ position: "fixed", top: (rect?.bottom ?? 0) + 6, left: rect?.left ?? 0, minWidth: rect?.width }}
						onKeyDown={(event) => {
							if (event.key === "Escape") {
								event.preventDefault();
								setOpen(false);
								trigger.current?.focus();
							} else if (event.key === "ArrowDown") {
								event.preventDefault();
								move(1);
							} else if (event.key === "ArrowUp") {
								event.preventDefault();
								move(-1);
							} else if (event.key === "Home") {
								event.preventDefault();
								setActive(0);
								focusOption(enabled[0]);
							} else if (event.key === "End") {
								event.preventDefault();
								const index = enabled.length - 1;
								setActive(index);
								focusOption(enabled[index]);
							} else if (event.key.length === 1) {
								const match = enabled.find((option) =>
									option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()),
								);
								if (match) {
									event.preventDefault();
									focusOption(match);
								}
							}
						}}
					>
						{options.map((option) => {
							const checked = option.value === selected;
							return (
								<button
									type="button"
									key={option.value}
									role="option"
									aria-selected={checked}
									aria-disabled={option.disabled || undefined}
									data-disabled={option.disabled ? "" : undefined}
									data-state={checked ? "checked" : "unchecked"}
									data-value={option.value}
									disabled={option.disabled}
									className="mds-menu-item"
									onClick={() => {
										change(option.value);
										setOpen(false);
										trigger.current?.focus();
									}}
								>
									<span>
										{option.label}
										{option.description && <span className="mds-description">{option.description}</span>}
									</span>
									<span className="mds-menu-check">{checked && <Check size={14} />}</span>
								</button>
							);
						})}
					</div>,
					container,
				)
			: null;
	return (
		<span className="mds-select-control">
			<button
				{...props}
				{...{ ...field, required: undefined }}
				ref={trigger}
				type="button"
				form={form}
				role="combobox"
				aria-controls={listId}
				aria-expanded={open}
				data-state={open ? "open" : "closed"}
				aria-haspopup="listbox"
				aria-required={field.required || undefined}
				aria-invalid={field["aria-invalid"] || !!validation || undefined}
				aria-describedby={
					[field["aria-describedby"], validation ? errorId : undefined].filter(Boolean).join(" ") || undefined
				}
				className={cx("mds-input", "mds-select-trigger", className)}
				onClick={() => setOpen((current) => !current)}
				onKeyDown={(event) => {
					if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
						event.preventDefault();
						setOpen(true);
					}
				}}
			>
				<span>{selectedOption?.label ?? placeholder}</span>
				<ChevronDown size={14} aria-hidden="true" />
			</button>
			{popup}
			<select
				ref={input}
				name={name}
				form={form}
				required={field.required}
				disabled={field.disabled}
				value={selected}
				onChange={(event) => change(event.target.value)}
				tabIndex={-1}
				aria-hidden="true"
				className="mds-select-form-value"
				onInvalid={(event) => {
					event.preventDefault();
					setValidation(event.currentTarget.validationMessage);
					trigger.current?.focus();
				}}
			>
				<option value="" />
				{options.map((option) => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			{validation && (
				<span id={errorId} role="alert" className="mds-error">
					{validation}
				</span>
			)}
		</span>
	);
}
