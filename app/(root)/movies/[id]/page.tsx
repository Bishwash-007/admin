'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
	Film,
	Clock,
	Calendar,
	Star,
	Link as LinkIcon,
	Edit,
	Plus,
	ArrowLeft,
	Video,
	MessageSquare,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/Table';
import { useMovieStore, useUiStore } from '@/stores';
import { formatDuration, formatDateTime, bookingStatusMeta } from '@/lib/utils';
import type { Showtime, Review } from '@/types';

const MovieDetail = () => {
	const params = useParams();
	const router = useRouter();
	const movieId = Number(params.id);

	const {
		currentMovie,
		showtimes,
		reviews,
		isLoading,
		fetchMovie,
		fetchMovieShowtimes,
		fetchMovieReviews,
		clearCurrentMovie,
	} = useMovieStore();
	const { showToast } = useUiStore();

	useEffect(() => {
		fetchMovie(movieId);
		fetchMovieShowtimes(movieId);
		fetchMovieReviews(movieId);

		return () => clearCurrentMovie();
	}, [
		movieId,
		fetchMovie,
		fetchMovieShowtimes,
		fetchMovieReviews,
		clearCurrentMovie,
	]);

	const showtimeColumns: ColumnDef<Showtime>[] = useMemo(
		() => [
			{
				accessorKey: 'startTime',
				header: 'Start Time',
				cell: ({ getValue }) => (
					<span className="font-mono">
						{formatDateTime(getValue() as string)}
					</span>
				),
			},
			{
				accessorKey: 'endTime',
				header: 'End Time',
				cell: ({ getValue }) => (
					<span className="font-mono">
						{formatDateTime(getValue() as string)}
					</span>
				),
			},
			{
				accessorKey: 'screenId',
				header: 'Screen ID',
				cell: ({ getValue }) => (
					<span className="font-bold">#{getValue() as number}</span>
				),
			},
			{
				accessorKey: 'basePrice',
				header: 'Base Price',
				cell: ({ getValue }) => (
					<span className="font-bold">NPR {getValue() as string}</span>
				),
			},
			{
				accessorKey: 'isActive',
				header: 'Status',
				cell: ({ getValue }) => {
					const status = (getValue() as boolean) ? 'active' : 'inactive';
					const meta = bookingStatusMeta(status);
					return (
						<span
							className={`inline-flex px-2 py-1 text-xs font-bold uppercase ${meta.colour} border-2 border-black`}
						>
							{meta.label}
						</span>
					);
				},
			},
		],
		[],
	);

	const reviewColumns: ColumnDef<Review>[] = useMemo(
		() => [
			{
				accessorKey: 'userId',
				header: 'User ID',
				cell: ({ getValue }) => (
					<span className="font-bold">#{getValue() as number}</span>
				),
			},
			{
				accessorKey: 'rating',
				header: 'Rating',
				cell: ({ getValue }) => {
					const rating = getValue() as number;
					return (
						<div className="flex items-center gap-1">
							<Star size={14} className="fill-yellow-400 text-yellow-400" />
							<span className="font-bold">{rating}/10</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'comment',
				header: 'Comment',
				cell: ({ getValue }) => (
					<span className="text-gray-600">{(getValue() as string) || '—'}</span>
				),
			},
			{
				accessorKey: 'createdAt',
				header: 'Date',
				cell: ({ getValue }) => (
					<span className="font-mono text-sm">
						{formatDateTime(getValue() as string)}
					</span>
				),
			},
		],
		[],
	);

	if (!currentMovie) {
		return;
	}

	return (
		<div className="flex-1 p-8 overflow-y-auto">
			<PageHeader
				title={currentMovie.title}
				subtitle={currentMovie.slug}
				action={
					<div className="flex gap-2">
						<Button
							title="Back"
							icon={<ArrowLeft size={16} strokeWidth={2.5} />}
							variant="light"
							onClick={() => router.push('/movies')}
						/>
						<Button
							title="Edit Movie"
							icon={<Edit size={16} strokeWidth={2.5} />}
							onClick={() => router.push(`/movies/${movieId}/edit`)}
						/>
						<Button
							title="Add Showtime"
							icon={<Plus size={16} strokeWidth={2.5} />}
							onClick={() => router.push(`/movies/${movieId}/showtimes/create`)}
						/>
					</div>
				}
			/>

			{/* Movie Info Card */}
			<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
				<div className="flex">
					{/* Poster */}
					<div className="w-48 shrink-0 border-r-2 border-black bg-gray-100">
						{currentMovie.posterUrls?.[0] ? (
							<img
								src={currentMovie.posterUrls[0]}
								alt={currentMovie.title}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-64 flex items-center justify-center text-gray-400">
								<Film size={48} />
							</div>
						)}
					</div>

					{/* Details */}
					<div className="flex-1 p-6">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h2 className="text-2xl font-black">{currentMovie.title}</h2>
								<p className="text-gray-500 font-medium">
									Directed by {currentMovie.director}
								</p>
							</div>
							<div className="flex flex-col items-end gap-2">
								{currentMovie.rating && (
									<span className="px-3 py-1 text-sm font-black bg-yellow-300 border-2 border-black">
										Rated {currentMovie.rating}
									</span>
								)}
								<span
									className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black ${
										currentMovie.status === 'released'
											? 'bg-green-300'
											: currentMovie.status === 'upcoming'
												? 'bg-blue-300'
												: 'bg-gray-300'
									}`}
								>
									{currentMovie.status}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="flex items-center gap-2">
								<Clock size={18} className="text-gray-500" />
								<span className="font-bold">
									{formatDuration(currentMovie.durationInMinutes)}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar size={18} className="text-gray-500" />
								<span className="font-bold">
									{new Date(currentMovie.releaseDate).toLocaleDateString(
										'en-GB',
									)}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Star size={18} className="text-yellow-500" />
								<span className="font-bold">
									{currentMovie.imdbRating
										? `${currentMovie.imdbRating}/10`
										: 'No rating'}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Film size={18} className="text-gray-500" />
								<span className="font-bold">{currentMovie.language}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mb-4">
							{currentMovie.genre.map((g) => (
								<span
									key={g}
									className="px-3 py-1 text-xs font-bold bg-gray-100 border-2 border-black"
								>
									{g}
								</span>
							))}
						</div>

						<div className="mb-4">
							<h3 className="text-xs font-bold uppercase text-gray-500 mb-1">
								Description
							</h3>
							<p className="font-medium text-sm leading-relaxed">
								{currentMovie.description}
							</p>
						</div>

						{(currentMovie.trailerUrl ||
							currentMovie.imdbId ||
							currentMovie.letterboxdUrl) && (
							<div className="flex flex-wrap gap-4 pt-4 border-t-2 border-black/10">
								{currentMovie.trailerUrl && (
									<a
										href={currentMovie.trailerUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
									>
										<Video size={16} /> Watch Trailer
									</a>
								)}
								{currentMovie.imdbId && (
									<a
										href={`https://imdb.com/title/${currentMovie.imdbId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm font-bold text-yellow-600 hover:underline"
									>
										<LinkIcon size={16} /> IMDB
									</a>
								)}
								{currentMovie.letterboxdUrl && (
									<a
										href={currentMovie.letterboxdUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm font-bold text-green-600 hover:underline"
									>
										<LinkIcon size={16} /> Letterboxd
									</a>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Showtimes */}
			<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
				<div className="bg-black text-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
					<h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
						<Clock size={16} /> Showtimes
					</h2>
					<span className="text-xs font-bold bg-white text-black px-2 py-0.5">
						{showtimes.length} total
					</span>
				</div>
				{showtimes.length > 0 ? (
					<DataTable data={showtimes} columns={showtimeColumns} />
				) : (
					<div className="p-8 text-center text-gray-500 font-bold">
						<MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
						No showtimes scheduled
					</div>
				)}
			</div>

			{/* Reviews */}
			<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white">
				<div className="bg-black text-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
					<h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
						<MessageSquare size={16} /> Reviews
					</h2>
					<span className="text-xs font-bold bg-white text-black px-2 py-0.5">
						{reviews?.reviews.length || 0} total
					</span>
				</div>
				{reviews?.reviews && reviews.reviews.length > 0 ? (
					<DataTable data={reviews.reviews} columns={reviewColumns} />
				) : (
					<div className="p-8 text-center text-gray-500 font-bold">
						<MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
						No reviews yet
					</div>
				)}
			</div>
		</div>
	);
};

export default MovieDetail;
