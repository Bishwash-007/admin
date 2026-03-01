import { create } from 'zustand';
import { movieService } from '../services/movieService';
import { getErrorMessage } from '../lib/axios';
import type {
	Movie,
	MovieSummary,
	MoviesListParams,
	Theater,
	Showtime,
	Seat,
	ReviewsListResponse,
} from '../types';

interface MovieState {
	movies: MovieSummary[];
	currentMovie: Movie | null;
	showtimes: Showtime[];
	reviews: ReviewsListResponse | null;
	theaters: Theater[];
	seats: Seat[];
	totalMovies: number;
	page: number;
	isLoading: boolean;
	error: string | null;

	fetchMovies: (params?: MoviesListParams) => Promise<void>;
	fetchMovie: (id: number) => Promise<void>;
	fetchMovieShowtimes: (movieId: number) => Promise<void>;
	fetchMovieReviews: (
		movieId: number,
		params?: { page?: number; limit?: number },
	) => Promise<void>;
	fetchTheaters: () => Promise<void>;
	fetchScreenSeats: (screenId: number) => Promise<void>;
	clearCurrentMovie: () => void;
	clearError: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
	movies: [],
	currentMovie: null,
	showtimes: [],
	reviews: null,
	theaters: [],
	seats: [],
	totalMovies: 0,
	page: 1,
	isLoading: false,
	error: null,

	fetchMovies: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const result = await movieService.listMovies(params);
			set({
				movies: result.movies as MovieSummary[],
				totalMovies: result.movies.length,
				page: result.page,
				isLoading: false,
			});
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchMovie: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const movie = await movieService.getMovie(id);
			set({ currentMovie: movie, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchMovieShowtimes: async (movieId) => {
		set({ isLoading: true, error: null });
		try {
			const showtimes = await movieService.getMovieShowtimes(movieId);
			set({ showtimes, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchMovieReviews: async (movieId, params) => {
		set({ isLoading: true, error: null });
		try {
			const reviews = await movieService.getMovieReviews(movieId, params);
			set({ reviews, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchTheaters: async () => {
		set({ isLoading: true, error: null });
		try {
			const result = await movieService.listTheaters();
			set({ theaters: result.theaters as Theater[], isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchScreenSeats: async (screenId) => {
		set({ isLoading: true, error: null });
		try {
			const seats = await movieService.getScreenSeats(screenId);
			set({ seats, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	clearCurrentMovie: () =>
		set({ currentMovie: null, showtimes: [], reviews: null, seats: [] }),

	clearError: () => set({ error: null }),
}));
