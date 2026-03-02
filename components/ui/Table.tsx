'use client';

import React, { useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	Cell,
	RowData,
	SortingState,
	ColumnFiltersState,
	RowSelectionState,
} from '@tanstack/react-table';
import {
	ChevronUp,
	ChevronDown,
	ChevronsUpDown,
	Pencil,
	Trash2,
	Filter,
	X,
	Check,
} from 'lucide-react';

// ─── TanStack meta type augmentation ─────────────────────────────────────────

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		/** Input type for inline editing */
		type?: 'text' | 'number' | 'select' | 'boolean';
		/** Options for type='select' */
		options?: { label: string; value: string }[];
		/** Set false to make this column read-only in edit mode */
		editable?: boolean;
	}
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableAction<TData> {
	onEdit?: (row: TData) => void;
	/** Called when the user saves an inline edit. Receives original + changed fields */
	onSave?: (original: TData, updated: Record<string, unknown>) => void;
	/** Called immediately when a select-type cell changes (no edit mode needed) */
	onQuickChange?: (row: TData, field: string, value: unknown) => void;
	onDelete?: (row: TData) => void;
	onBulkDelete?: (rows: TData[]) => void;
}

export interface DataTableProps<TData> {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	actions?: DataTableAction<TData>;
	isLoading?: boolean;
	/** Number of skeleton rows shown while loading (default 6) */
	skeletonRows?: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Checkbox = ({
	checked,
	indeterminate,
	onChange,
}: {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const ref = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		if (ref.current) ref.current.indeterminate = !!indeterminate;
	}, [indeterminate]);
	return (
		<input
			ref={ref}
			type="checkbox"
			checked={checked}
			onChange={onChange}
			className="w-4 h-4 border-2 border-black accent-black cursor-pointer"
		/>
	);
};

// Reusable neo-brutalism select
export const NBSelect = ({
	value,
	onChange,
	options,
	placeholder,
	className = '',
}: {
	value: string;
	onChange: (v: string) => void;
	options: { label: string; value: string }[];
	placeholder?: string;
	className?: string;
}) => (
	<div className={`relative inline-flex ${className}`}>
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full appearance-none px-3 pr-8 py-1.5 text-xs font-black border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 hover:bg-yellow-50 transition-all duration-150 outline-none cursor-pointer"
		>
			{placeholder && (
				<option value="" disabled hidden>
					{placeholder}
				</option>
			)}
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
		{/* custom chevron */}
		<span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black font-black text-[10px]">
			▾
		</span>
	</div>
);

// Skeleton shimmer row
const SkeletonRow = ({ cols }: { cols: number }) => (
	<tr className="border-b border-black/10">
		{Array.from({ length: cols }).map((_, i) => (
			<td key={i} className="px-4 py-3">
				<div
					className="h-4 rounded-none bg-gray-200 animate-pulse"
					style={{ width: `${60 + (i % 3) * 15}%` }}
				/>
			</td>
		))}
	</tr>
);

// ─── Core Component ───────────────────────────────────────────────────────────

