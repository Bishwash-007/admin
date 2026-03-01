import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	Payment,
	InitiatePaymentPayload,
	InitiatePaymentResponse,
	VerifyPaymentPayload,
	VerifyPaymentResponse,
	RefundPaymentPayload,
} from '../types';

export const paymentService = {
	initiatePayment: async (
		payload: InitiatePaymentPayload,
	): Promise<InitiatePaymentResponse> => {
		const { data } = await api.post<ApiResponse<InitiatePaymentResponse>>(
			ENDPOINTS.payments.initiate,
			payload,
		);
		return data.data;
	},

	verifyPayment: async (
		payload: VerifyPaymentPayload,
	): Promise<VerifyPaymentResponse> => {
		const { data } = await api.post<ApiResponse<VerifyPaymentResponse>>(
			ENDPOINTS.payments.verify,
			payload,
		);
		return data.data;
	},

	getPayment: async (bookingId: number): Promise<Payment> => {
		const { data } = await api.get<ApiResponse<Payment>>(
			ENDPOINTS.payments.detail(bookingId),
		);
		return data.data;
	},

	refundPayment: async (payload: RefundPaymentPayload): Promise<Payment> => {
		const { data } = await api.post<ApiResponse<Payment>>(
			ENDPOINTS.payments.refund,
			payload,
		);
		return data.data;
	},
};
