'use client';

import { useEffect } from 'react';
import StatsCard from '@/components/home/StatsCard';
import DataTable from '@/components/ui/Table';
import { ColumnDef } from '@tanstack/react-table';
import { BookingStatus, AdminBookingSummary } from '@/types';
import { useAdminStore, useUiStore } from '@/stores';
import { DollarSign, Ticket, Users } from 'lucide-react';

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
			<span className="font-black">{getValue() as string}</span>
		),
	},
	{
		accessorKey: 'totalAmount',
		header: 'Amount',
		meta: { type: 'text' },
		cell: ({ getValue }) => (
			<span className="font-bold">{getValue() as string}</span>
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
		header: 'Date',
		meta: { editable: false },
		cell: ({ getValue }) =>
			new Date(getValue() as string).toLocaleString('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short',
			}),
	},
];

const HomePage = () => {
	const { allBookings, isLoading, fetchAllBookings, updateBookingStatus } =
		useAdminStore();
	const { showToast } = useUiStore();

	useEffect(() => {
		let ignore = false;
		if (!ignore) fetchAllBookings({ page: 1, limit: 10 });
		return () => {
			ignore = true;
		};
	}, [fetchAllBookings]);

	return (
		<div className="flex-1 p-8 flex flex-col gap-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<StatsCard
					title="Total Revenue"
					value="$48,200"
					icon={<DollarSign size={16} />}
					trend={12.4}
					trendLabel="vs last month"
					accentColor="bg-yellow-300"
				/>
				<StatsCard
					title="Tickets Sold"
					value="3,840"
					icon={<Ticket size={16} />}
					trend={-4.2}
					trendLabel="vs last month"
					accentColor="bg-cyan-300"
				/>
				<StatsCard
					title="Active Users"
					value="1,209"
					icon={<Users size={16} />}
					trend={8.1}
					trendLabel="vs last month"
					accentColor="bg-pink-300"
				/>
			</div>

			<div>
				<h2 className="text-lg font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">
					Recent Bookings
				</h2>
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
										`Booking ${row.bookingNumber} status updated to "${value}".`,
										'success',
									);
								}
							} catch {
								showToast('Failed to update booking status.', 'error');
							}
						},
						onSave: (original, updated) => {
							console.log('save', original, updated);
							showToast(
								`Booking ${original.bookingNumber} updated.`,
								'success',
							);
						},
						onDelete: (row) => {
							console.log('delete', row);
							showToast(`Booking ${row.bookingNumber} deleted.`, 'warning');
						},
						onBulkDelete: (rows) => {
							console.log('bulk delete', rows);
							showToast(`${rows.length} bookings deleted.`, 'warning');
						},
					}}
				/>
			</div>
		</div>
	);
};

export default HomePage;
