'use client';

import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useAdminStore, useUiStore } from '@/stores';
import { UserSummary, UserRole } from '@/types';
import DataTable from '@/components/ui/Table';
import PageHeader from '@/components/PageHeader';

const userColumns: ColumnDef<UserSummary, unknown>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		meta: { type: 'text', editable: true },
		cell: ({ getValue }) => (
			<span className="font-black">{getValue() as string}</span>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		meta: { editable: false },
		cell: ({ getValue }) => (
			<span className="font-bold text-gray-600 text-sm">
				{getValue() as string}
			</span>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		meta: { editable: false },
		cell: ({ getValue }) => {
			const role = getValue() as UserRole;
			return <span className="font-black text-sm capitalize">{role}</span>;
		},
	},
	{
		accessorKey: 'isVerified',
		header: 'Verified',
		meta: {
			type: 'select',
			options: [
				{ label: 'Verified', value: 'true' },
				{ label: 'Unverified', value: 'false' },
			],
		},
		cell: ({ getValue }) => {
			const v = getValue() as boolean;
			return (
				<span
					className={`font-bold text-sm ${
						v ? 'text-green-600' : 'text-red-500'
					}`}
				>
					{v ? '✓ Verified' : '✗ Unverified'}
				</span>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Joined',
		meta: { editable: false },
		cell: ({ getValue }) =>
			new Date(getValue() as string).toLocaleDateString('en-US', {
				dateStyle: 'medium',
			}),
	},
];

const UsersPage = () => {
	const { users, isLoading, fetchUsers } = useAdminStore();
	const { showToast } = useUiStore();

	useEffect(() => {
		let ignore = false;
		if (!ignore) fetchUsers({ page: 1, limit: 50 });
		return () => {
			ignore = true;
		};
	}, [fetchUsers]);

	return (
		<div className="flex-1 p-8">
			<PageHeader title="Users" subtitle="Manage your user accounts" />
			<DataTable
				data={users as unknown as UserSummary[]}
				columns={userColumns}
				isLoading={isLoading}
				actions={{
					onQuickChange: async (row, field, value) => {
						if (field === 'isVerified') {
							// TODO: call API when endpoint is available
							showToast(
								`${row.name} marked as ${
									value === 'true' ? 'verified' : 'unverified'
								}.`,
								'success',
							);
						}
					},
					onDelete: (row) => {
						showToast(`User ${row.name} removed.`, 'warning');
					},
					onBulkDelete: (rows) => {
						showToast(`${rows.length} users removed.`, 'warning');
					},
				}}
			/>
		</div>
	);
};

export default UsersPage;
