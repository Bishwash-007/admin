export type ReportGranularity = 'day' | 'week' | 'month' | 'year';

export interface ReportDateParams {
	from?: string;
	to?: string;
}

export interface TrendReportParams extends ReportDateParams {
	granularity?: ReportGranularity;
}

export interface DashboardOverview {
	revenue: {
		total: string;
		thisMonth: string;
	};
	bookings: {
		total: string;
		thisMonth: string;
		pending: string;
	};
	avgOrderValue: string;
	totalUsers: string;
	topMovies: Array<{
		id: number;
		title: string;
		ticketsSold: string;
	}>;
}

export interface RevenueTrendPoint {
	period: string;
	revenue: string;
	bookings: string;
	ticketsSold: string;
}

export interface RevenueByProvider {
	provider: string;
	transactions: string;
	totalAmount: string;
}

export interface RevenueSummary {
	totalRevenue: string;
	totalBookings: string;
	avgOrderValue: string;
	minOrderValue: string;
	maxOrderValue: string;
}

export interface RevenueReport {
	range: { from: string; to: string };
	summary: RevenueSummary;
	trend: RevenueTrendPoint[];
	byProvider: RevenueByProvider[];
}

export interface BookingStatusBreakdown {
	status: string;
	count: string;
	totalAmount: string;
}

export interface BookingTrendPoint {
	period: string;
	total: string;
	confirmed: string;
	cancelled: string;
	pending: string;
}

export interface BookingsReport {
	range: { from: string; to: string };
	statusBreakdown: BookingStatusBreakdown[];
	trend: BookingTrendPoint[];
}

export interface MoviePerformanceRow {
	movieId: number;
	title: string;
	slug: string;
	totalBookings: string;
	ticketsSold: string;
	revenue: string;
}

export interface MoviesReport {
	range: { from: string; to: string };
	movies: MoviePerformanceRow[];
}

export interface MoviesReportParams extends ReportDateParams {
	limit?: number;
}

export interface ShowtimeOccupancyRow {
	showtimeId: number;
	startTime: string;
	movieTitle: string;
	theaterName: string;
	theaterCity: string;
	screenName: string;
	screenType: string;
	totalSeats: number;
	ticketsSold: string;
	occupancyRate: string;
	revenue: string;
}

export interface TheaterOccupancyRow {
	theaterId: number;
	theaterName: string;
	city: string;
	totalShowtimes: string;
	totalBookings: string;
	ticketsSold: string;
	revenue: string;
}

export interface OccupancyReport {
	range: { from: string; to: string };
	showtimes: ShowtimeOccupancyRow[];
	theaters: TheaterOccupancyRow[];
}

export interface UserGrowthPoint {
	period: string;
	newUsers: string;
	verifiedUsers: string;
}

export interface UserStats {
	total: string;
	verified: string;
	admins: string;
	deleted: string;
}

export interface TopSpender {
	userId: number;
	name: string;
	email: string;
	totalSpent: string;
	totalBookings: string;
}

export interface UsersReport {
	range: { from: string; to: string };
	stats: UserStats;
	growth: UserGrowthPoint[];
	topSpenders: TopSpender[];
}

export interface DiscountUsageRow {
	id: number;
	code: string;
	type: string;
	value: string;
	isActive: boolean;
	usageCount: number;
	maxUsageCount: number | null;
	totalDiscountGiven: string;
	timesApplied: string;
	expiresAt: string | null;
}

export interface DiscountsReport {
	codes: DiscountUsageRow[];
}
