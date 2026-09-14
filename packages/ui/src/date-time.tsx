import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDirection } from "@radix-ui/react-direction";
import { CalendarDate, Time, parseDate, parseTime } from "@internationalized/date";
import {
	DatePicker as AriaDatePicker,
	DateField as AriaDateField,
	TimeField as AriaTimeField,
	DateInput,
	DateSegment,
	Group,
	Button,
	Popover,
	Dialog,
	Calendar,
	CalendarGrid,
	CalendarGridHeader,
	CalendarHeaderCell,
	CalendarGridBody,
	CalendarCell,
	Heading,
	Label,
	Text,
	FieldError,
	I18nProvider,
	DialogTrigger,
	ListBox,
	ListBoxItem,
} from "react-aria-components";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "@matrixzero/icons";
import { cx, useFieldProps } from "./controls.js";
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
function date(value?: string) {
	if (!value) return null;
	try {
		return parseDate(value);
	} catch {
		return null;
	}
}
function time(value?: string) {
	if (!value) return null;
	try {
		return parseTime(value);
	} catch {
		return null;
	}
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
	const [internal, setInternal] = useState(defaultValue);
	const [open, setOpen] = useState(false);
	const selected = value === undefined ? internal : value;
	const change = (next: CalendarDate | Time | null) => {
		const text = next?.toString() ?? "";
		const normalized = kind === "time" ? text.slice(0, 5) : text;
		if (value === undefined) setInternal(normalized);
		onValueChange?.(normalized);
	};
	useEffect(() => {
		const owner = root.current?.closest("form");
		if (!owner) return;
		const reset = (event: Event) =>
			queueMicrotask(() => {
				if (!event.defaultPrevented && value === undefined) {
					setInternal(defaultValue);
					setOpen(false);
				}
			});
		owner.addEventListener("reset", reset);
		return () => owner.removeEventListener("reset", reset);
	}, [defaultValue, value]);
	const zh = locale.startsWith("zh");
	const t = (cn: string, en: string) => (zh ? cn : en);
	const errorMessage =
		error ||
		t(
			kind === "date" ? "请输入有效且在允许范围内的日期。" : "请输入有效且在允许范围内的时间。",
			kind === "date" ? "Enter a valid date within the allowed range." : "Enter a valid time within the allowed range.",
		);
	const common = {
		id: field.id,
		name,
		ref: root,
		"aria-label": props["aria-label"],
		"aria-labelledby": props["aria-labelledby"] ?? (!label ? field["aria-labelledby"] : undefined),
		"aria-describedby": field["aria-describedby"],
		isRequired: field.required,
		isDisabled: field.disabled,
		isReadOnly: readOnly,
		isInvalid: !!error || field["aria-invalid"] === true,
		validationBehavior: "native" as const,
		className: cx("mds-temporal", className),
	};
	const input = (
		<DateInput className="mds-date-input">
			{(segment) => <DateSegment segment={segment} className="mds-date-segment" />}
		</DateInput>
	);
	const prefix = (
		<>
			{label && (
				<Label className="mds-label">
					{label}
					{field.required && (
						<span className="mds-required" aria-hidden="true">
							{" "}
							*
						</span>
					)}
				</Label>
			)}
		</>
	);
	const suffix = (
		<>
			{description && (
				<Text slot="description" className="mds-description">
					{description}
				</Text>
			)}
			<FieldError className="mds-error">{errorMessage}</FieldError>
		</>
	);
	const dateValue = date(selected),
		timeValue = time(selected);
	const slots = Array.from(
		{ length: 1440 / minuteStep },
		(_, i) => new Time(Math.floor((i * minuteStep) / 60), (i * minuteStep) % 60),
	).filter(
		(v) => (!time(minValue) || v.compare(time(minValue)!) >= 0) && (!time(maxValue) || v.compare(time(maxValue)!) <= 0),
	);
	const formatter = new Intl.DateTimeFormat(locale, {
		hour: "numeric",
		minute: "2-digit",
		hourCycle: hourCycle === 24 ? "h23" : hourCycle === 12 ? "h12" : undefined,
		timeZone: "UTC",
	});
	return (
		<I18nProvider locale={locale}>
			<div className="mds-temporal-scope" dir={direction}>
				{kind === "date" ? (
					picker ? (
						<AriaDatePicker
							{...common}
							value={dateValue}
							onChange={change}
							minValue={date(minValue) ?? undefined}
							maxValue={date(maxValue) ?? undefined}
							isDateUnavailable={isDateUnavailable ? (v) => isDateUnavailable(v.toString()) : undefined}
							firstDayOfWeek={firstDayOfWeek}
							isOpen={open}
							onOpenChange={setOpen}
						>
							{prefix}
							<Group className="mds-temporal-group">
								{input}
								<Button
									className="mds-temporal-trigger"
									isDisabled={field.disabled || readOnly}
									aria-label={t("选择日期", "Choose date")}
								>
									<CalendarIcon size={16} />
								</Button>
							</Group>
							{suffix}
							<Popover
								className="mds-date-popover"
								placement="bottom start"
								offset={8}
								isNonModal
								UNSTABLE_portalContainer={container ?? undefined}
							>
								<Dialog className="mds-date-dialog" aria-label={t("选择日期", "Choose date")}>
									<Calendar className="mds-calendar">
										<div className="mds-calendar-header">
											<Button slot="previous" className="mds-calendar-nav" aria-label={t("上个月", "Previous month")}>
												<ChevronLeft size={16} />
											</Button>
											<Heading />
											<Button slot="next" className="mds-calendar-nav" aria-label={t("下个月", "Next month")}>
												<ChevronRight size={16} />
											</Button>
										</div>
										<CalendarGrid className="mds-calendar-grid">
											<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
											<CalendarGridBody>
												{(day) => <CalendarCell date={day} className="mds-calendar-cell" />}
											</CalendarGridBody>
										</CalendarGrid>
									</Calendar>
								</Dialog>
							</Popover>
						</AriaDatePicker>
					) : (
						<AriaDateField
							{...common}
							value={dateValue}
							onChange={change}
							minValue={date(minValue) ?? undefined}
							maxValue={date(maxValue) ?? undefined}
						>
							{prefix}
							<Group className="mds-temporal-group">{input}</Group>
							{suffix}
						</AriaDateField>
					)
				) : (
					<AriaTimeField
						{...common}
						value={timeValue}
						onChange={change}
						minValue={time(minValue) ?? undefined}
						maxValue={time(maxValue) ?? undefined}
						hourCycle={hourCycle}
						granularity="minute"
					>
						{prefix}
						<Group className="mds-temporal-group">
							{input}
							{picker && (
								<DialogTrigger isOpen={open} onOpenChange={setOpen}>
									<Button
										className="mds-temporal-trigger"
										isDisabled={field.disabled || readOnly}
										aria-label={t("选择时间", "Choose time")}
									>
										<Clock size={16} />
									</Button>
									<Popover
										className="mds-date-popover mds-time-popover"
										placement="bottom start"
										offset={8}
										isNonModal
										UNSTABLE_portalContainer={container ?? undefined}
									>
										<Dialog className="mds-date-dialog" aria-label={t("选择时间", "Choose time")}>
											<ListBox
												className="mds-time-options"
												aria-label={t("可选时间", "Available times")}
												selectionMode="single"
												selectedKeys={timeValue ? [timeValue.toString().slice(0, 5)] : []}
												onSelectionChange={(keys) => {
													const key = Array.from(keys)[0];
													if (key) {
														change(parseTime(String(key)));
														setOpen(false);
													}
												}}
												onAction={(key) => {
													change(parseTime(String(key)));
													setOpen(false);
												}}
												autoFocus
											>
												{slots.map((v) => {
													const key = v.toString().slice(0, 5);
													const text = formatter.format(new Date(Date.UTC(2000, 0, 1, v.hour, v.minute)));
													return (
														<ListBoxItem id={key} key={key} textValue={text} className="mds-time-option">
															{text}
														</ListBoxItem>
													);
												})}
											</ListBox>
											{!slots.length && <p>{t("没有可选时间", "No available times")}</p>}
										</Dialog>
									</Popover>
								</DialogTrigger>
							)}
						</Group>
						{suffix}
					</AriaTimeField>
				)}
			</div>
		</I18nProvider>
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
