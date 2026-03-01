import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	AuthUser,
	UpdateProfilePayload,
	ChangePasswordPayload,
} from '../types';

export const userService = {
	getMe: async (): Promise<AuthUser> => {
		const { data } = await api.get<ApiResponse<AuthUser>>(ENDPOINTS.user.me);
		return data.data;
	},

	updateMe: async (payload: UpdateProfilePayload): Promise<AuthUser> => {
		const { data } = await api.put<ApiResponse<AuthUser>>(
			ENDPOINTS.user.me,
			payload,
		);
		return data.data;
	},

	changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
		await api.put(ENDPOINTS.user.password, payload);
	},

	deleteMe: async (): Promise<void> => {
		await api.delete(ENDPOINTS.user.me);
	},
};
