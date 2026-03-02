export const ENDPOINTS = {
	// Auth
	auth: {
		register: '/auth/register',
		login: '/auth/login',
		logout: '/auth/logout',
		verifyEmail: '/auth/verify-email',
		forgotPassword: '/auth/forgot-password',
		resetPassword: '/auth/reset-password',
	},

	// User (self)
	user: {
		me: '/users/me',
		password: '/users/me/password',
	},

	// Movies (public)
	movies: {
		list: '/movies',
		detail: (id: number) => `/movies/${id}`,
		reviews: (id: number) => `/movies/${id}/reviews`,
		showtimes: (id: number) => `/movies/${id}/showtimes`,
		theaters: '/movies/theaters',
		screens: '/movies/screens',
		screenSeats: (screenId: number) => `/movies/screens/${screenId}/seats`,
	},

	// Bookings (user)
	bookings: {
		create: '/bookings',
		mine: '/bookings/mine',
		detail: (id: number) => `/bookings/${id}`,
		cancel: (id: number) => `/bookings/${id}/cancel`,
		receipt: (id: number) => `/bookings/${id}/receipt`,
		resendReceipt: (id: number) => `/bookings/${id}/receipt/resend`,
		lockSeats: '/bookings/seats/lock',
		validateDiscount: '/bookings/discounts/validate',
	},

	// Payments
	payments: {
		initiate: '/payments/initiate',
		verify: '/payments/verify',
		refund: '/payments/refund',
		detail: (bookingId: number) => `/payments/${bookingId}`,
	},

	// Admin
	admin: {
		// Users
		users: '/admin/users',
		userRole: (id: number) => `/admin/users/${id}/role`,

		// Movies
		movies: '/admin/movies',
		movie: (id: number) => `/admin/movies/${id}`,
		showtimes: '/admin/movies/showtimes',
		theaters: '/admin/theaters',
		screens: '/admin/screens',

		// Bookings & Discounts
		bookings: '/admin/bookings',
		bookingDetail: (id: number) => `/admin/bookings/${id}`,
		discounts: '/admin/discounts',

		// Reports
		reports: {
			overview: '/admin/reports/overview',
			revenue: '/admin/reports/revenue',
			bookings: '/admin/reports/bookings',
			movies: '/admin/reports/movies',
			occupancy: '/admin/reports/occupancy',
			users: '/admin/reports/users',
			discounts: '/admin/reports/discounts',
		},
	},
} as const;
