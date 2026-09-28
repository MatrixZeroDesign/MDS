import { useDirection } from "./primitives/direction.js";
import { createContext, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import * as Check from "./primitives/checkbox.js";
import * as Toggle from "./primitives/switch.js";
import * as Radio from "./primitives/radio-group.js";
import {
	Check as CheckIcon,
	Minus,
	Plus,
	LoaderCircle,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	X,
} from "@matrixzero/icons";
export const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(" ");
type Size = "sm" | "md" | "lg";
export interface ButtonProps extends ComponentProps<"button"> {
	density?: "comfortable" | "compact";
	variant?: "primary" | "secondary" | "ghost" | "danger" | "contrast";
	size?: Size;
	shape?: "rounded" | "pill";
	loading?: boolean;
	/** Decorative icon rendered before the label. */
	leadingIcon?: ReactNode;
	/** Decorative icon rendered after the label. */
	trailingIcon?: ReactNode;
}
export function Button({
	density,
	variant = "secondary",
	size = "md",
	shape = "rounded",
	loading = false,
	leadingIcon,
	trailingIcon,
	disabled,
	className,
	children,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={cx("mds-button", className)}
			data-mds-density={density}
			data-variant={variant}
			data-size={size}
			data-shape={shape}
		>
			{loading ? (
				<span className="mds-button-icon" data-position="leading">
					<LoaderCircle className="mds-spin" aria-hidden="true" />
				</span>
			) : (
				leadingIcon !== undefined && (
					<span className="mds-button-icon" data-position="leading" aria-hidden="true">
						{leadingIcon}
					</span>
				)
			)}
			{children !== undefined && <span className="mds-button-label">{children}</span>}
			{!loading && trailingIcon !== undefined && (
				<span className="mds-button-icon" data-position="trailing" aria-hidden="true">
					{trailingIcon}
				</span>
			)}
		</button>
	);
}

export interface ChipGroupProps extends ComponentProps<"div"> {
	label: string;
}

export function ChipGroup({ label, className, ...props }: ChipGroupProps) {
	return <div {...props} role="group" aria-label={label} className={cx("mds-chip-group", className)} />;
}

export interface ChipProps extends Omit<ComponentProps<"button">, "onChange"> {
	leading?: ReactNode;
	selected?: boolean;
	onSelectedChange?: (selected: boolean) => void;
	removable?: boolean;
	removeLabel?: string;
	onRemove?: () => void;
}

/** Compact filter, choice, or removable value. */
export function Chip({
	leading,
	selected,
	onSelectedChange,
	removable = false,
	removeLabel,
	onRemove,
	className,
	children,
	onClick,
	type = "button",
	...props
}: ChipProps) {
	return (
		<button
			{...props}
			type={type}
			className={cx("mds-chip", className)}
			data-selected={selected || undefined}
			aria-pressed={!removable && selected !== undefined ? selected : undefined}
			aria-label={removable ? removeLabel : props["aria-label"]}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				if (removable) onRemove?.();
				else if (selected !== undefined) onSelectedChange?.(!selected);
			}}
		>
			{leading !== undefined && <span className="mds-chip-leading">{leading}</span>}
			<span className="mds-chip-label">{children}</span>
			{removable && <X className="mds-chip-remove-icon" size={13} aria-hidden="true" />}
		</button>
	);
}
type FieldState = {
	id: string;
	label?: string;
	description?: string;
	error?: string;
	invalid: boolean;
	required?: boolean;
	disabled?: boolean;
};
const FieldContext = createContext<FieldState | null>(null);
export interface FieldProps extends Omit<ComponentProps<"div">, "title"> {
	/** Visible label. Omit only when the child supplies another accessible name. */
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	required?: boolean;
	disabled?: boolean;
}
export function Field({
	id: given,
	label,
	description,
	error,
	required,
	disabled,
	children,
	className,
	...props
}: FieldProps) {
	const auto = useId(),
		id = given || auto;
	const hasLabel = label !== undefined && label !== null;
	const value = {
		id,
		label: hasLabel ? `${id}-label` : undefined,
		description: description ? `${id}-description` : undefined,
		error: error ? `${id}-error` : undefined,
		invalid: !!error,
		required,
		disabled,
	};
	return (
		<FieldContext.Provider value={value}>
			<div {...props} className={cx("mds-field", className)} data-disabled={disabled || undefined}>
				{hasLabel && (
					<label id={value.label} htmlFor={id} className="mds-label">
						{label}
						{required && (
							<span aria-hidden="true" className="mds-required">
								{" "}
								*
							</span>
						)}
					</label>
				)}
				{children}
				{description && (
					<div id={value.description} className="mds-description">
						{description}
					</div>
				)}
				{error && (
					<div id={value.error} className="mds-error" role="alert">
						{error}
					</div>
				)}
			</div>
		</FieldContext.Provider>
	);
}
export function useFieldProps(
	props: {
		id?: string;
		"aria-describedby"?: string;
		"aria-labelledby"?: string;
		"aria-invalid"?: ComponentProps<"input">["aria-invalid"];
		required?: boolean;
		disabled?: boolean;
	} = {},
) {
	const field = useContext(FieldContext);
	return {
		id: props.id ?? field?.id,
		"aria-labelledby": props["aria-labelledby"] ?? field?.label,
		"aria-describedby":
			[props["aria-describedby"], field?.description, field?.error].filter(Boolean).join(" ") || undefined,
		"aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
		required: props.required ?? field?.required,
		disabled: props.disabled ?? field?.disabled,
	};
}
function Input({
	size: _,
	className,
	density,
	...props
}: Omit<ComponentProps<"input">, "size"> & { size?: never; density?: "comfortable" | "compact" }) {
	const field = useFieldProps(props);
	return <input data-mds-density={density} {...props} {...field} className={cx("mds-input", className)} />;
}

