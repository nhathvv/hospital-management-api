export interface TokenPayload {
  userId: string;
  role: string;
}
export interface RefreshTokenPayload {
  userId: string;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
}