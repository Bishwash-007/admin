import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../lib/axios';
import type {
	AuthUser,
	LoginPayload,
	RegisterPayload,
	UpdateProfilePayload,
	ChangePasswordPayload,
} from '../types';

interface AuthState {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	login: (payload: LoginPayload) => Promise<void>;
	register: (payload: RegisterPayload) => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
	changePassword: (payload: ChangePasswordPayload) => Promise<void>;
	loadMe: () => Promise<void>;
	clearError: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),

			login: async (payload) => {
				set({ isLoading: true, error: null });
				try {
					const { user, token } = await authService.login(payload);
					localStorage.setItem('cinema_token', token);
					set({ user, token, isAuthenticated: true, isLoading: false });
				} catch (err) {
					set({ error: getErrorMessage(err), isLoading: false });
					throw err;
				}
			},

			register: async (payload) => {
				set({ isLoading: true, error: null });
				try {
					const { user, token } = await authService.register(payload);
					localStorage.setItem('cinema_token', token);
					set({ user, token, isAuthenticated: true, isLoading: false });
				} catch (err) {
					set({ error: getErrorMessage(err), isLoading: false });
					throw err;
				}
			},

			logout: async () => {
				try {
					await authService.logout();
				} finally {
					localStorage.removeItem('cinema_token');
					set({ user: null, token: null, isAuthenticated: false });
				}
			},

			updateProfile: async (payload) => {
				set({ isLoading: true, error: null });
				try {
					const user = await userService.updateMe(payload);
					set({ user, isLoading: false });
				} catch (err) {
					set({ error: getErrorMessage(err), isLoading: false });
					throw err;
				}
			},

			changePassword: async (payload) => {
				set({ isLoading: true, error: null });
				try {
					await userService.changePassword(payload);
					set({ isLoading: false });
				} catch (err) {
					set({ error: getErrorMessage(err), isLoading: false });
					throw err;
				}
			},

			loadMe: async () => {
				set({ isLoading: true, error: null });
				try {
					const user = await userService.getMe();
					set({ user, isAuthenticated: true, isLoading: false });
				} catch {
					set({
						user: null,
						token: null,
						isAuthenticated: false,
						isLoading: false,
					});
					localStorage.removeItem('cinema_token');
				}
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'cinema_auth',
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
