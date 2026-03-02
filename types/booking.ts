export type DiscountType = 'percentage' | 'flat';
export type DiscountScope = 'booking' | 'ticket';

export interface DiscountCode {
	id: number;
	code: string;
	description: string | null;
	type: DiscountType;
	scope: DiscountScope;
	value: string;
	minAmount: string | null;
	maxDiscountAmount: string | null;
	maxUsageCount: number | null;
	maxUsagePerUser: number;
	usageCount: number;
	startsAt: string | null;
	expiresAt: string | null;
	isStackable: boolean;
	isActive: boolean;
	createdBy: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateDiscountCodePayload {
	code: string;
	description?: string;
	type: DiscountType;
	scope?: DiscountScope;
	value: number;
	minAmount?: number;
	maxDiscountAmount?: number;
	maxUsageCount?: number;
	maxUsagePerUser?: number;
	startsAt?: string;
	expiresAt?: string;
	isStackable?: boolean;
}

export interface ValidateDiscountPayload {
	code: string;
	totalAmount: number;
}

export interface ValidatedDiscount {
	code: string;
	type: DiscountType;
	value: string;
	discountAmount: string;
	finalAmount: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed';

export interface Ticket {
	id: number;
	bookingId: number;
	seatId: number;
	ticketNumber: string;
	price: string;
	isCheckedIn: boolean;
}

export interface Booking {
	id: number;
	userId: number;
	showtimeId: number;
	bookingNumber: string;
	totalAmount: string;
	bookingStatus: BookingStatus;
	createdAt: string;
	updatedAt: string;
	tickets?: Ticket[];
}

export interface BookingSummary {
	id: number;
	bookingNumber: string;
	totalAmount: string;
	bookingStatus: BookingStatus;
	createdAt: string;
}

/** Richer booking shape returned by admin list endpoint */
export interface AdminBookingSummary extends BookingSummary {
	updatedAt?: string;
	userName?: string;
	userEmail?: string;
	userId?: number;
	movieTitle?: string;
	showtimeStart?: string;
}

export interface CreateBookingPayload {
	showtimeId: number;
	seatIds: number[];
	discountCode?: string;
}

export interface CancelBookingPayload {
	reason?: string;
}

export interface LockSeatsPayload {
	showtimeId: number;
	seatIds: number[];
}

export interface SeatLock {
	id: number;
	showtimeId: number;
	seatId: number;
	userId: number;
	expiresAt: string;
}

export interface LockSeatsResponse {
	locks: SeatLock[];
	expiresAt: string;
}

export interface BookingsListParams {
	page?: number;
	limit?: number;
	status?: BookingStatus;
}

export interface BookingsListResponse {
	bookings: BookingSummary[];
	page: number;
	limit: number;
}

export interface UpdateBookingStatusPayload {
	bookingStatus: BookingStatus;
	reason?: string;
}

export interface UpdateBookingStatusResponse {
	id: number;
	bookingNumber: string;
	bookingStatus: BookingStatus;
	updatedAt: string;
}

export interface ReceiptData {
	booking: BookingSummary;
	user: {
		id: number;
		name: string;
		email: string;
	};
	movie: {
		id: number;
		title: string;
		durationInMinutes: number;
		language: string;
	};
	showtime: {
		id: number;
		startTime: string;
		endTime: string;
		basePrice: string;
	};
	theater: {
		id: number;
		name: string;
		city: string;
		address: string;
	};
	screen: {
		id: number;
		name: string;
		screenType: string;
	};
	tickets: Array<{
		id: number;
		ticketNumber: string;
		seatNumber: string;
		seatType: string;
		price: string;
		isCheckedIn: boolean;
	}>;
	payment: {
		id: number;
		transactionId: string;
		amount: string;
		provider: string;
		paymentStatus: PaymentStatus;
	} | null;
	discount: {
		code: string;
		type: DiscountType;
		value: string;
		appliedAmount: string;
	} | null;
}

export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export interface Payment {
	id: number;
	bookingId: number;
	transactionId: string;
	amount: string;
	provider: string;
	paymentStatus: PaymentStatus;
	paymentMetadata: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
}

export interface InitiatePaymentPayload {
	bookingId: number;
	provider: string;
}

export interface InitiatePaymentResponse {
	transactionId: string;
	amount: string;
	provider: string;
	status: PaymentStatus;
	paymentUrl: string;
}

export interface VerifyPaymentPayload {
	bookingId: number;
	transactionId: string;
	provider: string;
	providerPayload?: Record<string, unknown>;
}

export interface VerifyPaymentResponse {
	booking: {
		id: number;
		bookingStatus: BookingStatus;
		updatedAt: string;
	};
	payment: {
		id: number;
		transactionId: string;
		amount: string;
		provider: string;
		paymentStatus: PaymentStatus;
	};
}

export interface RefundPaymentPayload {
	bookingId: number;
	reason?: string;
}
