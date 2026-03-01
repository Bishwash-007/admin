import { api } from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type {
	ApiResponse,
	ReportDateParams,
	TrendReportParams,
	MoviesReportParams,
	DashboardOverview,
	RevenueReport,
	BookingsReport,
	MoviesReport,
	OccupancyReport,
	UsersReport,
	DiscountsReport,
} from '../types';

export const reportService = {
	getOverview: async (): Promise<DashboardOverview> => {
		const { data } = await api.get<ApiResponse<DashboardOverview>>(
			ENDPOINTS.admin.reports.overview,
		);
		return data.data;
	},

	getRevenueReport: async (
		params?: TrendReportParams,
	): Promise<RevenueReport> => {
		const { data } = await api.get<ApiResponse<RevenueReport>>(
			ENDPOINTS.admin.reports.revenue,
			{ params },
		);
		return data.data;
	},

	getBookingsReport: async (
		params?: TrendReportParams,
	): Promise<BookingsReport> => {
		const { data } = await api.get<ApiResponse<BookingsReport>>(
			ENDPOINTS.admin.reports.bookings,
			{ params },
		);
		return data.data;
	},

	getMoviesReport: async (
		params?: MoviesReportParams,
	): Promise<MoviesReport> => {
		const { data } = await api.get<ApiResponse<MoviesReport>>(
			ENDPOINTS.admin.reports.movies,
			{ params },
		);
		return data.data;
	},

	getOccupancyReport: async (
		params?: ReportDateParams,
	): Promise<OccupancyReport> => {
		const { data } = await api.get<ApiResponse<OccupancyReport>>(
			ENDPOINTS.admin.reports.occupancy,
			{ params },
		);
		return data.data;
	},

	getUsersReport: async (params?: TrendReportParams): Promise<UsersReport> => {
		const { data } = await api.get<ApiResponse<UsersReport>>(
			ENDPOINTS.admin.reports.users,
			{ params },
		);
		return data.data;
	},

	getDiscountsReport: async (
		params?: ReportDateParams,
	): Promise<DiscountsReport> => {
		const { data } = await api.get<ApiResponse<DiscountsReport>>(
			ENDPOINTS.admin.reports.discounts,
			{ params },
		);
		return data.data;
	},
};
