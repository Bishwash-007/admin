import { create } from 'zustand';
import { reportService } from '../services/reportService';
import { getErrorMessage } from '../lib/axios';
import type {
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

interface ReportState {
  overview: DashboardOverview | null;
  revenueReport: RevenueReport | null;
  bookingsReport: BookingsReport | null;
  moviesReport: MoviesReport | null;
  occupancyReport: OccupancyReport | null;
  usersReport: UsersReport | null;
  discountsReport: DiscountsReport | null;
  isLoading: boolean;
  error: string | null;

  fetchOverview: () => Promise<void>;
  fetchRevenueReport: (params?: TrendReportParams) => Promise<void>;
  fetchBookingsReport: (params?: TrendReportParams) => Promise<void>;
  fetchMoviesReport: (params?: MoviesReportParams) => Promise<void>;
  fetchOccupancyReport: (params?: ReportDateParams) => Promise<void>;
  fetchUsersReport: (params?: TrendReportParams) => Promise<void>;
  fetchDiscountsReport: (params?: ReportDateParams) => Promise<void>;
  fetchAllReports: (params?: TrendReportParams) => Promise<void>;
  clearError: () => void;
}

export const useReportStore = create<ReportState>(set => ({
  overview: null,
  revenueReport: null,
  bookingsReport: null,
  moviesReport: null,
  occupancyReport: null,
  usersReport: null,
  discountsReport: null,
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const overview = await reportService.getOverview();
      set({ overview, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchRevenueReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const revenueReport = await reportService.getRevenueReport(params);
      set({ revenueReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchBookingsReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const bookingsReport = await reportService.getBookingsReport(params);
      set({ bookingsReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchMoviesReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const moviesReport = await reportService.getMoviesReport(params);
      set({ moviesReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchOccupancyReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const occupancyReport = await reportService.getOccupancyReport(params);
      set({ occupancyReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchUsersReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const usersReport = await reportService.getUsersReport(params);
      set({ usersReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchDiscountsReport: async params => {
    set({ isLoading: true, error: null });
    try {
      const discountsReport = await reportService.getDiscountsReport(params);
      set({ discountsReport, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchAllReports: async params => {
    set({ isLoading: true, error: null });
    try {
      const [overview, revenueReport, bookingsReport, usersReport] =
        await Promise.all([
          reportService.getOverview(),
          reportService.getRevenueReport(params),
          reportService.getBookingsReport(params),
          reportService.getUsersReport(params),
        ]);
      set({
        overview,
        revenueReport,
        bookingsReport,
        usersReport,
        isLoading: false,
      });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
