export type MovieStatus = 'upcoming' | 'released' | 'archived';

export interface Movie {
	id: number;
	title: string;
	slug: string;
	description: string;
	releaseDate: string;
	durationInMinutes: number;
	language: string;
	genre: string[];
	posterUrls: string[];
	backdropUrl: string | null;
	trailerUrl: string | null;
	rating: string | null;
	imdbId: string | null;
	imdbRating: string | null;
	letterboxdUrl: string | null;
	tmdbId: number | null;
	status: MovieStatus;
	isAdult: boolean;
	director: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface MovieSummary {
	id: number;
	title: string;
	slug: string;
	status: MovieStatus;
	language: string;
	genre: string[];
	rating: string | null;
	posterUrls: string[];
	durationInMinutes: number;
	releaseDate: string;
	director: string;
	isAdult: boolean;
}

export interface CreateMoviePayload {
	title: string;
	description: string;
	releaseDate: string;
	durationInMinutes: number;
	language: string;
	genre: string[];
	posterUrls: string[];
	backdropUrl?: string;
	trailerUrl?: string;
	imdbId?: string;
	imdbRating?: number;
	letterboxdUrl?: string;
	tmdbId?: number;
	status?: MovieStatus;
	isAdult?: boolean;
	director: string;
}

export type UpdateMoviePayload = Partial<CreateMoviePayload>;

export interface MoviesListParams {
	page?: number;
	limit?: number;
	status?: MovieStatus;
	language?: string;
	search?: string;
}

export interface MoviesListResponse {
	movies: MovieSummary[];
	page: number;
	limit: number;
}

export interface Review {
	id: number;
	movieId: number;
	userId: number;
	rating: number;
	comment: string | null;
	createdAt: string;
}

export interface CreateReviewPayload {
	rating: number;
	comment?: string;
}

export interface ReviewsListResponse {
	reviews: Review[];
	page: number;
	limit: number;
}

export interface Cast {
	id: number;
	name: string;
	profileImageUrl: string | null;
	bio: string | null;
	birthDate: string | null;
	nationality: string | null;
	socialMedia: Record<string, string> | null;
}

export interface Theater {
	id: number;
	name: string;
	location: string;
	city: string;
	address: string;
	contactNumber: string | null;
	amenities: string[] | null;
	isActive: boolean;
	createdAt: string;
}

export interface CreateTheaterPayload {
	name: string;
	location: string;
	city: string;
	address: string;
	contactNumber?: string;
	amenities?: string[];
}

export interface TheatersListResponse {
	theaters: Theater[];
	page: number;
	limit: number;
}

export interface Screen {
	id: number;
	theaterId: number;
	name: string;
	totalSeats: number;
	screenType: string;
	createdAt: string;
}

export interface CreateScreenPayload {
	theaterId: number;
	name: string;
	totalSeats: number;
	screenType?: string;
}

export interface Seat {
	id: number;
	screenId: number;
	seatNumber: string;
	rowName: string;
	columnNumber: number;
	seatType: string;
	priceMultiplier: string;
	isAvailable: boolean;
}

export interface Showtime {
	id: number;
	movieId: number;
	screenId: number;
	startTime: string;
	endTime: string;
	basePrice: string;
	isActive: boolean;
}

export interface CreateShowtimePayload {
	movieId: number;
	screenId: number;
	startTime: string;
	endTime: string;
	basePrice: number;
}
