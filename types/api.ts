export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

export interface ApiError {
  status: 'error';
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  data: T[];
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
