import { create } from 'zustand';
import {
	adminUserService,
	adminMovieService,
	adminTheaterService,
	adminBookingService,
	adminDiscountService,
} from '../services/adminService';
import { getErrorMessage } from '../lib/axios';
import type {
	User,
	UsersListParams,
	UpdateUserRolePayload,
	Movie,
	MovieSummary,
	MoviesListParams,
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
	BookingsListParams,
	DiscountCode,
	CreateDiscountCodePayload,
} from '../types';

interface AdminState {
	// Users
	users: User[];
	totalUsers: number;

	// Movies
	adminMovies: MovieSummary[];
	currentAdminMovie: Movie | null;
	totalAdminMovies: number;

	// Theaters & Screens
	adminTheaters: Theater[];
	adminScreens: Screen[];
	adminShowtimes: Showtime[];

	// Bookings
	allBookings: BookingSummary[];
	currentAdminBooking: Booking | null;
	totalAllBookings: number;

	// Discounts
	discounts: DiscountCode[];

	isLoading: boolean;
	error: string | null;

	// User actions
	fetchUsers: (params?: UsersListParams) => Promise<void>;
	updateUserRole: (id: number, payload: UpdateUserRolePayload) => Promise<void>;

	// Movie actions
	fetchAdminMovies: (params?: MoviesListParams) => Promise<void>;
	createMovie: (payload: CreateMoviePayload) => Promise<Movie>;
	updateMovie: (id: number, payload: UpdateMoviePayload) => Promise<Movie>;
	deleteMovie: (id: number) => Promise<void>;
	createShowtime: (payload: CreateShowtimePayload) => Promise<Showtime>;

	// Theater actions
	createTheater: (payload: CreateTheaterPayload) => Promise<Theater>;
	createScreen: (payload: CreateScreenPayload) => Promise<Screen>;

	// Booking actions
	fetchAllBookings: (params?: BookingsListParams) => Promise<void>;
	fetchAdminBooking: (id: number) => Promise<void>;

	// Discount actions
	fetchDiscounts: () => Promise<void>;
	createDiscount: (payload: CreateDiscountCodePayload) => Promise<DiscountCode>;

	clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
	users: [],
	totalUsers: 0,
	adminMovies: [],
	currentAdminMovie: null,
	totalAdminMovies: 0,
	adminTheaters: [],
	adminScreens: [],
	adminShowtimes: [],
	allBookings: [],
	currentAdminBooking: null,
	totalAllBookings: 0,
	discounts: [],
	isLoading: false,
	error: null,

	fetchUsers: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const result = await adminUserService.listUsers(params);
			set({
				users: result.users as User[],
				totalUsers: result.users.length,
				isLoading: false,
			});
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	updateUserRole: async (id, payload) => {
		set({ isLoading: true, error: null });
		try {
			const updated = await adminUserService.updateUserRole(id, payload);
			set((state) => ({
				users: state.users.map((u) => (u.id === id ? updated : u)),
				isLoading: false,
			}));
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	fetchAdminMovies: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const result = await adminMovieService.listMovies(params);
			set({
				adminMovies: result.movies as MovieSummary[],
				totalAdminMovies: result.movies.length,
				isLoading: false,
			});
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	createMovie: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const movie = await adminMovieService.createMovie(payload);
			set((state) => ({
				adminMovies: [movie, ...state.adminMovies],
				isLoading: false,
			}));
			return movie;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	updateMovie: async (id, payload) => {
		set({ isLoading: true, error: null });
		try {
			const movie = await adminMovieService.updateMovie(id, payload);
			set((state) => ({
				adminMovies: state.adminMovies.map((m) => (m.id === id ? movie : m)),
				currentAdminMovie:
					state.currentAdminMovie?.id === id ? movie : state.currentAdminMovie,
				isLoading: false,
			}));
			return movie;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	deleteMovie: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await adminMovieService.deleteMovie(id);
			set((state) => ({
				adminMovies: state.adminMovies.filter((m) => m.id !== id),
				isLoading: false,
			}));
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	createShowtime: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const showtime = await adminMovieService.createShowtime(payload);
			set((state) => ({
				adminShowtimes: [showtime, ...state.adminShowtimes],
				isLoading: false,
			}));
			return showtime;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	createTheater: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const theater = await adminTheaterService.createTheater(payload);
			set((state) => ({
				adminTheaters: [theater, ...state.adminTheaters],
				isLoading: false,
			}));
			return theater;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	createScreen: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const screen = await adminTheaterService.createScreen(payload);
			set((state) => ({
				adminScreens: [screen, ...state.adminScreens],
				isLoading: false,
			}));
			return screen;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	fetchAllBookings: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const result = await adminBookingService.listBookings(params);
			set({
				allBookings: result.bookings as BookingSummary[],
				totalAllBookings: result.bookings.length,
				isLoading: false,
			});
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchAdminBooking: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const booking = await adminBookingService.getBooking(id);
			set({ currentAdminBooking: booking, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchDiscounts: async () => {
		set({ isLoading: true, error: null });
		try {
			const discounts = await adminDiscountService.listDiscounts();
			set({ discounts, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	createDiscount: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const discount = await adminDiscountService.createDiscount(payload);
			set((state) => ({
				discounts: [discount, ...state.discounts],
				isLoading: false,
			}));
			return discount;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	clearError: () => set({ error: null }),
}));