interface FieldAffixProps {
	/** Decorative icon rendered before the editable value. */
	leadingIcon?: ReactNode;
	/** Decorative icon rendered after the editable value. */
	trailingIcon?: ReactNode;
	/** Unit or fixed suffix announced with the field value. */
	unit?: ReactNode;
	/** Class name applied to the native input. */
	inputClassName?: string;
}

export interface TextFieldProps extends Omit<ComponentProps<"input">, "size">, FieldAffixProps {
	/** Visible label. When omitted, provide aria-label or aria-labelledby. */
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	density?: "comfortable" | "compact";
}

/** Complete text field with label, validation messaging, icons, and an optional unit. */
export function TextField({
	id,
	label,
	description,
	error,
	required,
	disabled,
	density,
	leadingIcon,
	trailingIcon,
	unit,
	className,
	inputClassName,
	"aria-describedby": describedBy,
	...props
}: TextFieldProps) {
	const unitId = useId();
	const parentField = useContext(FieldContext);
	const hasUnit = unit !== undefined && unit !== null;
	const control = (
		<div className="mds-input-group" data-disabled={disabled || undefined}>
			{leadingIcon !== undefined && (
				<span className="mds-input-affix" data-position="leading" aria-hidden="true">
					{leadingIcon}
				</span>
			)}
			<Input
				{...props}
				required={required}
				disabled={disabled}
				density={density}
				aria-describedby={[describedBy, hasUnit ? unitId : undefined].filter(Boolean).join(" ") || undefined}
				className={cx("mds-input-group-input", inputClassName)}
			/>
			{hasUnit && (
				<span id={unitId} className="mds-input-unit">
					{unit}
				</span>
			)}
			{trailingIcon !== undefined && (
				<span className="mds-input-affix" data-position="trailing" aria-hidden="true">
					{trailingIcon}
				</span>
			)}
		</div>
	);
	if (parentField && label === undefined && description === undefined && error === undefined && className === undefined)
		return control;
	return (
		<Field
			id={id}
			label={label}
			description={description}
			error={error}
			required={required}
			disabled={disabled}
			className={className}
		>
			{control}
		</Field>
	);
}

export interface NumberFieldProps
	extends Omit<
			ComponentProps<"input">,
			"type" | "size" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
		>,
		FieldAffixProps {
	/** Visible label. When omitted, provide aria-label or aria-labelledby. */
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	value?: number | null;
	defaultValue?: number | null;
	onValueChange?: (value: number | null) => void;
	min?: number;
	max?: number;
	step?: number;
	density?: "comfortable" | "compact";
	/** Places stacked controls at the end or one control on each inline side. */
	stepperPlacement?: "end" | "sides";
	decrementLabel: string;
	incrementLabel: string;
}

