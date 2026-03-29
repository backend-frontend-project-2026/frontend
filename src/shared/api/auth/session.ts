import type { AuthResponse, UserResponse } from '@/shared/api/generated';

const ACCESS_TOKEN_KEY = 'accessToken';
const TOKEN_TYPE_KEY = 'tokenType';
const AUTH_USER_KEY = 'authUser';
const USER_ROLE_KEY = 'userRole';

interface JwtPayload {
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

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
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

export function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function getTokenType(): string | null {
  return localStorage.getItem(TOKEN_TYPE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
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
