import { AuthUser } from '../models/models';

export const AUTH_STORAGE_KEY = 'gov_edu_auth';

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAtUtc: string | null;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string | null;
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.user || !parsed.user.username || !parsed.user.role || !parsed.token || !parsed.refreshToken) {
      return null;
    }

    return {
      user: parsed.user,
      token: parsed.token,
      expiresAtUtc: parsed.expiresAtUtc ?? null,
      refreshToken: parsed.refreshToken,
      refreshTokenExpiresAtUtc: parsed.refreshTokenExpiresAtUtc ?? null
    };
  } catch {
    return null;
  }
}

export function saveStoredSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAccessTokenExpired(session: AuthSession): boolean {
  if (!session.expiresAtUtc) return false;
  return Date.parse(session.expiresAtUtc) <= Date.now();
}

export function isRefreshTokenExpired(session: AuthSession): boolean {
  if (!session.refreshTokenExpiresAtUtc) return false;
  return Date.parse(session.refreshTokenExpiresAtUtc) <= Date.now();
}
