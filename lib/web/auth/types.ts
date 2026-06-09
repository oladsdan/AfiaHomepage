export interface WebUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  code?: string;
  user?: WebUser;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  isNewUser?: boolean;
}
