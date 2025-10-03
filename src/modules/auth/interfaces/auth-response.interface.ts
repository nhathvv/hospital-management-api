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
