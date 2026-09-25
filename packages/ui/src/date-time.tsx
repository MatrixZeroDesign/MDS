import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Calendar as CalendarIcon, Clock } from "@matrixzero/icons";
import { cx, useFieldProps } from "./controls.js";
import { useDirection } from "./primitives/direction.js";
import * as Popover from "./primitives/popover.js";
import { CalendarPanel, DateSegments, TimeSegments, parseDateParts, parseTimeParts } from "./primitives/temporal.js";
import { usePortalContainer } from "./theme.js";

export interface DateTimeFieldProps {
	/** Gregorian date YYYY-MM-DD or local time HH:mm. Empty string clears the field. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	id?: string;
	name?: string;
	locale?: string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	minValue?: string;
	maxValue?: string;
	className?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	"aria-invalid"?: boolean;
}
export interface DateFieldProps extends DateTimeFieldProps {}
export interface DatePickerProps extends DateFieldProps {
	/** Called with a Gregorian YYYY-MM-DD date. */
	isDateUnavailable?: (value: string) => boolean;
	firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
}
export interface TimeFieldProps extends DateTimeFieldProps {
	hourCycle?: 12 | 24;
}
export interface TimePickerProps extends TimeFieldProps {
	/** Suggested time slots only. Manual input accepts any valid minute. */
	minuteStep?: 15 | 30 | 60;
}

