import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	AuthResponse,
	LoginPayload,
	RegisterPayload,
	VerifyEmailPayload,
	ForgotPasswordPayload,
	ResetPasswordPayload,
} from '../types';

export const authService = {
	register: async (payload: RegisterPayload): Promise<AuthResponse> => {
		const { data } = await api.post<ApiResponse<AuthResponse>>(
			ENDPOINTS.auth.register,
			payload,
		);
		return data.data;
	},

	login: async (payload: LoginPayload): Promise<AuthResponse> => {
		const { data } = await api.post<ApiResponse<AuthResponse>>(
			ENDPOINTS.auth.login,
			payload,
		);
		return data.data;
	},

	logout: async (): Promise<void> => {
		await api.post(ENDPOINTS.auth.logout);
	},

	verifyEmail: async (payload: VerifyEmailPayload): Promise<void> => {
		await api.post(ENDPOINTS.auth.verifyEmail, payload);
	},

	forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
		await api.post(ENDPOINTS.auth.forgotPassword, payload);
	},

	resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
		await api.post(ENDPOINTS.auth.resetPassword, payload);
	},
};
