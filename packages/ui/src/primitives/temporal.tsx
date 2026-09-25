import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@matrixzero/icons";

export function parseDateParts(value?: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
	if (!match) return null;
	const year = Number(match[1]),
		month = Number(match[2]),
		day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
		? { year, month, day }
		: null;
}
export function toDateString(parts: { year: number; month: number; day: number }) {
	return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}
export function parseTimeParts(value?: string) {
	const match = /^(\d{2}):(\d{2})$/.exec(value ?? "");
	if (!match) return null;
	const hour = Number(match[1]),
		minute = Number(match[2]);
	return hour < 24 && minute < 60 ? { hour, minute } : null;
}
export function toTimeString(parts: { hour: number; minute: number }) {
	return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function Segment({
	type,
	value,
	min,
	max,
	digits,
	label,
	disabled,
	readOnly,
	onChange,
}: {
	type: string;
	value: number | null;
	min: number;
	max: number;
	digits: number;
	label: string;
	disabled?: boolean;
	readOnly?: boolean;
	onChange: (value: number) => void;
}) {
	const buffer = useRef("");
	const [focused, setFocused] = useState(false);
	const update = (next: number) => onChange(Math.min(max, Math.max(min, next)));
	const keyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
		if (disabled || readOnly) return;
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();
			const direction = event.key === "ArrowUp" ? 1 : -1;
			const current = value ?? min;
			update(current + direction > max ? min : current + direction < min ? max : current + direction);
			buffer.current = "";
		} else if (/^\d$/.test(event.key)) {
			event.preventDefault();
			buffer.current = (buffer.current + event.key).slice(-digits);
			const next = Number(buffer.current);
			if (next >= min && next <= max) onChange(next);
		} else if (event.key === "Backspace" || event.key === "Delete") {
			event.preventDefault();
			buffer.current = "";
			onChange(min);
		}
	};
	return (
		<span
			className="mds-date-segment"
			role="spinbutton"
			tabIndex={disabled ? undefined : 0}
			aria-label={`${type}, ${label}`}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value ?? undefined}
			aria-valuetext={value == null ? "Empty" : String(value).padStart(digits, "0")}
			data-placeholder={value == null ? "" : undefined}
			data-focused={focused ? "" : undefined}
			onFocus={() => {
				setFocused(true);
				buffer.current = "";
			}}
			onBlur={() => {
				setFocused(false);
				buffer.current = "";
			}}
			onKeyDown={keyDown}
		>
			{value == null ? "–".repeat(Math.min(digits, 2)) : String(value).padStart(digits, "0")}
		</span>
	);
}

export function DateSegments({
	value,
	label,
	disabled,
	readOnly,
	onChange,
}: {
	value: string;
	label: string;
	disabled?: boolean;
	readOnly?: boolean;
	onChange: (value: string) => void;
}) {
	const current = parseDateParts(value);
	const update = (part: "year" | "month" | "day", next: number) => {
		const base = current ?? { year: 2000, month: 1, day: 1 };
		const candidate = { ...base, [part]: next };
		const days = new Date(Date.UTC(candidate.year, candidate.month, 0)).getUTCDate();
		candidate.day = Math.min(candidate.day, days);
		onChange(toDateString(candidate));
	};
	return (
		<div className="mds-date-input">
			<Segment
				type="month"
				value={current?.month ?? null}
				min={1}
				max={12}
				digits={2}
				label={label}
				disabled={disabled}
				readOnly={readOnly}
				onChange={(next) => update("month", next)}
			/>
			<span className="mds-date-segment" data-type="literal">
				/
			</span>
			<Segment
				type="day"
				value={current?.day ?? null}
				min={1}
				max={current ? new Date(Date.UTC(current.year, current.month, 0)).getUTCDate() : 31}
				digits={2}
				label={label}
				disabled={disabled}
				readOnly={readOnly}
				onChange={(next) => update("day", next)}
			/>
			<span className="mds-date-segment" data-type="literal">
				/
			</span>
			<Segment
				type="year"
				value={current?.year ?? null}
				min={1}
				max={9999}
				digits={4}
				label={label}
				disabled={disabled}
				readOnly={readOnly}
				onChange={(next) => update("year", next)}
			/>
		</div>
	);
}
export function TimeSegments({
	value,
	label,
	disabled,
	readOnly,
	onChange,
}: {
	value: string;
	label: string;
	disabled?: boolean;
	readOnly?: boolean;
	onChange: (value: string) => void;
}) {
	const current = parseTimeParts(value);
	const update = (part: "hour" | "minute", next: number) =>
		onChange(toTimeString({ hour: current?.hour ?? 0, minute: current?.minute ?? 0, [part]: next }));
	return (
		<div className="mds-date-input">
			<Segment
				type="hour"
				value={current?.hour ?? null}
				min={0}
				max={23}
				digits={2}
				label={label}
				disabled={disabled}
				readOnly={readOnly}
				onChange={(next) => update("hour", next)}
			/>
			<span className="mds-date-segment" data-type="literal">
				:
			</span>
			<Segment
				type="minute"
				value={current?.minute ?? null}
				min={0}
				max={59}
				digits={2}
				label={label}
				disabled={disabled}
				readOnly={readOnly}
				onChange={(next) => update("minute", next)}
			/>
		</div>
	);
}

