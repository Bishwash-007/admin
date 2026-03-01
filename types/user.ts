export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  age: number | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  age?: number;
  phoneNumber?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface UsersListResponse {
  users: UserSummary[];
  page: number;
  limit: number;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
}
