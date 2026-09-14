import { useEffect, useMemo, useRef, useState } from "react";
import { parseDate } from "@internationalized/date";
import { useDirection } from "@radix-ui/react-direction";
import {
	DateRangePicker as AriaDateRangePicker,
	RangeCalendar,
	DateInput,
	DateSegment,
	Group,
	Button,
	Popover,
	Dialog,
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
} from "react-aria-components";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "@matrixzero/icons";
import { cx, useFieldProps } from "./controls.js";
import { usePortalContainer } from "./theme.js";
import type { DatePickerProps } from "./date-time.js";

export interface DateRangeValue {
	/** Gregorian YYYY-MM-DD. */
	start: string;
	/** Gregorian YYYY-MM-DD, on or after start. */
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
function parse(value?: string) {
	try {
		return value ? parseDate(value) : undefined;
	} catch {
		return undefined;
	}
}
function parseRange(value?: DateRangeValue | null) {
	const start = parse(value?.start),
		end = parse(value?.end);
	return start && end ? { start, end } : null;
}
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
	const [internal, setInternal] = useState(defaultValue);
	const [open, setOpen] = useState(false);
	const raw = value === undefined ? internal : value;
	const selected = useMemo(() => parseRange(raw), [raw?.start, raw?.end]);
	const t = (zh: string, en: string) => (locale.startsWith("zh") ? zh : en);
	useEffect(() => {
		const form = root.current?.closest("form");
		const reset = (event: Event) =>
			queueMicrotask(() => {
				if (!event.defaultPrevented && value === undefined) {
					setInternal(defaultValue);
					setOpen(false);
				}
			});
		form?.addEventListener("reset", reset);
		return () => form?.removeEventListener("reset", reset);
	}, [value, defaultValue]);
	return (
		<I18nProvider locale={locale}>
			<div className="mds-temporal-scope" dir={direction}>
				<AriaDateRangePicker
					ref={root}
					id={field.id}
					className={cx("mds-temporal mds-date-range", className)}
					value={selected}
					onChange={(next) => {
						const range = next ? { start: next.start.toString(), end: next.end.toString() } : null;
						if (value === undefined) setInternal(range);
						onValueChange?.(range);
						if (next) setOpen(false);
					}}
					startName={startName}
					endName={endName}
					aria-label={props["aria-label"]}
					aria-labelledby={props["aria-labelledby"] ?? (!label ? field["aria-labelledby"] : undefined)}
					aria-describedby={field["aria-describedby"]}
					isRequired={field.required}
					isDisabled={field.disabled}
					isReadOnly={readOnly}
					isInvalid={
						error || field["aria-invalid"] === true || (selected && selected.end.compare(selected.start) < 0)
							? true
							: undefined
					}
					validationBehavior="native"
					validate={(range) =>
						range.end.compare(range.start) < 0
							? t("结束日期不能早于开始日期。", "The end date must be on or after the start date.")
							: null
					}
					minValue={parse(minValue)}
					maxValue={parse(maxValue)}
					isDateUnavailable={isDateUnavailable ? (day) => isDateUnavailable(day.toString()) : undefined}
					firstDayOfWeek={firstDayOfWeek}
					shouldCloseOnSelect={false}
					isOpen={picker && open}
					onOpenChange={setOpen}
				>
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
					<Group className="mds-temporal-group">
						<DateInput slot="start" className="mds-date-input">
							{(segment) => <DateSegment segment={segment} className="mds-date-segment" />}
						</DateInput>
						<span className="mds-date-range-separator" aria-hidden="true">
							–
						</span>
						<DateInput slot="end" className="mds-date-input">
							{(segment) => <DateSegment segment={segment} className="mds-date-segment" />}
						</DateInput>
						{picker && (
							<Button
								className="mds-temporal-trigger"
								isDisabled={field.disabled || readOnly}
								aria-label={t("选择日期范围", "Choose date range")}
							>
								<CalendarIcon size={16} />
							</Button>
						)}
					</Group>
					{description && (
						<Text slot="description" className="mds-description">
							{description}
						</Text>
					)}
					<FieldError className="mds-error">
						{error ||
							t(
								"请输入有效的日期范围，结束日期不能早于开始日期。",
								"Enter a valid date range. The end date must be on or after the start date.",
							)}
					</FieldError>
					{picker && (
						<Popover
							className="mds-date-popover"
							placement="bottom start"
							offset={8}
							UNSTABLE_portalContainer={container ?? undefined}
						>
							<Dialog className="mds-date-dialog" aria-label={t("选择日期范围", "Choose date range")}>
								<RangeCalendar className="mds-calendar mds-range-calendar">
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
								</RangeCalendar>
							</Dialog>
						</Popover>
					)}
				</AriaDateRangePicker>
			</div>
		</I18nProvider>
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
