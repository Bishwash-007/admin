'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Clock, Calendar, Film } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useMovieStore, useUiStore } from '@/stores';
import { adminMovieService } from '@/services/adminService';
import type { CreateShowtimePayload, Screen } from '@/types';
import { formatDuration } from '@/lib/utils';

const CreateShowtime = () => {
	const params = useParams();
	const router = useRouter();
	const movieId = Number(params.id);

	const { theaters, currentMovie, fetchTheaters, fetchMovie } = useMovieStore();
	const { showToast } = useUiStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedTheater, setSelectedTheater] = useState<number | ''>('');
	const [selectedScreen, setSelectedScreen] = useState<number | ''>('');
	const [screens, setScreens] = useState<Screen[]>([]);

	useEffect(() => {
		fetchTheaters();
		fetchMovie(movieId);
	}, [movieId, fetchTheaters, fetchMovie]);

	useEffect(() => {
		if (selectedTheater) {
			const theater = theaters.find((t) => t.id === selectedTheater);
			if (theater) {
				setScreens([]);
				setSelectedScreen('');
			}
		}
	}, [selectedTheater, theaters]);

	const [form, setForm] = useState<CreateShowtimePayload>({
		movieId,
		screenId: 0,
		startTime: '',
		endTime: '',
		basePrice: 100,
	});

	const calculateEndTime = (startTime: string, durationMinutes: number) => {
		if (!startTime || !durationMinutes) return '';
		const start = new Date(startTime);
		start.setMinutes(start.getMinutes() + durationMinutes);
		return start.toISOString().slice(0, 16);
	};

	const handleStartTimeChange = (value: string) => {
		setForm((prev) => ({ ...prev, startTime: value }));
		if (currentMovie?.durationInMinutes) {
			const endTime = calculateEndTime(value, currentMovie.durationInMinutes);
			setForm((prev) => ({ ...prev, endTime }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedScreen) {
			showToast('Please select a screen', 'error');
			return;
		}

		if (!form.startTime || !form.endTime) {
			showToast('Please select start and end times', 'error');
			return;
		}

		if (new Date(form.endTime) <= new Date(form.startTime)) {
			showToast('End time must be after start time', 'error');
			return;
		}

		setIsSubmitting(true);

		try {
			const payload: CreateShowtimePayload = {
				movieId,
				screenId: selectedScreen as number,
				startTime: form.startTime,
				endTime: form.endTime,
				basePrice: form.basePrice,
			};

			await adminMovieService.createShowtime(payload);
			showToast('Showtime created successfully', 'success');
			router.push(`/movies/${movieId}`);
		} catch {
			showToast('Failed to create showtime', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const minDateTime = new Date().toISOString().slice(0, 16);

	return (
		<div className="flex-1 p-8 overflow-y-auto">
			<PageHeader
				title="Create Showtime"
				subtitle={currentMovie ? `Schedule for "${currentMovie.title}"` : 'Schedule a new showtime'}
				action={
					<div className="flex gap-2">
						<Button
							title="Cancel"
							icon={<ArrowLeft size={16} strokeWidth={2.5} />}
							variant="light"
							onClick={() => router.back()}
						/>
						<Button
							title="Save Showtime"
							icon={<Save size={16} strokeWidth={2.5} />}
							onClick={(e) => handleSubmit(e as never)}
							type="submit"
							disabled={isSubmitting}
						/>
					</div>
				}
			/>

			<form onSubmit={handleSubmit} className="max-w-2xl">
				{/* Movie Info */}
				{currentMovie && (
					<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
						<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
							<h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
								<Film size={16} /> Movie Details
							</h2>
						</div>
						<div className="p-4">
							<div className="flex items-start gap-4">
								{currentMovie.posterUrls?.[0] ? (
									<img
										src={currentMovie.posterUrls[0]}
										alt=""
										className="w-20 h-28 object-cover border-2 border-black"
									/>
								) : (
									<div className="w-20 h-28 bg-gray-200 border-2 border-black flex items-center justify-center">
										<Film size={24} className="text-gray-400" />
									</div>
								)}
								<div className="flex-1">
									<h3 className="text-lg font-black">{currentMovie.title}</h3>
									<p className="text-sm text-gray-500 mb-2">
										Directed by {currentMovie.director}
									</p>
									<div className="flex flex-wrap gap-2 text-xs">
										<span className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-black font-bold">
											<Clock size={12} />
											{formatDuration(currentMovie.durationInMinutes)}
										</span>
										<span className="px-2 py-1 bg-gray-100 border border-black font-bold">
											{currentMovie.language}
										</span>
										{currentMovie.genre.slice(0, 2).map((g) => (
											<span
												key={g}
												className="px-2 py-1 bg-gray-100 border border-black font-bold"
											>
												{g}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Theater & Screen Selection */}
				<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
					<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
						<h2 className="text-sm font-black uppercase tracking-widest">
							Theater & Screen
						</h2>
					</div>
					<div className="p-4 space-y-4">
						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Theater *
							</label>
							<select
								value={selectedTheater}
								onChange={(e) => {
									const theaterId = Number(e.target.value);
									setSelectedTheater(theaterId);
								}}
								className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none cursor-pointer"
								required
							>
								<option value="">Select a theater</option>
								{theaters.map((theater) => (
									<option key={theater.id} value={theater.id}>
										{theater.name} - {theater.city}
									</option>
								))}
							</select>
						</div>

						{selectedTheater && (
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Screen *
								</label>
								<select
									value={selectedScreen}
									onChange={(e) => setSelectedScreen(Number(e.target.value))}
									className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none cursor-pointer"
									required
								>
									<option value="">Select a screen</option>
									{screens.map((screen) => (
										<option key={screen.id} value={screen.id}>
											{screen.name} ({screen.totalSeats} seats) - {screen.screenType}
										</option>
									))}
								</select>
								{screens.length === 0 && selectedTheater && (
									<p className="mt-2 text-xs text-gray-500 font-bold">
										No screens available for this theater. Create a screen first.
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Showtime Details */}
				<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-white mb-6">
					<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
						<h2 className="text-sm font-black uppercase tracking-widest">
							Showtime Schedule
						</h2>
					</div>
					<div className="p-4 space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									Start Time *
								</label>
								<div className="relative">
									<Clock
										size={16}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="datetime-local"
										value={form.startTime}
										onChange={(e) => handleStartTimeChange(e.target.value)}
										min={minDateTime}
										className="w-full pl-10 pr-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold uppercase mb-1">
									End Time *
								</label>
								<div className="relative">
									<Clock
										size={16}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="datetime-local"
										value={form.endTime}
										readOnly
										className="w-full pl-10 pr-6 py-2.5 font-bold text-sm border-2 border-black bg-gray-100 shadow-[3px_3px_0_0_#000] outline-none cursor-not-allowed"
									/>
								</div>
								<p className="mt-1 text-xs text-gray-500 font-bold">
									Auto-calculated from movie duration
								</p>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold uppercase mb-1">
								Base Price (NPR) *
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
									NPR
								</span>
								<InputField
									name="basePrice"
									type="number"
									value={form.basePrice}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											basePrice: Number(e.target.value),
										}))
									}
									placeholder="100"
									min="0"
									step="10"
									className="pl-12"
									required
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Summary Card */}
				{form.startTime && selectedScreen && (
					<div className="border-2 border-black shadow-[4px_4px_0_0_#000] bg-green-50 mb-6">
						<div className="bg-black text-white px-4 py-3 border-b-2 border-black">
							<h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
								<Calendar size={16} /> Summary
							</h2>
						</div>
						<div className="p-4">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="text-gray-500 font-bold">Start:</span>{' '}
									<span className="font-black">
										{new Date(form.startTime).toLocaleString('en-GB', {
											dateStyle: 'medium',
											timeStyle: 'short',
										})}
									</span>
								</div>
								<div>
									<span className="text-gray-500 font-bold">End:</span>{' '}
									<span className="font-black">
										{form.endTime &&
											new Date(form.endTime).toLocaleString('en-GB', {
												dateStyle: 'medium',
												timeStyle: 'short',
											})}
									</span>
								</div>
								<div>
									<span className="text-gray-500 font-bold">Screen:</span>{' '}
									<span className="font-black">#{selectedScreen}</span>
								</div>
								<div>
									<span className="text-gray-500 font-bold">Price:</span>{' '}
									<span className="font-black">NPR {form.basePrice}</span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-2">
					<Button
						title="Cancel"
						icon={<ArrowLeft size={16} strokeWidth={2.5} />}
						variant="light"
						onClick={() => router.back()}
						type="button"
					/>
					<Button
						title={isSubmitting ? 'Creating...' : 'Create Showtime'}
						icon={<Save size={16} strokeWidth={2.5} />}
						type="submit"
						disabled={isSubmitting}
					/>
				</div>
			</form>
		</div>
	);
};

export default CreateShowtime;