export function CalendarPanel({
	locale,
	firstDayOfWeek = "sun",
	value,
	rangeStart,
	rangeEnd,
	minValue,
	maxValue,
	unavailable,
	onSelect,
}: {
	locale: string;
	firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
	value?: string;
	rangeStart?: string;
	rangeEnd?: string;
	minValue?: string;
	maxValue?: string;
	unavailable?: (value: string) => boolean;
	onSelect: (value: string) => void;
}) {
	const initial =
		parseDateParts(value ?? rangeStart) ??
		(() => {
			const now = new Date();
			return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		})();
	const [month, setMonth] = useState({ year: initial.year, month: initial.month });
	const first = new Date(Date.UTC(month.year, month.month - 1, 1));
	const count = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate();
	const weekStart = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(firstDayOfWeek);
	const offset = (first.getUTCDay() - weekStart + 7) % 7;
	const cells = Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => index - offset + 1);
	const language = locale.startsWith("zh") ? "zh" : "en";
	const weekdayLabels = Array.from({ length: 7 }, (_, index) => {
		const day = (weekStart + index) % 7;
		return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(
			new Date(Date.UTC(2024, 0, 7 + day)),
		);
	});
	const heading = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
	const move = (delta: number) =>
		setMonth((current) => {
			const next = new Date(Date.UTC(current.year, current.month - 1 + delta, 1));
			return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
		});
	return (
		<div className="mds-calendar">
			<div className="mds-calendar-header">
				<button
					type="button"
					className="mds-calendar-nav"
					aria-label={language === "zh" ? "上个月" : "Previous month"}
					onClick={() => move(-1)}
				>
					<ChevronLeft size={16} />
				</button>
				<h2>{heading}</h2>
				<button
					type="button"
					className="mds-calendar-nav"
					aria-label={language === "zh" ? "下个月" : "Next month"}
					onClick={() => move(1)}
				>
					<ChevronRight size={16} />
				</button>
			</div>
			<table className="mds-calendar-grid">
				<thead>
					<tr>
						{weekdayLabels.map((day) => (
							<th key={day} scope="col">
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: cells.length / 7 }, (_, row) => (
						<tr key={row}>
							{cells.slice(row * 7, row * 7 + 7).map((day, index) => {
								if (day < 1 || day > count) return <td key={index} />;
								const date = toDateString({ ...month, day });
								const disabled =
									(!!minValue && date < minValue) || (!!maxValue && date > maxValue) || !!unavailable?.(date);
								const selected =
									date === value || (!!rangeStart && !!rangeEnd && date >= rangeStart && date <= rangeEnd);
								const full = new Intl.DateTimeFormat(locale, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
									timeZone: "UTC",
								}).format(new Date(`${date}T00:00:00Z`));
								return (
									<td key={date}>
										<button
											type="button"
											className="mds-calendar-cell"
											aria-label={full}
											disabled={disabled}
											data-disabled={disabled ? "" : undefined}
											data-unavailable={unavailable?.(date) ? "" : undefined}
											data-selected={selected ? "" : undefined}
											data-selection-start={date === rangeStart ? "" : undefined}
											data-selection-end={date === rangeEnd ? "" : undefined}
											onClick={() => onSelect(date)}
										>
											{day}
										</button>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function FieldCopy({
	label,
	required,
	description,
	error,
	invalid,
	descriptionId,
	errorId,
}: {
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	error?: ReactNode;
	invalid?: boolean;
	descriptionId: string;
	errorId: string;
}) {
	return (
		<>
			{label && (
				<label className="mds-label">
					{label}
					{required && (
						<span className="mds-required" aria-hidden="true">
							{" "}
							*
						</span>
					)}
				</label>
			)}
			{description && (
				<div id={descriptionId} className="mds-description">
					{description}
				</div>
			)}
			{invalid && (
				<div id={errorId} className="mds-error">
					{error}
				</div>
			)}
		</>
	);
}
