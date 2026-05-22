export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  roles: string[];
  isAuthenticated: boolean;
  loading: boolean;
  error: any | null
}

export const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  username: null,
  roles: [],
  isAuthenticated: false,
  loading: false,
  error: null
};