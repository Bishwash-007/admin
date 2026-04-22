'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useUiStore } from '@/stores';
import { adminMovieService } from '@/services/adminService';
import type { CreateMoviePayload, MovieStatus } from '@/types';

const GENRE_OPTIONS = [
	'Action',
	'Adventure',
	'Animation',
	'Comedy',
	'Crime',
	'Documentary',
	'Drama',
	'Family',
	'Fantasy',
	'Horror',
	'Mystery',
	'Romance',
	'Sci-Fi',
	'Thriller',
	'Western',
];

const LANGUAGE_OPTIONS = [
	'English',
	'Nepali',
	'Hindi',
	'Spanish',
	'French',
	'German',
	'Japanese',
	'Korean',
	'Chinese',
	'Tamil',
	'Telugu',
];

const RATING_OPTIONS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'U/A', 'A'];

const STATUS_OPTIONS: MovieStatus[] = ['upcoming', 'released', 'archived'];

const CreateMovie = () => {
	const router = useRouter();
	const { showToast } = useUiStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [posterInput, setPosterInput] = useState('');
	const [genreInput, setGenreInput] = useState('');

	const [form, setForm] = useState<CreateMoviePayload>({
		title: '',
		description: '',
		releaseDate: new Date().toISOString().split('T')[0],
		durationInMinutes: 120,
		language: 'English',
		genre: [],
		posterUrls: [],
		backdropUrl: '',
		trailerUrl: '',
		imdbId: '',
		imdbRating: undefined,
		letterboxdUrl: '',
		tmdbId: undefined,
		status: 'upcoming',
		isAdult: false,
		director: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const payload: CreateMoviePayload = {
				...form,
				genre: form.genre || [],
				backdropUrl: form.backdropUrl || undefined,
				trailerUrl: form.trailerUrl || undefined,
				imdbId: form.imdbId || undefined,
				letterboxdUrl: form.letterboxdUrl || undefined,
			};

			await adminMovieService.createMovie(payload);
			showToast('Movie created successfully', 'success');
			router.push('/movies');
		} catch {
			showToast('Failed to create movie', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const addPoster = () => {
		if (posterInput.trim()) {
			setForm((prev) => ({
				...prev,
				posterUrls: [...prev.posterUrls, posterInput.trim()],
			}));
			setPosterInput('');
			showToast('Poster URL added', 'success');
		}
	};

	const removePoster = (index: number) => {
		setForm((prev) => ({
			...prev,
			posterUrls: prev.posterUrls.filter((_, i) => i !== index),
		}));
	};

	const addGenre = (genre: string) => {
		if (!form.genre?.includes(genre)) {
			setForm((prev) => ({
				...prev,
				genre: [...(prev.genre || []), genre],
			}));
		}
	};

	const removeGenre = (genre: string) => {
		setForm((prev) => ({
			...prev,
			genre: prev.genre?.filter((g) => g !== genre) || [],
		}));
	};

	return (
		<div className="flex-1 p-8 overflow-y-auto">
			<PageHeader
				title="Create Movie"
				subtitle="Add a new movie to the catalogue"
				action={
					<div className="flex gap-2">
						<Button
							title="Cancel"
							icon={<X size={16} strokeWidth={2.5} />}
							variant="light"
							onClick={() => router.back()}
						/>
						<Button
							title="Save Movie"
							icon={<Save size={16} strokeWidth={2.5} />}
							onClick={(e) => handleSubmit(e as never)}
							type="submit"
							disabled={isSubmitting}
						/>
					</div>
				}
			/>

			<form onSubmit={handleSubmit} className="max-w-4xl">
				{/* Basic Info */}
				<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
					<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
						<h2 className="text-sm font-black uppercase tracking-widest">
							Basic Information
						</h2>
					</div>
					<div className="p-4 space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Title *
								</label>
								<InputField
									name="title"
									value={form.title}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, title: e.target.value }))
									}
									placeholder="Movie title"
									required
								/>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Director *
								</label>
								<InputField
									name="director"
									value={form.director}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, director: e.target.value }))
									}
									placeholder="Director name"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Description *
							</label>
							<textarea
								name="description"
								value={form.description}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, description: e.target.value }))
								}
								placeholder="Movie description"
								rows={4}
								className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none placeholder:font-bold placeholder:text-gray-400 resize-none"
								required
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Release Date *
								</label>
								<InputField
									name="releaseDate"
									type="date"
									value={form.releaseDate}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											releaseDate: e.target.value,
										}))
									}
									required
								/>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Duration (min) *
								</label>
								<InputField
									name="durationInMinutes"
									type="number"
									value={form.durationInMinutes}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											durationInMinutes: Number(e.target.value),
										}))
									}
									required
								/>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Language *
								</label>
								<select
									value={form.language}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, language: e.target.value }))
									}
									className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none cursor-pointer"
								>
									{LANGUAGE_OPTIONS.map((lang) => (
										<option key={lang} value={lang}>
											{lang}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Status *
								</label>
								<select
									value={form.status}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											status: e.target.value as MovieStatus,
										}))
									}
									className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none cursor-pointer"
								>
									{STATUS_OPTIONS.map((status) => (
										<option key={status} value={status}>
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Rating
								</label>
								<select
									value={form.imdbRating || ''}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											imdbRating: e.target.value
												? Number(e.target.value)
												: undefined,
										}))
									}
									className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none cursor-pointer"
								>
									<option value="">Select rating</option>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
										<option key={r} value={r}>
											{r}/10
										</option>
									))}
								</select>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Genres
							</label>
							<div className="flex flex-wrap gap-2 mb-2">
								{form.genre?.map((g) => (
									<span
										key={g}
										className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-black text-white border-2 border-black"
									>
										{g}
										<button
											type="button"
											onClick={() => removeGenre(g)}
											className="hover:text-yellow-300"
										>
											<X size={12} />
										</button>
									</span>
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								{GENRE_OPTIONS.map((genre) => (
									<button
										key={genre}
										type="button"
										onClick={() => addGenre(genre)}
										disabled={form.genre?.includes(genre)}
										className={`px-3 py-1 text-xs font-bold border-2 transition-all ${
											form.genre?.includes(genre)
												? 'bg-black text-white border-black'
												: 'bg-white text-black border-black hover:bg-yellow-50'
										}`}
									>
										{genre}
									</button>
								))}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="isAdult"
								checked={form.isAdult}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, isAdult: e.target.checked }))
								}
								className="w-4 h-4 border-2 border-black accent-black cursor-pointer"
							/>
							<label htmlFor="isAdult" className="text-sm font-bold">
								Adult content (18+)
							</label>
						</div>
					</div>
				</div>

				{/* URLs */}
				<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
					<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
						<h2 className="text-sm font-black uppercase tracking-widest">
							Media URLs
						</h2>
					</div>
					<div className="p-4 space-y-4">
						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Poster URLs
							</label>
							<div className="flex gap-2 mb-2">
								<InputField
									name="posterUrl"
									value={posterInput}
									onChange={(e) => setPosterInput(e.target.value)}
									placeholder="https://example.com/poster.jpg"
									onKeyDown={(e) =>
										e.key === 'Enter' && (e.preventDefault(), addPoster())
									}
								/>
								<Button
									title="Add"
									icon={<Plus size={16} strokeWidth={2.5} />}
									onClick={(e) => {
										e.preventDefault();
										addPoster();
									}}
								/>
							</div>
							{form.posterUrls.length > 0 && (
								<div className="grid grid-cols-4 gap-2 mt-2">
									{form.posterUrls.map((url, i) => (
										<div
											key={i}
											className="relative border-2 border-black group"
										>
											<img
												src={url}
												alt=""
												className="w-full h-32 object-cover"
											/>
											<button
												type="button"
												onClick={() => removePoster(i)}
												className="absolute top-1 right-1 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<Trash2 size={12} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Backdrop URL
							</label>
							<InputField
								name="backdropUrl"
								value={form.backdropUrl || ''}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, backdropUrl: e.target.value }))
								}
								placeholder="https://example.com/backdrop.jpg"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Trailer URL
							</label>
							<InputField
								name="trailerUrl"
								value={form.trailerUrl || ''}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, trailerUrl: e.target.value }))
								}
								placeholder="https://youtube.com/watch?v=..."
							/>
						</div>
					</div>
				</div>

				{/* External IDs */}
				<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
					<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
						<h2 className="text-sm font-black uppercase tracking-widest">
							External IDs
						</h2>
					</div>
					<div className="p-4 space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									IMDB ID
								</label>
								<InputField
									name="imdbId"
									value={form.imdbId || ''}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, imdbId: e.target.value }))
									}
									placeholder="tt1234567"
								/>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									TMDB ID
								</label>
								<InputField
									name="tmdbId"
									type="number"
									value={form.tmdbId || ''}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											tmdbId: e.target.value
												? Number(e.target.value)
												: undefined,
										}))
									}
									placeholder="12345"
								/>
							</div>
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Letterboxd URL
								</label>
								<InputField
									name="letterboxdUrl"
									value={form.letterboxdUrl || ''}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											letterboxdUrl: e.target.value,
										}))
									}
									placeholder="https://letterboxd.com/film/..."
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						title="Cancel"
						icon={<ArrowLeft size={16} strokeWidth={2.5} />}
						variant="light"
						onClick={() => router.back()}
						type="button"
					/>
					<Button
						title={isSubmitting ? 'Creating...' : 'Create Movie'}
						icon={<Save size={16} strokeWidth={2.5} />}
						type="submit"
						disabled={isSubmitting}
					/>
				</div>
			</form>
		</div>
	);
};

export default CreateMovie;
