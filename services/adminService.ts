import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	User,
	UsersListParams,
	UsersListResponse,
	UpdateUserRolePayload,
	Movie,
	MoviesListParams,
	MoviesListResponse,
	CreateMoviePayload,
	UpdateMoviePayload,
	Theater,
	CreateTheaterPayload,
	Screen,
	CreateScreenPayload,
	Showtime,
	CreateShowtimePayload,
	Booking,
	BookingSummary,
	BookingStatus,
	BookingsListParams,
	BookingsListResponse,
	UpdateBookingStatusResponse,
	DiscountCode,
	CreateDiscountCodePayload,
} from '../types';

export const adminUserService = {
	listUsers: async (params?: UsersListParams): Promise<UsersListResponse> => {
		const { data } = await api.get<ApiResponse<UsersListResponse>>(
			ENDPOINTS.admin.users,
			{ params },
		);
		return data.data;
	},

	updateUserRole: async (
		id: number,
		payload: UpdateUserRolePayload,
	): Promise<User> => {
		const { data } = await api.put<ApiResponse<User>>(
			ENDPOINTS.admin.userRole(id),
			payload,
		);
		return data.data;
	},
};

export const adminMovieService = {
	listMovies: async (
		params?: MoviesListParams,
	): Promise<MoviesListResponse> => {
		const { data } = await api.get<ApiResponse<MoviesListResponse>>(
			ENDPOINTS.admin.movies,
			{ params },
		);
		return data.data;
	},

	createMovie: async (payload: CreateMoviePayload): Promise<Movie> => {
		const { data } = await api.post<ApiResponse<Movie>>(
			ENDPOINTS.admin.movies,
			payload,
		);
		return data.data;
	},

	updateMovie: async (
		id: number,
		payload: UpdateMoviePayload,
	): Promise<Movie> => {
		const { data } = await api.put<ApiResponse<Movie>>(
			ENDPOINTS.admin.movie(id),
			payload,
		);
		return data.data;
	},

	deleteMovie: async (id: number): Promise<void> => {
		await api.delete(ENDPOINTS.admin.movie(id));
	},

	createShowtime: async (payload: CreateShowtimePayload): Promise<Showtime> => {
		const { data } = await api.post<ApiResponse<Showtime>>(
			ENDPOINTS.admin.showtimes,
			payload,
		);
		return data.data;
	},
};

export const adminTheaterService = {
	createTheater: async (payload: CreateTheaterPayload): Promise<Theater> => {
		const { data } = await api.post<ApiResponse<Theater>>(
			ENDPOINTS.admin.theaters,
			payload,
		);
		return data.data;
	},

	createScreen: async (payload: CreateScreenPayload): Promise<Screen> => {
		const { data } = await api.post<ApiResponse<Screen>>(
			ENDPOINTS.admin.screens,
			payload,
		);
		return data.data;
	},
};

export const adminBookingService = {
	listBookings: async (
		params?: BookingsListParams,
	): Promise<BookingsListResponse> => {
		const { data } = await api.get<ApiResponse<BookingsListResponse>>(
			ENDPOINTS.admin.bookings,
			{ params },
		);
		return data.data;
	},

	getBooking: async (id: number): Promise<Booking> => {
		const { data } = await api.get<ApiResponse<Booking>>(
			ENDPOINTS.bookings.detail(id),
		);
		return data.data;
	},

	updateBookingStatus: async (
		id: number,
		status: BookingStatus,
		reason?: string,
	): Promise<UpdateBookingStatusResponse> => {
		const { data } = await api.patch<{
			success: boolean;
			data: UpdateBookingStatusResponse;
		}>(ENDPOINTS.admin.bookingDetail(id), {
			bookingStatus: status,
			...(reason ? { reason } : {}),
		});
		return data.data;
	},
};

export const adminDiscountService = {
	listDiscounts: async (): Promise<DiscountCode[]> => {
		const { data } = await api.get<ApiResponse<DiscountCode[]>>(
			ENDPOINTS.admin.discounts,
		);
		return data.data;
	},

	createDiscount: async (
		payload: CreateDiscountCodePayload,
	): Promise<DiscountCode> => {
		const { data } = await api.post<ApiResponse<DiscountCode>>(
			ENDPOINTS.admin.discounts,
			payload,
		);
		return data.data;
	},
};
