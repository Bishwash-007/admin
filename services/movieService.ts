import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	Movie,
	MoviesListParams,
	MoviesListResponse,
	ReviewsListResponse,
	Showtime,
	TheatersListResponse,
	Seat,
	Screen,
} from '../types';

export const movieService = {
	listMovies: async (
		params?: MoviesListParams,
	): Promise<MoviesListResponse> => {
		const { data } = await api.get<ApiResponse<MoviesListResponse>>(
			ENDPOINTS.movies.list,
			{ params },
		);
		return data.data;
	},

	getMovie: async (id: number): Promise<Movie> => {
		const { data } = await api.get<ApiResponse<Movie>>(
			ENDPOINTS.movies.detail(id),
		);
		return data.data;
	},

	getMovieReviews: async (
		id: number,
		params?: { page?: number; limit?: number },
	): Promise<ReviewsListResponse> => {
		const { data } = await api.get<ApiResponse<ReviewsListResponse>>(
			ENDPOINTS.movies.reviews(id),
			{ params },
		);
		return data.data;
	},

	getMovieShowtimes: async (id: number): Promise<Showtime[]> => {
		const { data } = await api.get<ApiResponse<Showtime[]>>(
			ENDPOINTS.movies.showtimes(id),
		);
		return data.data;
	},

	listTheaters: async (): Promise<TheatersListResponse> => {
		const { data } = await api.get<ApiResponse<TheatersListResponse>>(
			ENDPOINTS.movies.theaters,
		);
		return data.data;
	},

	listScreens: async (theaterId?: number): Promise<Screen[]> => {
		const { data } = await api.get<ApiResponse<Screen[]>>(
			ENDPOINTS.movies.screens,
			{ params: theaterId ? { theaterId } : undefined },
		);
		return data.data;
	},

	getScreenSeats: async (screenId: number): Promise<Seat[]> => {
		const { data } = await api.get<ApiResponse<Seat[]>>(
			ENDPOINTS.movies.screenSeats(screenId),
		);
		return data.data;
	},
};
