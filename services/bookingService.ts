import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	Booking,
	BookingsListParams,
	BookingsListResponse,
	CreateBookingPayload,
	CancelBookingPayload,
	LockSeatsPayload,
	LockSeatsResponse,
	ValidateDiscountPayload,
	ValidatedDiscount,
	ReceiptData,
} from '../types';

export const bookingService = {
	lockSeats: async (payload: LockSeatsPayload): Promise<LockSeatsResponse> => {
		const { data } = await api.post<ApiResponse<LockSeatsResponse>>(
			ENDPOINTS.bookings.lockSeats,
			payload,
		);
		return data.data;
	},

	validateDiscount: async (
		payload: ValidateDiscountPayload,
	): Promise<ValidatedDiscount> => {
		const { data } = await api.post<ApiResponse<ValidatedDiscount>>(
			ENDPOINTS.bookings.validateDiscount,
			payload,
		);
		return data.data;
	},

	createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
		const { data } = await api.post<ApiResponse<Booking>>(
			ENDPOINTS.bookings.create,
			payload,
		);
		return data.data;
	},

	getMyBookings: async (
		params?: BookingsListParams,
	): Promise<BookingsListResponse> => {
		const { data } = await api.get<ApiResponse<BookingsListResponse>>(
			ENDPOINTS.bookings.mine,
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

	cancelBooking: async (
		id: number,
		payload?: CancelBookingPayload,
	): Promise<Booking> => {
		const { data } = await api.put<ApiResponse<Booking>>(
			ENDPOINTS.bookings.cancel(id),
			payload,
		);
		return data.data;
	},

	getReceipt: async (id: number): Promise<ReceiptData> => {
		const { data } = await api.get<ApiResponse<ReceiptData>>(
			ENDPOINTS.bookings.receipt(id),
		);
		return data.data;
	},

	resendReceipt: async (id: number): Promise<void> => {
		await api.post(ENDPOINTS.bookings.resendReceipt(id));
	},
};
