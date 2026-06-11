import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from './api.config';
import {
  AuthSession,
  clearStoredSession,
  getStoredSession,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  saveStoredSession
} from './auth.storage';

const AUTH_API = `${API_BASE_URL}/auth`;
let refreshPromise: Promise<AuthSession | null> | null = null;

interface LoginResponse {
  success: boolean;
  user?: AuthSession['user'] | null;
  token?: string | null;
  expiresAtUtc?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAtUtc?: string | null;
}

function isAuthEndpoint(url: string): boolean {
  return url.startsWith(`${AUTH_API}/login`) ||
         url.startsWith(`${AUTH_API}/refresh`) ||
         url.startsWith(`${AUTH_API}/change-password`) ||
         url.startsWith(`${AUTH_API}/logout`);
}

function toSession(response: LoginResponse): AuthSession | null {
  if (!response.success || !response.user || !response.token || !response.refreshToken) {
    return null;
  }

  return {
    user: response.user,
    token: response.token,
    expiresAtUtc: response.expiresAtUtc || null,
    refreshToken: response.refreshToken,
    refreshTokenExpiresAtUtc: response.refreshTokenExpiresAtUtc || null
  };
}

async function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  if (isRefreshTokenExpired(session)) {
    clearStoredSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${AUTH_API}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken })
    })
      .then(async response => {
        if (!response.ok) {
          clearStoredSession();
          return null;
        }

        const payload = await response.json() as LoginResponse;
        const updated = toSession(payload);
        if (!updated) {
          clearStoredSession();
          return null;
        }

        saveStoredSession(updated);
        return updated;
      })
      .catch(() => {
        clearStoredSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE_URL) || isAuthEndpoint(req.url)) {
    return next(req);
  }

  const session = getStoredSession();
  if (!session) {
    return next(req);
  }

  if (isAccessTokenExpired(session)) {
    return from(refreshSession(session)).pipe(
      switchMap(refreshed => {
        if (!refreshed) {
          return next(req);
        }

        const retriedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${refreshed.token}` }
        });
        return next(retriedRequest);
      })
    );
  }

  const authorizedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${session.token}` }
  });

  return next(authorizedRequest).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return from(refreshSession(session)).pipe(
        switchMap(refreshed => {
          if (!refreshed) {
            return throwError(() => error);
          }

          const retriedRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${refreshed.token}` }
          });
          return next(retriedRequest);
        })
      );
    })
  );
};
