import { useDirection } from "@radix-ui/react-direction";
import { createContext, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import * as Check from "@radix-ui/react-checkbox";
import * as Toggle from "@radix-ui/react-switch";
import * as Radio from "@radix-ui/react-radio-group";
import { Check as CheckIcon, Minus, LoaderCircle, ChevronDown } from "@matrixzero/icons";
export const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(" ");
type Size = "sm" | "md" | "lg";
export interface ButtonProps extends ComponentProps<"button"> {
	variant?: "primary" | "secondary" | "ghost" | "danger" | "contrast";
	size?: Size;
	shape?: "rounded" | "pill";
	loading?: boolean;
}
export function Button({
	variant = "secondary",
	size = "md",
	shape = "rounded",
	loading = false,
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
			data-variant={variant}
			data-size={size}
			data-shape={shape}
		>
			{loading && <LoaderCircle className="mds-spin" size={16} aria-hidden="true" />}
			{children}
		</button>
	);
}
type FieldState = {
	id: string;
	description?: string;
	error?: string;
	invalid: boolean;
	required?: boolean;
	disabled?: boolean;
};
const FieldContext = createContext<FieldState | null>(null);
export interface FieldProps extends Omit<ComponentProps<"div">, "title"> {
	label: ReactNode;
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
	const value = {
		id,
		description: description ? `${id}-description` : undefined,
		error: error ? `${id}-error` : undefined,
		invalid: !!error,
		required,
		disabled,
	};
	return (
		<FieldContext.Provider value={value}>
			<div {...props} className={cx("mds-field", className)} data-disabled={disabled || undefined}>
				<label htmlFor={id} className="mds-label">
					{label}
					{required && (
						<span aria-hidden="true" className="mds-required">
							{" "}
							*
						</span>
					)}
				</label>
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
		"aria-invalid"?: ComponentProps<"input">["aria-invalid"];
		required?: boolean;
		disabled?: boolean;
	} = {},
) {
	const field = useContext(FieldContext);
	return {
		id: props.id ?? field?.id,
		"aria-describedby":
			[props["aria-describedby"], field?.description, field?.error].filter(Boolean).join(" ") || undefined,
		"aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
		required: props.required ?? field?.required,
		disabled: props.disabled ?? field?.disabled,
	};
}
export function Input({ size: _, className, ...props }: Omit<ComponentProps<"input">, "size"> & { size?: never }) {
	const field = useFieldProps(props);
	return <input {...props} {...field} className={cx("mds-input", className)} />;
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
export function Slider({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
	const field = useFieldProps(props);
	return <input {...props} {...field} type="range" className={cx("mds-slider", className)} />;
}

export interface IconButtonProps extends Omit<ButtonProps, "children" | "aria-label"> {
	label: string;
	icon: ReactNode;
}
export function IconButton({ label, icon, className, ...props }: IconButtonProps) {
	return (
		<Button {...props} aria-label={label} className={cx("mds-icon-button", className)}>
			<span aria-hidden="true">{icon}</span>
		</Button>
	);
}
export interface SegmentOption {
	value: string;
	label: string;
	disabled?: boolean;
}
export interface SegmentedControlProps extends Omit<ComponentProps<typeof Radio.Root>, "children"> {
	size?: "sm" | "md" | "lg";
	shape?: "rounded" | "pill";
	label: string;
	options: readonly SegmentOption[];
}
export function SegmentedControl({
	label,
	options,
	className,
	size = "md",
	shape = "rounded",
	...props
}: SegmentedControlProps) {
	const anchor = useRef<HTMLSpanElement>(null);
	const direction = useDirection(props.dir);
	const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	useLayoutEffect(() => {
		const root = anchor.current?.parentElement;
		if (!root) return;
		const measure = () => {
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
		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(root);
		root.querySelectorAll(".mds-segment-option").forEach((item) => resize.observe(item));
		const mutation = new MutationObserver(measure);
		mutation.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
		return () => {
			resize.disconnect();
			mutation.disconnect();
		};
	}, [direction, options, size, shape]);
	return (
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
