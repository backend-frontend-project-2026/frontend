import type { AuthResponse, UserResponse } from '@/shared/api/generated';

const ACCESS_TOKEN_KEY = 'accessToken';
const TOKEN_TYPE_KEY = 'tokenType';
const AUTH_USER_KEY = 'authUser';
const IS_AUTH_KEY = 'isAuth';
const USER_ROLE_KEY = 'userRole';

export function saveAuthSession(auth: AuthResponse): void {
  if (auth.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.access_token);
  }

  if (auth.token_type) {
    localStorage.setItem(TOKEN_TYPE_KEY, auth.token_type);
  }

  if (auth.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth.user));
    if (auth.user.role) {
      localStorage.setItem(USER_ROLE_KEY, auth.user.role);
    }
  }

  localStorage.setItem(IS_AUTH_KEY, 'true');
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(IS_AUTH_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getTokenType(): string | null {
  return localStorage.getItem(TOKEN_TYPE_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(IS_AUTH_KEY) === 'true' && Boolean(getAccessToken());
}

export function getStoredUser(): UserResponse | null {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as UserResponse;
  } catch {
    return null;
  }
}
