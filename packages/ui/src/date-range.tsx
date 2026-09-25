import { useEffect, useId, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "@matrixzero/icons";
import { cx, useFieldProps } from "./controls.js";
import type { DatePickerProps } from "./date-time.js";
import { useDirection } from "./primitives/direction.js";
import * as Popover from "./primitives/popover.js";
import { CalendarPanel, DateSegments, parseDateParts } from "./primitives/temporal.js";
import { usePortalContainer } from "./theme.js";

export interface DateRangeValue {
	start: string;
	end: string;
}
export interface DateRangeFieldProps
	extends Omit<DatePickerProps, "value" | "defaultValue" | "onValueChange" | "name"> {
	value?: DateRangeValue | null;
	defaultValue?: DateRangeValue | null;
	onValueChange?: (value: DateRangeValue | null) => void;
	startName?: string;
	endName?: string;
}
export interface DateRangePickerProps extends DateRangeFieldProps {}
function DateRange({ picker = false, ...props }: DateRangePickerProps & { picker?: boolean }) {
	const {
		value,
		defaultValue = null,
		onValueChange,
		label,
		description,
		error,
		locale = "en-US",
		className,
		startName,
		endName,
		minValue,
		maxValue,
		readOnly,
		firstDayOfWeek,
		isDateUnavailable,
	} = props;
	const field = useFieldProps(props);
	const container = usePortalContainer();
	const direction = useDirection();
	const root = useRef<HTMLDivElement>(null);
	const validation = useRef<HTMLInputElement>(null);
	const [internal, setInternal] = useState(defaultValue);
	const [open, setOpen] = useState(false);
	const [showInvalid, setShowInvalid] = useState(false);
	const current = value === undefined ? internal : value;
	const labelText = typeof label === "string" ? label : (props["aria-label"] ?? "Date range");
	const descriptionId = useId(),
		errorId = useId();
	const t = (cn: string, en: string) => (locale.startsWith("zh") ? cn : en);
	const rangeInvalid =
		!!current &&
		(!parseDateParts(current.start) ||
			!parseDateParts(current.end) ||
			current.end < current.start ||
			(!!minValue && current.start < minValue) ||
			(!!maxValue && current.end > maxValue));
	const requiredInvalid = !!field.required && (!current?.start || !current?.end);
	const explicitInvalid = !!error || field["aria-invalid"] === true;
	const isInvalid = rangeInvalid || requiredInvalid || explicitInvalid;
	const message =
		error ||
		t(
			"请输入有效的日期范围，结束日期不能早于开始日期。",
			"Enter a valid date range. The end date must be on or after the start date.",
		);
	const change = (next: DateRangeValue | null) => {
		if (value === undefined) setInternal(next);
		onValueChange?.(next);
		setShowInvalid(false);
	};
	useEffect(() => {
		validation.current?.setCustomValidity(
			isInvalid ? String(typeof message === "string" ? message : "Invalid date range") : "",
		);
	}, [isInvalid, message]);
	useEffect(() => {
		const form = root.current?.closest("form");
		const reset = (event: Event) =>
			queueMicrotask(() => {
				if (!event.defaultPrevented && value === undefined) {
					setInternal(defaultValue);
					setOpen(false);
					setShowInvalid(false);
				}
			});
		const guard = (event: Event) => {
			if (!isInvalid || field.disabled) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			setShowInvalid(true);
		};
		form?.addEventListener("reset", reset);
		form?.addEventListener("submit", guard, true);
		return () => {
			form?.removeEventListener("reset", reset);
			form?.removeEventListener("submit", guard, true);
		};
	}, [value, defaultValue, isInvalid, field.disabled]);
	const choose = (date: string) => {
		if (!current?.start || current.end) change({ start: date, end: "" });
		else if (date < current.start) change({ start: date, end: current.start });
		else {
			change({ start: current.start, end: date });
			setOpen(false);
		}
	};
	return (
		<div className="mds-temporal-scope" dir={direction}>
			<Popover.Root open={picker ? open : false} onOpenChange={setOpen}>
				<div
					ref={root}
					id={field.id}
					className={cx("mds-temporal mds-date-range", className)}
					data-invalid={(showInvalid || explicitInvalid || rangeInvalid) && isInvalid ? "" : undefined}
					data-disabled={field.disabled ? "" : undefined}
				>
					{label && (
						<div className="mds-label">
							{label}
							{field.required && (
								<span className="mds-required" aria-hidden="true">
									{" "}
									*
								</span>
							)}
						</div>
					)}
					<div
						className="mds-temporal-group"
						onFocus={(event) => event.currentTarget.setAttribute("data-focus-within", "")}
						onBlur={(event) => {
							if (!event.currentTarget.contains(event.relatedTarget))
								event.currentTarget.removeAttribute("data-focus-within");
						}}
					>
						<DateSegments
							value={current?.start ?? ""}
							label={labelText}
							disabled={field.disabled}
							readOnly={readOnly}
							onChange={(start) => change({ start, end: current?.end ?? "" })}
						/>
						<span className="mds-date-range-separator" aria-hidden="true">
							–
						</span>
						<DateSegments
							value={current?.end ?? ""}
							label={labelText}
							disabled={field.disabled}
							readOnly={readOnly}
							onChange={(end) => change({ start: current?.start ?? "", end })}
						/>
						{picker && (
							<Popover.Trigger asChild>
								<button
									type="button"
									className="mds-temporal-trigger"
									disabled={field.disabled || readOnly}
									data-disabled={field.disabled || readOnly ? "" : undefined}
									aria-label={t("选择日期范围", "Choose date range")}
								>
									<CalendarIcon size={16} />
								</button>
							</Popover.Trigger>
						)}
					</div>
					<input
						className="mds-visually-hidden"
						tabIndex={-1}
						name={startName}
						value={current?.start ?? ""}
						readOnly
						required={field.required}
						disabled={field.disabled}
						aria-hidden="true"
					/>
					<input
						ref={validation}
						className="mds-visually-hidden"
						tabIndex={-1}
						name={endName}
						value={current?.end ?? ""}
						readOnly
						required={field.required}
						disabled={field.disabled}
						onInvalid={() => setShowInvalid(true)}
						aria-hidden="true"
					/>
					{description && (
						<div id={descriptionId} className="mds-description">
							{description}
						</div>
					)}
					{(showInvalid || explicitInvalid || rangeInvalid) && isInvalid && (
						<div id={errorId} className="mds-error">
							{message}
						</div>
					)}
				</div>
				{picker && (
					<Popover.Portal container={container}>
						<Popover.Content
							side="bottom"
							align="start"
							sideOffset={8}
							className="mds-date-popover"
							aria-label={t("选择日期范围", "Choose date range")}
						>
							<div className="mds-date-dialog">
								<CalendarPanel
									locale={locale}
									firstDayOfWeek={firstDayOfWeek}
									value={current?.start}
									rangeStart={current?.start}
									rangeEnd={current?.end || undefined}
									minValue={minValue}
									maxValue={maxValue}
									unavailable={isDateUnavailable}
									onSelect={choose}
								/>
							</div>
						</Popover.Content>
					</Popover.Portal>
				)}
			</Popover.Root>
		</div>
	);
}
/** Manually editable start and end date segments with range validation. */
export function DateRangeField(props: DateRangeFieldProps) {
	return <DateRange {...props} />;
}
/** Editable start/end dates with a themed range calendar. */
export function DateRangePicker(props: DateRangePickerProps) {
	return <DateRange {...props} picker />;
}
