import { create } from 'zustand';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { getErrorMessage } from '../lib/axios';
import type {
	Booking,
	BookingSummary,
	BookingsListParams,
	CreateBookingPayload,
	LockSeatsPayload,
	SeatLock,
	ValidateDiscountPayload,
	ValidatedDiscount,
	ReceiptData,
	InitiatePaymentPayload,
	InitiatePaymentResponse,
	VerifyPaymentPayload,
	VerifyPaymentResponse,
} from '../types';

interface BookingState {
	myBookings: BookingSummary[];
	currentBooking: Booking | null;
	lockedSeats: SeatLock[];
	validatedDiscount: ValidatedDiscount | null;
	receipt: ReceiptData | null;
	paymentIntent: InitiatePaymentResponse | null;
	totalBookings: number;
	isLoading: boolean;
	error: string | null;

	lockSeats: (payload: LockSeatsPayload) => Promise<void>;
	validateDiscount: (payload: ValidateDiscountPayload) => Promise<void>;
	createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
	fetchMyBookings: (params?: BookingsListParams) => Promise<void>;
	fetchBooking: (id: number) => Promise<void>;
	cancelBooking: (id: number) => Promise<void>;
	fetchReceipt: (id: number) => Promise<void>;
	initiatePayment: (
		payload: InitiatePaymentPayload,
	) => Promise<InitiatePaymentResponse>;
	verifyPayment: (
		payload: VerifyPaymentPayload,
	) => Promise<VerifyPaymentResponse>;
	clearDiscount: () => void;
	clearLockedSeats: () => void;
	clearCurrentBooking: () => void;
	clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
	myBookings: [],
	currentBooking: null,
	lockedSeats: [],
	validatedDiscount: null,
	receipt: null,
	paymentIntent: null,
	totalBookings: 0,
	isLoading: false,
	error: null,

	lockSeats: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const result = await bookingService.lockSeats(payload);
			set({ lockedSeats: result.locks, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	validateDiscount: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const discount = await bookingService.validateDiscount(payload);
			set({ validatedDiscount: discount, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	createBooking: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const booking = await bookingService.createBooking(payload);
			set({ currentBooking: booking, isLoading: false });
			return booking;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	fetchMyBookings: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const result = await bookingService.getMyBookings(params);
			set({
				myBookings: result.bookings as BookingSummary[],
				totalBookings: result.bookings.length,
				isLoading: false,
			});
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	fetchBooking: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const booking = await bookingService.getBooking(id);
			set({ currentBooking: booking, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	cancelBooking: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const booking = await bookingService.cancelBooking(id);
			set((state) => ({
				myBookings: state.myBookings.map((b) =>
					b.id === id ? { ...b, status: booking.bookingStatus } : b,
				),
				currentBooking:
					state.currentBooking?.id === id ? booking : state.currentBooking,
				isLoading: false,
			}));
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	fetchReceipt: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const receipt = await bookingService.getReceipt(id);
			set({ receipt, isLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
		}
	},

	initiatePayment: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const intent = await paymentService.initiatePayment(payload);
			set({ paymentIntent: intent, isLoading: false });
			return intent;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	verifyPayment: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const result = await paymentService.verifyPayment(payload);
			set({ isLoading: false });
			return result;
		} catch (err) {
			set({ error: getErrorMessage(err), isLoading: false });
			throw err;
		}
	},

	clearDiscount: () => set({ validatedDiscount: null }),
	clearLockedSeats: () => set({ lockedSeats: [] }),
	clearCurrentBooking: () =>
		set({ currentBooking: null, receipt: null, paymentIntent: null }),
	clearError: () => set({ error: null }),
}));
