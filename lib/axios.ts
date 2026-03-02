import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

export const BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5500/api/v1';

export const api = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	timeout: 15_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('cinema_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<ApiError>) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('cinema_token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);

export const getErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<ApiError>;
		return axiosError.response?.data?.message ?? axiosError.message;
	}
	if (error instanceof Error) return error.message;
	return 'An unexpected error occurred';
};
