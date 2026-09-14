import { useContext, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "./controls.js";
import { DensityContext } from "./density-context.js";

export interface DataTableColumn<T> {
	id: string;
	header: ReactNode;
	/** Plain value used for display and sorting. */
	accessor: (row: T) => string | number | null | undefined;
	cell?: (row: T) => ReactNode;
	/** Logical edge; pinned columns use width, defaulting to 160px. */
	pinned?: "start" | "end";
	width?: number;
	align?: "start" | "end" | "center";
	sortable?: boolean;
	compare?: (a: T, b: T) => number;
}
export interface DataTableSort {
	column: string;
	direction: "ascending" | "descending";
}
export interface DataTableProps<T> {
	rows: readonly T[];
	columns: readonly DataTableColumn<T>[];
	getRowKey: (row: T) => string;
	label: string;
	/** Virtualized rows have a fixed height. Use virtualized=false for wrapping content. */
	virtualized?: boolean;
	height?: number;
	rowHeight?: number;
	overscan?: number;
	sort?: DataTableSort | null;
	defaultSort?: DataTableSort | null;
	onSortChange?: (sort: DataTableSort | null) => void;
	selectedKeys?: ReadonlySet<string>;
	onSelectionChange?: (keys: Set<string>) => void;
	/** Required when selection is enabled; provide localized labels. */
	selectionLabel?: (row: T) => string;
	selectAllLabel?: string;
	onRowClick?: (row: T) => void;
	renderExpandedRow?: (row: T) => ReactNode;
	expandedKeys?: ReadonlySet<string>;
	onExpandedChange?: (keys: Set<string>) => void;
	expandLabel?: (row: T) => string;
	expandedRowHeight?: number;
	groupBy?: (row: T) => string;
	renderGroupHeader?: (group: string, rows: readonly T[]) => ReactNode;
	emptyContent?: ReactNode;
	className?: string;
}
export function DataTable<T>({
	rows,
	columns,
	getRowKey,
	label,
	virtualized = true,
	height = 400,
	rowHeight,
	overscan = 5,
	sort,
	defaultSort = null,
	onSortChange,
	selectedKeys,
	onSelectionChange,
	selectionLabel,
	selectAllLabel,
	onRowClick,
	renderExpandedRow,
	expandedKeys,
	onExpandedChange,
	expandLabel,
	expandedRowHeight = 160,
	groupBy,
	renderGroupHeader,
	emptyContent,
	className,
}: DataTableProps<T>) {
	const density = useContext(DensityContext);
	const viewport = useRef<HTMLDivElement>(null);
	const selectAll = useRef<HTMLInputElement>(null);
	const [offset, setOffset] = useState(0);
	const [internalSort, setInternalSort] = useState(defaultSort);
	const activeSort = sort === undefined ? internalSort : sort;
	const size = Math.max(32, rowHeight ?? (density === "compact" ? 40 : 48));
	const viewportHeight = Math.max(size * 2, height);
	const buffer = Math.max(1, Math.floor(overscan));
	const selectable = !!onSelectionChange && !!selectionLabel && !!selectAllLabel;
	const sorted = useMemo(() => {
		const column = columns.find((column) => column.id === activeSort?.column);
		if (!column || !activeSort || !column.sortable) return rows;
		const sign = activeSort.direction === "ascending" ? 1 : -1;
		return [...rows].sort((a, b) => {
			if (column.compare) return sign * column.compare(a, b);
			const av = column.accessor(a),
				bv = column.accessor(b);
			return (
				sign *
				(typeof av === "number" && typeof bv === "number"
					? av - bv
					: String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true }))
			);
		});
	}, [rows, columns, activeSort]);
	const allSelected = rows.length > 0 && rows.every((row) => selectedKeys?.has(getRowKey(row)));
	const someSelected = rows.some((row) => selectedKeys?.has(getRowKey(row)));
	useLayoutEffect(() => {
		if (selectAll.current) selectAll.current.indeterminate = someSelected && !allSelected;
	}, [someSelected, allSelected]);
	useLayoutEffect(() => {
		if (viewport.current) viewport.current.scrollTop = 0;
		setOffset(0);
	}, [rows, activeSort?.column, activeSort?.direction]);

	const [internalExpanded, setInternalExpanded] = useState<Set<string>>(new Set());
	const expanded = expandedKeys ?? internalExpanded;
	const expandable = !!renderExpandedRow && !!expandLabel;
	const orderedColumns = [
		...columns.filter((c) => c.pinned === "start"),
		...columns.filter((c) => !c.pinned),
		...columns.filter((c) => c.pinned === "end"),
	];
	type Entry = { kind: "row"; row: T } | { kind: "detail"; row: T } | { kind: "group"; group: string; rows: T[] };
	const entries: Entry[] = [];
	const append = (row: T) => {
		entries.push({ kind: "row", row });
		if (expandable && expanded.has(getRowKey(row))) entries.push({ kind: "detail", row });
	};
	if (groupBy) {
		const groups = new Map<string, T[]>();
		sorted.forEach((row) => {
			const key = groupBy(row);
			const list = groups.get(key) ?? [];
			list.push(row);
			groups.set(key, list);
		});
		groups.forEach((items, group) => {
			entries.push({ kind: "group", group, rows: items });
			items.forEach(append);
		});
	} else sorted.forEach(append);
	const offsets = [0];
	entries.forEach((entry) =>
		offsets.push(offsets[offsets.length - 1] + (entry.kind === "detail" ? Math.max(48, expandedRowHeight) : size)),
	);
	const findIndex = (position: number) => {
		let low = 0,
			high = entries.length;
		while (low < high) {
			const middle = (low + high) >>> 1;
			if (offsets[middle + 1] <= position) low = middle + 1;
			else high = middle;
		}
		return low;
	};
	const start = virtualized ? Math.max(0, findIndex(Math.max(0, offset - size)) - buffer) : 0;
	const end = virtualized ? Math.min(entries.length, findIndex(offset + viewportHeight) + buffer + 1) : entries.length;
	const totalColumns = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
	const columnStyle = (column: DataTableColumn<T>): CSSProperties => {
		const peers = orderedColumns.filter((c) => c.pinned === column.pinned);
		const index = peers.indexOf(column);
		const distance = (column.pinned === "start" ? peers.slice(0, index) : peers.slice(index + 1)).reduce(
			(n, c) => n + (c.width ?? 160),
			0,
		);
		return {
			textAlign: column.align,
			...(column.pinned
				? {
						position: "sticky",
						[column.pinned === "start" ? "insetInlineStart" : "insetInlineEnd"]: distance,
						width: column.width ?? 160,
					}
				: {}),
		};
	};
	const toggleExpanded = (key: string) => {
		const next = new Set(expanded);
		next.has(key) ? next.delete(key) : next.add(key);
		if (expandedKeys === undefined) setInternalExpanded(next);
		onExpandedChange?.(next);
	};
	const interactive = (target: EventTarget | null) =>
		target instanceof Element &&
		!!target.closest("button,a,input,select,textarea,[role=button],[contenteditable=true]");
	const changeSort = (column: DataTableColumn<T>) => {
		const next: DataTableSort = {
			column: column.id,
			direction: activeSort?.column === column.id && activeSort.direction === "ascending" ? "descending" : "ascending",
		};
		if (sort === undefined) setInternalSort(next);
		onSortChange?.(next);
	};
	const spacer = (count: number, key: string) =>
		count > 0 ? (
			<tr key={key} aria-hidden="true" className="mds-data-table-spacer">
				<td colSpan={totalColumns} style={{ height: count, padding: 0, border: 0 }} />
			</tr>
		) : null;
	return (
		<div
			ref={viewport}
			className={cx("mds-data-table-viewport", className)}
			role="region"
			aria-label={label}
			tabIndex={0}
			style={{ maxHeight: viewportHeight, "--mds-data-row-height": size + "px" } as CSSProperties}
			onScroll={(event) => setOffset(event.currentTarget.scrollTop)}
		>
			<table
				className="mds-data-table"
				aria-label={label}
				aria-rowcount={entries.length + 1}
				aria-colcount={totalColumns}
				data-virtualized={virtualized || undefined}
				style={{
					minWidth:
						orderedColumns.reduce((n, c) => n + (c.width ?? 160), 0) + (selectable ? 44 : 0) + (expandable ? 44 : 0),
				}}
			>
				<colgroup>
					{expandable && <col style={{ width: 44 }} />}
					{selectable && <col style={{ width: 44 }} />}
					{orderedColumns.map((column) => (
						<col key={column.id} style={{ width: column.width ?? 160 }} />
					))}
				</colgroup>
				<thead>
					<tr aria-rowindex={1}>
						{expandable && (
							<th scope="col">
								<span aria-hidden="true">↕</span>
							</th>
						)}
						{selectable && (
							<th scope="col">
								<input
									ref={selectAll}
									type="checkbox"
									aria-label={selectAllLabel}
									checked={allSelected}
									disabled={!rows.length}
									onChange={() => {
										const next = new Set(selectedKeys);
										rows.forEach((row) => (allSelected ? next.delete(getRowKey(row)) : next.add(getRowKey(row))));
										onSelectionChange?.(next);
									}}
								/>
							</th>
						)}
						{orderedColumns.map((column) => (
							<th
								key={column.id}
								scope="col"
								style={columnStyle(column)}
								data-pinned={column.pinned}
								aria-sort={
									column.sortable ? (activeSort?.column === column.id ? activeSort.direction : "none") : undefined
								}
							>
								{column.sortable ? (
									<button type="button" className="mds-data-table-sort" onClick={() => changeSort(column)}>
										{column.header}
										<span aria-hidden="true">
											{activeSort?.column === column.id ? (activeSort.direction === "ascending" ? "↑" : "↓") : "↕"}
										</span>
									</button>
								) : (
									column.header
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{spacer(offsets[start], "before")}
					{entries.slice(start, end).map((entry, index) => {
						if (entry.kind === "group")
							return (
								<tr key={"group:" + entry.group} aria-rowindex={start + index + 2} className="mds-data-table-group">
									<th scope="row" colSpan={totalColumns}>
										{renderGroupHeader ? (
											renderGroupHeader(entry.group, entry.rows)
										) : (
											<>
												{entry.group} ({entry.rows.length})
											</>
										)}
									</th>
								</tr>
							);
						const row = entry.row;
						const key = getRowKey(row);
						if (entry.kind === "detail")
							return (
								<tr key={"detail:" + key} aria-rowindex={start + index + 2}>
									<td colSpan={totalColumns} className="mds-data-table-detail">
										<div
											style={
												virtualized ? { height: Math.max(48, expandedRowHeight) - 1, overflow: "auto" } : undefined
											}
										>
											{renderExpandedRow?.(row)}
										</div>
									</td>
								</tr>
							);
						return (
							<tr
								key={"row:" + key}
								aria-rowindex={start + index + 2}
								data-selected={selectedKeys?.has(key) || undefined}
								data-clickable={!!onRowClick || undefined}
								tabIndex={onRowClick ? 0 : undefined}
								onClick={(event) => {
									if (!interactive(event.target)) onRowClick?.(row);
								}}
								onKeyDown={(event) => {
									if (
										event.target === event.currentTarget &&
										(event.key === "Enter" || event.key === " ") &&
										onRowClick
									) {
										event.preventDefault();
										onRowClick(row);
									}
								}}
							>
								{expandable && (
									<td>
										<button
											type="button"
											className="mds-data-table-expand"
											aria-label={expandLabel!(row)}
											aria-expanded={expanded.has(key)}
											onClick={() => toggleExpanded(key)}
										>
											<span aria-hidden="true">{expanded.has(key) ? "−" : "+"}</span>
										</button>
									</td>
								)}
								{selectable && (
									<td>
										<input
											type="checkbox"
											aria-label={selectionLabel!(row)}
											checked={selectedKeys?.has(key) ?? false}
											onChange={() => {
												const next = new Set(selectedKeys);
												if (next.has(key)) next.delete(key);
												else next.add(key);
												onSelectionChange?.(next);
											}}
										/>
									</td>
								)}
								{orderedColumns.map((column) => (
									<td key={column.id} style={columnStyle(column)} data-pinned={column.pinned}>
										<div className="mds-data-table-cell">{column.cell ? column.cell(row) : column.accessor(row)}</div>
									</td>
								))}
							</tr>
						);
					})}
					{spacer(offsets[entries.length] - offsets[end], "after")}
					{!sorted.length && (
						<tr>
							<td colSpan={totalColumns} className="mds-data-table-empty">
								{emptyContent}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
