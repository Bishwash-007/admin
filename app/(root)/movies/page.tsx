'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Film, Plus, Eye } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useMovieStore, useUiStore } from '@/stores';
import { adminMovieService } from '@/services/adminService';
import { useAuthStore } from '@/stores';
import type { MovieSummary } from '@/types';
import { formatDuration, bookingStatusMeta } from '@/lib/utils';

const MoviesPage = () => {
	const router = useRouter();
	const { movies, totalMovies, isLoading, fetchMovies } = useMovieStore();
	const { showToast } = useUiStore();
	const { user } = useAuthStore();

	useEffect(() => {
		fetchMovies();
	}, [fetchMovies]);

	const handleDelete = async (movie: MovieSummary) => {
		if (!confirm(`Delete "${movie.title}"? This cannot be undone.`)) return;

		try {
			await adminMovieService.deleteMovie(movie.id);
			showToast(`"${movie.title}" deleted successfully`, 'success');
			fetchMovies();
		} catch {
			showToast('Failed to delete movie', 'error');
		}
	};

	const columns: ColumnDef<MovieSummary>[] = useMemo(
		() => [
			{
				accessorKey: 'posterUrls',
				header: 'Poster',
				size: 80,
				cell: ({ row, getValue }) => {
					const posters = getValue() as string[];
					return (
						<div
							className="w-10 h-14 bg-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
							onClick={() => router.push(`/movies/${row.original.id}`)}
						>
							{posters?.[0] ? (
								<img
									src={posters[0]}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									<Film size={16} />
								</div>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'title',
				header: 'Title',
				size: 200,
				cell: ({ row }) => (
					<div
						className="cursor-pointer group"
						onClick={() => router.push(`/movies/${row.original.id}`)}
					>
						<div className="font-bold text-black group-hover:underline decoration-2">
							{row.original.title}
						</div>
						<div className="text-xs text-gray-500">{row.original.slug}</div>
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 100,
				cell: ({ getValue }) => {
					const status = getValue() as string;
					const meta = bookingStatusMeta(status);
					return (
						<span
							className={`inline-flex px-2 py-1 text-xs font-bold uppercase tracking-wider ${meta.colour} border-2 border-black`}
						>
							{meta.label}
						</span>
					);
				},
				filterFn: 'equals',
				meta: {
					type: 'select',
					options: [
						{ label: 'Upcoming', value: 'upcoming' },
						{ label: 'Released', value: 'released' },
						{ label: 'Archived', value: 'archived' },
					],
				},
			},
			// {
			// 	accessorKey: 'genre',
			// 	header: 'Genre',
			// 	size: 150,
			// 	cell: ({ getValue }) => {
			// 		const genre = getValue() as string[];
			// 		return (
			// 			<div className="flex flex-wrap gap-1">
			// 				{genre.slice(0, 2).map((g) => (
			// 					<span
			// 						key={g}
			// 						className="px-2 py-0.5 text-xs font-bold bg-gray-100 border border-black"
			// 					>
			// 						{g}
			// 					</span>
			// 				))}
			// 				{genre.length > 2 && (
			// 					<span className="px-2 py-0.5 text-xs font-bold text-gray-500">
			// 						+{genre.length - 2}
			// 					</span>
			// 				)}
			// 			</div>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'durationInMinutes',
				header: 'Duration',
				size: 90,
				cell: ({ getValue }) => {
					const duration = getValue() as number;
					return (
						<span className="font-semibold text-sm">
							{formatDuration(duration)}
						</span>
					);
				},
			},
			{
				accessorKey: 'language',
				header: 'Language',
				size: 100,
				cell: ({ getValue }) => (
					<span className="font-bold">{getValue() as string}</span>
				),
				filterFn: 'includesString',
			},
			// {
			// 	accessorKey: 'rating',
			// 	header: 'Rating',
			// 	size: 80,
			// 	cell: ({ getValue }) => {
			// 		const rating = getValue() as string | null;
			// 		return rating ? (
			// 			<span className="px-2 py-1 text-xs font-black bg-yellow-300 border-2 border-black">
			// 				{rating}
			// 			</span>
			// 		) : (
			// 			<span className="text-gray-400">—</span>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'releaseDate',
				header: 'Release Date',
				size: 120,
				cell: ({ getValue }) =>
					new Date(getValue() as string).toLocaleString('en-US', {
						dateStyle: 'medium',
					}),
			},
			// {
			// 	accessorKey: 'director',
			// 	header: 'Director',
			// 	size: 150,
			// 	cell: ({ getValue }) => (
			// 		<span className="font-bold">{getValue() as string}</span>
			// 	),
			// 	filterFn: 'includesString',
			// },
		],
		[router],
	);

	return (
		<div className="flex-1 p-8 overflow-y-auto">
			<PageHeader
				title="Movies"
				subtitle={`Manage your movie catalogue (${totalMovies} total)`}
				action={
					<Button
						title="Add Movie"
						icon={<Plus size={16} strokeWidth={2.5} />}
						onClick={() => router.push('/movies/create')}
					/>
				}
			/>

			<DataTable
				data={movies}
				columns={columns}
				isLoading={isLoading}
				actions={{
					onEdit: (movie) => router.push(`/movies/${movie.id}/edit`),
					onDelete: handleDelete,
				}}
			/>

			{/* Quick stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
				<div className="p-4 border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
					<div className="text-xs font-bold text-gray-500 uppercase">Total</div>
					<div className="text-2xl font-black">{totalMovies}</div>
				</div>
				<div className="p-4 border-2 border-black bg-blue-50 shadow-[4px_4px_0_0_#000]">
					<div className="text-xs font-bold text-gray-500 uppercase">
						Upcoming
					</div>
					<div className="text-2xl font-black">
						{movies.filter((m) => m.status === 'upcoming').length}
					</div>
				</div>
				<div className="p-4 border-2 border-black bg-green-50 shadow-[4px_4px_0_0_#000]">
					<div className="text-xs font-bold text-gray-500 uppercase">
						Released
					</div>
					<div className="text-2xl font-black">
						{movies.filter((m) => m.status === 'released').length}
					</div>
				</div>
				<div className="p-4 border-2 border-black bg-gray-50 shadow-[4px_4px_0_0_#000]">
					<div className="text-xs font-bold text-gray-500 uppercase">
						Archived
					</div>
					<div className="text-2xl font-black">
						{movies.filter((m) => m.status === 'archived').length}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MoviesPage;