function Temporal({
	kind,
	picker = false,
	minuteStep = 30,
	hourCycle,
	...props
}: DatePickerProps & TimePickerProps & { kind: "date" | "time"; picker?: boolean }) {
	const {
		value,
		defaultValue = "",
		onValueChange,
		label,
		description,
		error,
		locale = "en-US",
		className,
		name,
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
	const selected = value === undefined ? internal : value;
	const labelText = typeof label === "string" ? label : (props["aria-label"] ?? (kind === "date" ? "Date" : "Time"));
	const descriptionId = useId(),
		errorId = useId();
	const parsed = kind === "date" ? !!parseDateParts(selected) : !!parseTimeParts(selected);
	const invalid =
		(!!selected && !parsed) ||
		(!!minValue && selected < minValue) ||
		(!!maxValue && selected > maxValue) ||
		(kind === "date" && !!selected && !!isDateUnavailable?.(selected));
	const requiredInvalid = !!field.required && !selected;
	const explicitInvalid = !!error || field["aria-invalid"] === true;
	const isInvalid = invalid || requiredInvalid || explicitInvalid;
	const t = (cn: string, en: string) => (locale.startsWith("zh") ? cn : en);
	const errorMessage =
		error ||
		t(
			kind === "date" ? "请输入有效且在允许范围内的日期。" : "请输入有效且在允许范围内的时间。",
			kind === "date" ? "Enter a valid date within the allowed range." : "Enter a valid time within the allowed range.",
		);
	const change = (next: string) => {
		if (value === undefined) setInternal(next);
		onValueChange?.(next);
		setShowInvalid(false);
	};
	useEffect(() => {
		validation.current?.setCustomValidity(
			isInvalid ? String(typeof errorMessage === "string" ? errorMessage : "Invalid value") : "",
		);
	}, [isInvalid, errorMessage]);
	useEffect(() => {
		const owner = root.current?.closest("form");
		if (!owner) return;
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
		owner.addEventListener("reset", reset);
		owner.addEventListener("submit", guard, true);
		return () => {
			owner.removeEventListener("reset", reset);
			owner.removeEventListener("submit", guard, true);
		};
	}, [defaultValue, value, isInvalid, field.disabled]);
	const slots = useMemo(
		() =>
			Array.from({ length: 1440 / minuteStep }, (_, i) => {
				const hour = Math.floor((i * minuteStep) / 60),
					minute = (i * minuteStep) % 60;
				return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
			}).filter((slot) => (!minValue || slot >= minValue) && (!maxValue || slot <= maxValue)),
		[minuteStep, minValue, maxValue],
	);
	const formatter = useMemo(
		() =>
			new Intl.DateTimeFormat(locale, {
				hour: "numeric",
				minute: "2-digit",
				hourCycle: hourCycle === 24 ? "h23" : hourCycle === 12 ? "h12" : undefined,
				timeZone: "UTC",
			}),
		[locale, hourCycle],
	);
	const segment =
		kind === "date" ? (
			<DateSegments
				value={selected}
				label={labelText}
				disabled={field.disabled}
				readOnly={readOnly}
				onChange={change}
			/>
		) : (
			<TimeSegments
				value={selected}
				label={labelText}
				disabled={field.disabled}
				readOnly={readOnly}
				onChange={change}
			/>
		);
	return (
		<div className="mds-temporal-scope" dir={direction}>
			<Popover.Root open={picker ? open : false} onOpenChange={setOpen}>
				<div
					ref={root}
					id={field.id}
					className={cx("mds-temporal", className)}
					data-invalid={(showInvalid || explicitInvalid) && isInvalid ? "" : undefined}
					data-disabled={field.disabled ? "" : undefined}
					aria-describedby={
						[
							props["aria-describedby"],
							description ? descriptionId : "",
							(showInvalid || explicitInvalid) && isInvalid ? errorId : "",
						]
							.filter(Boolean)
							.join(" ") || undefined
					}
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
						onFocus={() => root.current?.querySelector(".mds-temporal-group")?.setAttribute("data-focus-within", "")}
						onBlur={(event) => {
							if (!event.currentTarget.contains(event.relatedTarget))
								event.currentTarget.removeAttribute("data-focus-within");
						}}
					>
						{segment}
						{picker && (
							<Popover.Trigger asChild>
								<button
									type="button"
									className="mds-temporal-trigger"
									disabled={field.disabled || readOnly}
									data-disabled={field.disabled || readOnly ? "" : undefined}
									aria-label={kind === "date" ? t("选择日期", "Choose date") : t("选择时间", "Choose time")}
								>
									{kind === "date" ? <CalendarIcon size={16} /> : <Clock size={16} />}
								</button>
							</Popover.Trigger>
						)}
					</div>
					<input
						ref={validation}
						className="mds-visually-hidden"
						tabIndex={-1}
						name={name}
						value={selected}
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
					{(showInvalid || explicitInvalid) && isInvalid && (
						<div id={errorId} className="mds-error">
							{errorMessage}
						</div>
					)}
				</div>
				{picker && (
					<Popover.Portal container={container}>
						<Popover.Content
							side="bottom"
							align="start"
							sideOffset={8}
							className={cx("mds-date-popover", kind === "time" && "mds-time-popover")}
							aria-label={kind === "date" ? t("选择日期", "Choose date") : t("选择时间", "Choose time")}
						>
							<div className="mds-date-dialog">
								{kind === "date" ? (
									<CalendarPanel
										locale={locale}
										firstDayOfWeek={firstDayOfWeek}
										value={selected}
										minValue={minValue}
										maxValue={maxValue}
										unavailable={isDateUnavailable}
										onSelect={(next) => {
											change(next);
											setOpen(false);
										}}
									/>
								) : (
									<div className="mds-time-options" role="listbox" aria-label={t("可选时间", "Available times")}>
										{slots.map((slot) => (
											<button
												type="button"
												role="option"
												aria-selected={slot === selected}
												data-selected={slot === selected ? "" : undefined}
												className="mds-time-option"
												key={slot}
												onClick={() => {
													change(slot);
													setOpen(false);
												}}
											>
												{formatter.format(new Date(`2000-01-01T${slot}:00Z`))}
											</button>
										))}
										{!slots.length && <p>{t("没有可选时间", "No available times")}</p>}
									</div>
								)}
							</div>
						</Popover.Content>
					</Popover.Portal>
				)}
			</Popover.Root>
		</div>
	);
}
/** Editable date segments, without a calendar popup. */
export function DateField(props: DateFieldProps) {
	return <Temporal {...props} kind="date" />;
}
/** Editable date segments plus a themed calendar. */
export function DatePicker(props: DatePickerProps) {
	return <Temporal {...props} kind="date" picker />;
}
/** Editable hour/minute segments, without a time popup. */
export function TimeField(props: TimeFieldProps) {
	return <Temporal {...props} kind="time" />;
}
/** Editable time segments plus suggested times. */
export function TimePicker(props: TimePickerProps) {
	return <Temporal {...props} kind="time" picker />;
}
