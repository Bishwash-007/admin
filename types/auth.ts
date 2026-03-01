export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  age?: number;
  phoneNumber?: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  age: number | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