function DataTable<TData>({
	data,
	columns: userColumns,
	actions,
	isLoading = false,
	skeletonRows = 6,
}: DataTableProps<TData>) {
	'use no memo';

	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [showColumnFilters, setShowColumnFilters] = useState(false);

	// ── Inline editing state ──────────────────────────────────────────────────
	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [editValues, setEditValues] = useState<Record<string, unknown>>({});

	const startEdit = (rowId: string, original: TData) => {
		setEditingRowId(rowId);
		setEditValues({ ...(original as object) });
	};

	const cancelEdit = () => {
		setEditingRowId(null);
		setEditValues({});
	};

	const saveEdit = (original: TData) => {
		actions?.onSave?.(original, editValues);
		setEditingRowId(null);
		setEditValues({});
	};

	// ── Selection column ──────────────────────────────────────────────────────
	const selectionColumn: ColumnDef<TData, unknown> = {
		id: '__select__',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				indeterminate={table.getIsSomePageRowsSelected()}
				onChange={table.getToggleAllPageRowsSelectedHandler() as never}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler() as never}
			/>
		),
		enableSorting: false,
		enableColumnFilter: false,
		size: 40,
	};

	// ── Actions column ────────────────────────────────────────────────────────
	const actionsColumn: ColumnDef<TData, unknown> = {
		id: '__actions__',
		header: () => (
			<span className="text-xs font-bold uppercase tracking-widest">
				Actions
			</span>
		),
		cell: ({ row }) => {
			const isEditing = editingRowId === row.id;
			return (
				<div className="flex items-center gap-2">
					{isEditing ? (
						<>
							<button
								onClick={() => saveEdit(row.original)}
								className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold border-2 border-black bg-green-300 shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
							>
								<Check size={12} /> Save
							</button>
							<button
								onClick={cancelEdit}
								className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
							>
								<X size={12} /> Cancel
							</button>
						</>
					) : (
						<>
							{(actions?.onEdit || actions?.onSave) && (
								<button
									onClick={() => {
										if (actions?.onSave) {
											startEdit(row.id, row.original);
										} else {
											actions?.onEdit?.(row.original);
										}
									}}
									className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
								>
									<Pencil size={12} /> Edit
								</button>
							)}
							{actions?.onDelete && (
								<button
									onClick={() => actions.onDelete!(row.original)}
									className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold border-2 border-black bg-red-300 shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
								>
									<Trash2 size={12} /> Delete
								</button>
							)}
						</>
					)}
				</div>
			);
		},
		enableSorting: false,
		enableColumnFilter: false,
	};

	const columns: ColumnDef<TData, unknown>[] = [
		selectionColumn,
		...userColumns,
		...(actions?.onEdit || actions?.onSave || actions?.onDelete
			? [actionsColumn]
			: []),
	];

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter, columnFilters, rowSelection },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
	});

	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

	// ─── Inline cell renderer ─────────────────────────────────────────────────
	const renderCell = (cell: Cell<TData, unknown>, rowId: string) => {
		const isEditing = editingRowId === rowId;
		const meta = cell.column.columnDef.meta;
		const accessorKey = cell.column.id;
		const isSystemCol =
			accessorKey === '__select__' || accessorKey === '__actions__';
		const isEditable = meta?.editable !== false && !isSystemCol;

		// select columns are ALWAYS interactive — no edit mode required
		if (meta?.type === 'select' && meta.options && isEditable) {
			const currentVal = String(cell.getValue() ?? '');
			return (
				<NBSelect
					value={currentVal}
					onChange={(v) =>
						actions?.onQuickChange?.(cell.row.original, accessorKey, v)
					}
					options={meta.options}
				/>
			);
		}

		if (!isEditing || !isEditable) {
			return flexRender(cell.column.columnDef.cell, cell.getContext());
		}

		const currentVal = (editValues[accessorKey] ?? '') as string;

		if (meta?.type === 'boolean') {
			return (
				<input
					type="checkbox"
					checked={!!editValues[accessorKey]}
					onChange={(e) =>
						setEditValues((prev) => ({
							...prev,
							[accessorKey]: e.target.checked,
						}))
					}
					className="w-4 h-4 border-2 border-black accent-black cursor-pointer"
				/>
			);
		}

		return (
			<input
				type={meta?.type === 'number' ? 'number' : 'text'}
				value={currentVal}
				onChange={(e) =>
					setEditValues((prev) => ({
						...prev,
						[accessorKey]:
							meta?.type === 'number' ? Number(e.target.value) : e.target.value,
					}))
				}
				className="w-full min-w-20 px-2 py-1 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all duration-150 outline-none"
			/>
		);
	};

	return (
		<div className="flex flex-col gap-0 border-2 border-black shadow-[4px_4px_0_0_#000]">
			{/* ── Toolbar ──────────────────────────────────────── */}
			<div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b-2 border-black bg-white">
				<input
					value={globalFilter ?? ''}
					onChange={(e) => setGlobalFilter(e.target.value)}
					placeholder="Search all columns…"
					className="px-4 py-2 text-sm font-bold border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-0.75 focus:translate-y-0.75 transition-all duration-150 outline-none placeholder:font-bold placeholder:text-gray-400 w-64"
				/>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowColumnFilters((v) => !v)}
						className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 border-black transition-all duration-150 shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 ${
							showColumnFilters ? 'bg-yellow-300' : 'bg-white'
						}`}
					>
						<Filter size={13} /> Column Filters
					</button>

					{selectedRows.length > 0 && actions?.onBulkDelete && (
						<button
							onClick={() => {
								actions.onBulkDelete!(selectedRows);
								setRowSelection({});
							}}
							className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 border-black bg-red-300 shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all duration-150"
						>
							<Trash2 size={13} /> Delete {selectedRows.length} selected
						</button>
					)}

					{selectedRows.length > 0 && (
						<button
							onClick={() => setRowSelection({})}
							className="flex items-center gap-1 px-2 py-2 text-xs font-bold border-2 border-black bg-white shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all duration-150"
						>
							<X size={13} />
						</button>
					)}
				</div>
			</div>

			{/* ── Table ────────────────────────────────────────── */}
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr
								key={hg.id}
								className="border-b-2 border-black bg-black text-white"
							>
								{hg.headers.map((header) => (
									<th
										key={header.id}
										style={{
											width:
												header.getSize() !== 150 ? header.getSize() : undefined,
										}}
										className="px-4 py-3 text-left font-black text-xs uppercase tracking-widest whitespace-nowrap select-none"
									>
										{header.isPlaceholder ? null : (
											<div
												className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
												onClick={header.column.getToggleSortingHandler()}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{header.column.getCanSort() && (
													<span className="ml-1 opacity-60">
														{header.column.getIsSorted() === 'asc' ? (
															<ChevronUp size={13} />
														) : header.column.getIsSorted() === 'desc' ? (
															<ChevronDown size={13} />
														) : (
															<ChevronsUpDown size={13} />
														)}
													</span>
												)}
											</div>
										)}
									</th>
								))}
							</tr>
						))}

						{/* ── Column filter row ──────────────────── */}
						{showColumnFilters && (
							<tr className="border-b-2 border-black bg-yellow-50">
								{table.getHeaderGroups()[0]?.headers.map((header) => (
									<th key={header.id} className="px-3 py-2">
										{header.column.getCanFilter() ? (
											// Use select for columns that have options defined
											header.column.columnDef.meta?.options ? (
												<NBSelect
													value={
														(header.column.getFilterValue() as string) ?? ''
													}
													onChange={(v) =>
														header.column.setFilterValue(v || undefined)
													}
													options={[
														{ label: 'All', value: '' },
														...(header.column.columnDef.meta.options ?? []),
													]}
													className="w-full"
												/>
											) : (
												<input
													value={
														(header.column.getFilterValue() as string) ?? ''
													}
													onChange={(e) =>
														header.column.setFilterValue(
															e.target.value || undefined,
														)
													}
													placeholder="Filter…"
													className="w-full px-2 py-1 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all duration-150 outline-none placeholder:text-gray-400"
												/>
											)
										) : null}
									</th>
								))}
							</tr>
						)}
					</thead>

					<tbody>
						{isLoading ? (
							Array.from({ length: skeletonRows }).map((_, i) => (
								<SkeletonRow key={i} cols={columns.length} />
							))
						) : table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-12 text-center font-bold text-gray-400 border-b border-black/10"
								>
									No results found.
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row, i) => (
								<tr
									key={row.id}
									className={`border-b border-black/10 transition-colors ${
										editingRowId === row.id
											? 'bg-yellow-50 ring-2 ring-inset ring-black'
											: row.getIsSelected()
												? 'bg-yellow-100'
												: i % 2 === 0
													? 'bg-white'
													: 'bg-gray-50'
									} hover:bg-yellow-50`}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="px-4 py-2.5 font-medium text-sm"
										>
											{renderCell(cell, row.id)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* ── Pagination ───────────────────────────────────── */}
			<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t-2 border-black bg-white">
				<span className="text-xs font-bold text-gray-600">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected
				</span>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold">Rows</span>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => table.setPageSize(Number(e.target.value))}
							className="px-2 py-1.5 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0_0_#000] outline-none cursor-pointer"
						>
							{[10, 20, 30, 50, 100].map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</div>

					<span className="text-xs font-bold">
						Page {table.getState().pagination.pageIndex + 1} /{' '}
						{table.getPageCount()}
					</span>

					<div className="flex items-center gap-1">
						{[
							{
								label: '«',
								action: () => table.setPageIndex(0),
								disabled: !table.getCanPreviousPage(),
							},
							{
								label: '‹',
								action: () => table.previousPage(),
								disabled: !table.getCanPreviousPage(),
							},
							{
								label: '›',
								action: () => table.nextPage(),
								disabled: !table.getCanNextPage(),
							},
							{
								label: '»',
								action: () => table.setPageIndex(table.getPageCount() - 1),
								disabled: !table.getCanNextPage(),
							},
						].map(({ label, action, disabled }) => (
							<button
								key={label}
								onClick={action}
								disabled={disabled}
								className="w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-black bg-white shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0_0_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DataTable;
