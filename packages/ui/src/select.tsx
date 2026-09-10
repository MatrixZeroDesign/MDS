import { useEffect, useImperativeHandle, useId, useRef, useState } from "react";
import type { ComponentProps } from "react";
import * as Primitive from "@radix-ui/react-select";
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
	extends Omit<
		ComponentProps<typeof Primitive.Trigger>,
		"children" | "asChild" | "defaultValue" | "value" | "onChange" | "name"
	> {
	options: readonly SelectOption[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	name?: string;
	required?: boolean;
	placeholder?: string;
}
/** The visual listbox and the native form value have separate responsibilities. */
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
	const trigger = useRef<HTMLButtonElement>(null);
	useImperativeHandle(props.ref, () => trigger.current!);
	const input = useRef<HTMLSelectElement>(null);
	const [internal, setInternal] = useState(defaultValue);
	const [validation, setValidation] = useState("");
	const errorId = useId();
	const selected = value ?? internal;
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
				if (value === undefined) setInternal(defaultValue);
				// Native reset mutates the select even when the controlled React value is unchanged.
				if (input.current) input.current.value = value ?? defaultValue;
			});
		owner.addEventListener("reset", reset);
		return () => owner.removeEventListener("reset", reset);
	}, [form, value, defaultValue]);
	return (
		<span className="mds-select-control">
			<Primitive.Root value={selected} onValueChange={change} disabled={field.disabled}>
				<Primitive.Trigger
					{...props}
					{...{ ...field, required: undefined }}
					ref={trigger}
					form={form}
					aria-required={field.required || undefined}
					aria-invalid={field["aria-invalid"] || !!validation || undefined}
					aria-describedby={
						[field["aria-describedby"], validation ? errorId : undefined].filter(Boolean).join(" ") || undefined
					}
					className={cx("mds-input", "mds-select-trigger", className)}
				>
					<Primitive.Value placeholder={placeholder} />
					<Primitive.Icon asChild>
						<ChevronDown size={14} aria-hidden="true" />
					</Primitive.Icon>
				</Primitive.Trigger>
				{container && (
					<Primitive.Portal container={container}>
						<Primitive.Content
							position="popper"
							align="start"
							sideOffset={6}
							collisionPadding={12}
							className="mds-menu mds-select-content"
						>
							<Primitive.Viewport>
								{options.map((option) => (
									<Primitive.Item
										key={option.value}
										value={option.value}
										disabled={option.disabled}
										textValue={option.label}
										className="mds-menu-item"
									>
										<span>
											<Primitive.ItemText>{option.label}</Primitive.ItemText>
											{option.description && <span className="mds-description">{option.description}</span>}
										</span>
										<Primitive.ItemIndicator className="mds-menu-check">
											<Check size={14} />
										</Primitive.ItemIndicator>
									</Primitive.Item>
								))}
							</Primitive.Viewport>
						</Primitive.Content>
					</Primitive.Portal>
				)}
			</Primitive.Root>
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
