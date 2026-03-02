'use client';

import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useAdminStore, useUiStore } from '@/stores';
import { AdminBookingSummary, BookingStatus } from '@/types';
import DataTable from '@/components/ui/Table';
import PageHeader from '@/components/PageHeader';

const STATUS_STYLES: Record<BookingStatus, string> = {
	confirmed: 'bg-green-300',
	pending: 'bg-yellow-300',
	cancelled: 'bg-red-300',
	failed: 'bg-gray-200',
};

const BOOKING_STATUS_OPTIONS = [
	{ label: 'Confirmed', value: 'confirmed' },
	{ label: 'Pending', value: 'pending' },
	{ label: 'Cancelled', value: 'cancelled' },
	{ label: 'Failed', value: 'failed' },
];

const bookingColumns: ColumnDef<AdminBookingSummary, unknown>[] = [
	{
		accessorKey: 'bookingNumber',
		header: 'Booking #',
		meta: { editable: false },
		cell: ({ getValue }) => (
			<span className="font-black text-xs tracking-wide">
				{getValue() as string}
			</span>
		),
	},
	{
		id: 'customer',
		header: 'Customer',
		meta: { editable: false },
		cell: ({ row }) => {
			const name = row.original.userName;
			const email = row.original.userEmail;
			if (!name && !email)
				return <span className="font-bold text-gray-400">—</span>;
			return (
				<div className="flex flex-col gap-0.5">
					{name && <span className="font-black text-sm">{name}</span>}
					{email && (
						<span className="text-xs font-bold text-gray-500">{email}</span>
					)}
				</div>
			);
		},
	},
	{
		id: 'movie',
		header: 'Movie',
		meta: { editable: false },
		cell: ({ row }) => {
			const title = row.original.movieTitle;
			const start = row.original.showtimeStart;
			if (!title) return <span className="font-bold text-gray-400">—</span>;
			return (
				<div className="flex flex-col gap-0.5">
					<span className="font-black text-sm">{title}</span>
					{start && (
						<span className="text-xs font-bold text-gray-500">
							{new Date(start).toLocaleString('en-US', {
								dateStyle: 'short',
								timeStyle: 'short',
							})}
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'totalAmount',
		header: 'Amount',
		meta: { editable: false },
		cell: ({ getValue }) => (
			<span className="font-black">NPR {getValue() as string}</span>
		),
	},
	{
		accessorKey: 'bookingStatus',
		header: 'Status',
		meta: { type: 'select', options: BOOKING_STATUS_OPTIONS },
		cell: ({ getValue }) => {
			const status = getValue() as BookingStatus;
			return (
				<span
					className={`inline-block px-2 py-0.5 text-xs font-black uppercase tracking-widest border-2 border-black ${STATUS_STYLES[status]}`}
				>
					{status}
				</span>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Booked At',
		meta: { editable: false },
		cell: ({ getValue }) =>
			new Date(getValue() as string).toLocaleString('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short',
			}),
	},
];

const BookingsPage = () => {
	const { allBookings, isLoading, fetchAllBookings, updateBookingStatus } =
		useAdminStore();
	const { showToast } = useUiStore();

	useEffect(() => {
		let ignore = false;
		if (!ignore) fetchAllBookings({ page: 1, limit: 50 });
		return () => {
			ignore = true;
		};
	}, [fetchAllBookings]);

	return (
		<div className="flex-1 p-8">
			<PageHeader
				title="Bookings"
				subtitle="View and manage all customer bookings"
			/>
			<DataTable
				data={allBookings}
				columns={bookingColumns}
				isLoading={isLoading}
				actions={{
					onQuickChange: async (row, field, value) => {
						try {
							if (field === 'bookingStatus') {
								await updateBookingStatus(row.id, value as BookingStatus);
								showToast(
									`Booking ${row.bookingNumber} updated to "${value}".`,
									'success',
								);
							}
						} catch {
							showToast('Failed to update booking status.', 'error');
						}
					},
					onDelete: (row) => {
						showToast(`Booking ${row.bookingNumber} deleted.`, 'warning');
					},
					onBulkDelete: (rows) => {
						showToast(`${rows.length} bookings deleted.`, 'warning');
					},
				}}
			/>
		</div>
	);
};

export default BookingsPage;