/** Numeric input with native spinbutton semantics and explicit step controls. */
export function NumberField({
	id,
	label,
	description,
	error,
	value,
	defaultValue = null,
	onValueChange,
	min,
	max,
	step = 1,
	decrementLabel,
	incrementLabel,
	density,
	stepperPlacement = "end",
	disabled,
	readOnly,
	required,
	className,
	inputClassName,
	leadingIcon,
	trailingIcon,
	unit,
	"aria-describedby": describedBy,
	...props
}: NumberFieldProps) {
	const [internal, setInternal] = useState<number | null>(defaultValue);
	const current = value === undefined ? internal : value;
	const unitId = useId();
	const hasUnit = unit !== undefined && unit !== null;
	const update = (next: number | null) => {
		if (value === undefined) setInternal(next);
		onValueChange?.(next);
	};
	const stepBy = (direction: -1 | 1) => {
		const base = current ?? (direction > 0 ? (min ?? 0) - step : (max ?? 0) + step);
		const next = Math.min(
			max ?? Number.POSITIVE_INFINITY,
			Math.max(min ?? Number.NEGATIVE_INFINITY, base + step * direction),
		);
		const precision = Math.min(12, Math.max(0, (String(step).split(".")[1] ?? "").length));
		update(Number(next.toFixed(precision)));
	};
	const decrementDisabled = disabled || readOnly || (current !== null && min !== undefined && current <= min);
	const incrementDisabled = disabled || readOnly || (current !== null && max !== undefined && current >= max);
	return (
		<Field
			id={id}
			label={label}
			description={description}
			error={error}
			required={required}
			disabled={disabled}
			className={className}
		>
			<div
				className="mds-number-field-control"
				data-mds-density={density}
				data-disabled={disabled || undefined}
				data-readonly={readOnly || undefined}
				data-stepper-placement={stepperPlacement}
			>
				{stepperPlacement === "sides" && (
					<IconButton
						label={decrementLabel}
						icon={<Minus size={14} />}
						variant="ghost"
						size="sm"
						className="mds-number-field-side-button"
						data-step-direction="decrement"
						disabled={decrementDisabled}
						onClick={() => stepBy(-1)}
					/>
				)}
				<div className="mds-number-field-value">
					{leadingIcon !== undefined && (
						<span className="mds-input-affix" data-position="leading" aria-hidden="true">
							{leadingIcon}
						</span>
					)}
					<Input
						{...props}
						type="number"
						min={min}
						max={max}
						step={step}
						value={current ?? ""}
						density={density}
						disabled={disabled}
						readOnly={readOnly}
						required={required}
						aria-describedby={[describedBy, hasUnit ? unitId : undefined].filter(Boolean).join(" ") || undefined}
						className={cx("mds-number-field-input", inputClassName)}
						onChange={(event) => update(Number.isNaN(event.target.valueAsNumber) ? null : event.target.valueAsNumber)}
					/>
					{hasUnit && (
						<span id={unitId} className="mds-input-unit">
							{unit}
						</span>
					)}
					{trailingIcon !== undefined && (
						<span className="mds-input-affix" data-position="trailing" aria-hidden="true">
							{trailingIcon}
						</span>
					)}
				</div>
				{stepperPlacement === "end" ? (
					<div className="mds-number-field-steppers">
						<IconButton
							label={incrementLabel}
							icon={<ChevronUp size={12} />}
							variant="ghost"
							size="sm"
							className="mds-number-field-button"
							disabled={incrementDisabled}
							onClick={() => stepBy(1)}
						/>
						<IconButton
							label={decrementLabel}
							icon={<ChevronDown size={12} />}
							variant="ghost"
							size="sm"
							className="mds-number-field-button"
							disabled={decrementDisabled}
							onClick={() => stepBy(-1)}
						/>
					</div>
				) : (
					<IconButton
						label={incrementLabel}
						icon={<Plus size={14} />}
						variant="ghost"
						size="sm"
						className="mds-number-field-side-button"
						data-step-direction="increment"
						disabled={incrementDisabled}
						onClick={() => stepBy(1)}
					/>
				)}
			</div>
		</Field>
	);
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
	const field = useFieldProps(props);
	return <textarea {...props} {...field} className={cx("mds-input", "mds-textarea", className)} />;
}
/** Native form select: preserves browser form/reset and platform accessibility behavior. */
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
	const field = useFieldProps(props);
	return (
		<span className="mds-select-wrap">
			<select {...props} {...field} className={cx("mds-input", "mds-select", className)} />
			<ChevronDown size={14} aria-hidden="true" />
		</span>
	);
}
export function Checkbox({ className, ...props }: ComponentProps<typeof Check.Root>) {
	const field = useFieldProps(props);
	return (
		<Check.Root {...props} {...field} className={cx("mds-checkbox", className)}>
			<Check.Indicator>
				<Minus size={12} className="mds-check-mixed" />
				<CheckIcon size={12} className="mds-check-tick" />
			</Check.Indicator>
		</Check.Root>
	);
}
export interface SwitchProps extends ComponentProps<typeof Toggle.Root> {
	checkedIcon?: ReactNode;
	uncheckedIcon?: ReactNode;
}
export function Switch({ className, checkedIcon, uncheckedIcon, ...props }: SwitchProps) {
	const field = useFieldProps(props);
	return (
		<Toggle.Root {...props} {...field} className={cx("mds-switch", className)}>
			<Toggle.Thumb className="mds-switch-thumb">
				{uncheckedIcon != null && (
					<span className="mds-switch-icon" data-visible="unchecked" aria-hidden="true">
						{uncheckedIcon}
					</span>
				)}
				{checkedIcon != null && (
					<span className="mds-switch-icon" data-visible="checked" aria-hidden="true">
						{checkedIcon}
					</span>
				)}
			</Toggle.Thumb>
		</Toggle.Root>
	);
}
export interface CheckFieldProps extends ComponentProps<typeof Check.Root> {
	label: ReactNode;
	description?: ReactNode;
}
export function CheckField({ label, description, id: given, ...props }: CheckFieldProps) {
	const auto = useId(),
		id = given || auto;
	return (
		<div className="mds-check-field">
			<Checkbox {...props} id={id} aria-describedby={description ? `${id}-help` : undefined} />
			<label htmlFor={id}>
				{label}
				{description && (
					<span id={`${id}-help`} className="mds-description">
						{description}
					</span>
				)}
			</label>
		</div>
	);
}
export const RadioGroup = ({ className, ...props }: ComponentProps<typeof Radio.Root>) => (
	<Radio.Root {...props} className={cx("mds-radio-group", className)} />
);
export function RadioItem({ children, id: given, className, ...props }: ComponentProps<typeof Radio.Item>) {
	const auto = useId(),
		id = given || auto;
	return (
		<div className="mds-radio-row">
			<Radio.Item {...props} id={id} className={cx("mds-radio", className)}>
				<Radio.Indicator className="mds-radio-dot" />
			</Radio.Item>
			<label htmlFor={id}>{children}</label>
		</div>
	);
}
export interface IconButtonProps extends Omit<ButtonProps, "children" | "aria-label" | "leadingIcon" | "trailingIcon"> {
	label: string;
	icon: ReactNode;
}
export function IconButton({ label, icon, className, ...props }: IconButtonProps) {
	return <Button {...props} aria-label={label} leadingIcon={icon} className={cx("mds-icon-button", className)} />;
}
export interface SegmentOption {
	value: string;
	label: string;
	disabled?: boolean;
}
export interface SegmentedControlProps extends Omit<ComponentProps<typeof Radio.Root>, "children"> {
	scrollLeftLabel?: string;
	scrollRightLabel?: string;
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
	label: string;
	options: readonly SegmentOption[];
}
export function SegmentedControl({
	scrollLeftLabel = "Scroll options left",
	scrollRightLabel = "Scroll options right",
	label,
	options,
	className,
	size = "md",
	shape = "rounded",
	...props
}: SegmentedControlProps) {
	const anchor = useRef<HTMLSpanElement>(null);
	const shell = useRef<HTMLDivElement>(null);
	const [scroll, setScroll] = useState({ overflow: false, left: false, right: false });
	const scrollBy = (sign: number) => {
		const root = anchor.current?.parentElement;
		if (!root) return;
		root.scrollBy({
			left: sign * Math.max(80, root.clientWidth * 0.75),
			behavior:
				window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
				parseFloat(getComputedStyle(root).getPropertyValue("--mds-duration-normal")) === 0
					? "auto"
					: "smooth",
		});
	};
	const direction = useDirection(props.dir);
	const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	useLayoutEffect(() => {
		const root = anchor.current?.parentElement;
		if (!root) return;
		const measure = () => {
			const rect = root.getBoundingClientRect();
			const items = [...root.querySelectorAll<HTMLElement>(".mds-segment-option")];
			const overflow = root.scrollWidth > (shell.current?.clientWidth ?? root.clientWidth) + 1;
			const nextScroll = {
				overflow,
				left: overflow && items.some((item) => item.getBoundingClientRect().left < rect.left - 1),
				right: overflow && items.some((item) => item.getBoundingClientRect().right > rect.right + 1),
			};
			setScroll((current) =>
				current.overflow === nextScroll.overflow &&
				current.left === nextScroll.left &&
				current.right === nextScroll.right
					? current
					: nextScroll,
			);
			const selected = root.querySelector<HTMLElement>('.mds-segment-option[data-state="checked"]');
			if (!selected) {
				setPosition(null);
				return;
			}
			const next = {
				x: selected.offsetLeft,
				y: selected.offsetTop,
				width: selected.offsetWidth,
				height: selected.offsetHeight,
			};
			setPosition((current) =>
				current &&
				Object.keys(next).every((key) => current[key as keyof typeof next] === next[key as keyof typeof next])
					? current
					: next,
			);
		};
		const reveal = () => {
			measure();
			const active = root.querySelector<HTMLElement>('.mds-segment-option[data-state="checked"]');
			if (!active) return;
			const rect = root.getBoundingClientRect(),
				item = active.getBoundingClientRect();
			const delta =
				item.left < rect.left ? item.left - rect.left : item.right > rect.right ? item.right - rect.right : 0;
			if (delta) root.scrollBy({ left: delta, behavior: "auto" });
		};
		reveal();
		root.addEventListener("scroll", measure, { passive: true });
		const resize = new ResizeObserver(reveal);
		resize.observe(root);
		root.querySelectorAll(".mds-segment-option").forEach((item) => resize.observe(item));
		const mutation = new MutationObserver(reveal);
		mutation.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
		return () => {
			resize.disconnect();
			mutation.disconnect();
			root.removeEventListener("scroll", measure);
		};
	}, [direction, options, size, shape]);
	return (
		<div
			ref={shell}
			dir={direction}
			className="mds-segment-scroll-shell"
			data-can-scroll-left={scroll.left || undefined}
			data-can-scroll-right={scroll.right || undefined}
		>
			{scroll.overflow && (
				<IconButton
					className="mds-segment-scroll-button"
					style={{ order: direction === "rtl" ? 2 : 0 }}
					size="sm"
					variant="ghost"
					label={scrollLeftLabel}
					icon={<ChevronLeft size={16} />}
					disabled={!scroll.left}
					onClick={() => scrollBy(-1)}
				/>
			)}
			<Radio.Root
				orientation="horizontal"
				{...props}
				aria-label={label}
				data-size={size}
				data-shape={shape}
				className={cx("mds-segmented", className)}
			>
				<span ref={anchor} hidden aria-hidden="true" />
				{position && (
					<span
						className="mds-segment-indicator"
						aria-hidden="true"
						style={{
							width: position.width,
							height: position.height,
							transform: `translate(${position.x}px, ${position.y}px)`,
						}}
					/>
				)}
				{options.map((option) => (
					<Radio.Item key={option.value} value={option.value} disabled={option.disabled} className="mds-segment-option">
						{option.label}
					</Radio.Item>
				))}
			</Radio.Root>
			{scroll.overflow && (
				<IconButton
					className="mds-segment-scroll-button"
					style={{ order: direction === "rtl" ? 0 : 2 }}
					size="sm"
					variant="ghost"
					label={scrollRightLabel}
					icon={<ChevronRight size={16} />}
					disabled={!scroll.right}
					onClick={() => scrollBy(1)}
				/>
			)}
		</div>
	);
}
export function RadioCardGroup({ className, ...props }: ComponentProps<typeof Radio.Root>) {
	return <Radio.Root {...props} className={cx("mds-radio-cards", className)} />;
}
export interface RadioCardProps extends Omit<ComponentProps<typeof Radio.Item>, "title" | "children"> {
	title: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
}
export function RadioCard({ title, description, icon, className, ...props }: RadioCardProps) {
	const id = useId();
	return (
		<Radio.Item
			{...props}
			aria-labelledby={id}
			aria-describedby={description ? `${id}-help` : undefined}
			className={cx("mds-radio-card", className)}
		>
			{icon && (
				<span className="mds-radio-card-icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<span className="mds-radio-card-copy">
				<span id={id} className="mds-radio-card-title">
					{title}
				</span>
				{description && (
					<span id={`${id}-help`} className="mds-description">
						{description}
					</span>
				)}
			</span>
			<span className="mds-radio-card-check" aria-hidden="true">
				<Radio.Indicator className="mds-radio-dot" />
			</span>
		</Radio.Item>
	);
}

export interface SpinnerProps {
	size?: "sm" | "md" | "lg";
	label?: string;
	decorative?: boolean;
	className?: string;
}
export function Spinner({ size = "md", label = "Loading", decorative = false, className }: SpinnerProps) {
	return (
		<span
			className={cx("mds-spinner", className)}
			data-size={size}
			role={decorative ? undefined : "status"}
			aria-label={decorative ? undefined : label}
			aria-hidden={decorative || undefined}
		>
			<LoaderCircle className="mds-spin" size={size === "sm" ? 14 : size === "lg" ? 32 : 20} />
		</span>
	);
}
