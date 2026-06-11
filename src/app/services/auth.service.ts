import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthUser, UserRole } from '../models/models';
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

interface LoginResponse {
  success: boolean;
  error?: string | null;
  user?: AuthUser | null;
  token?: string | null;
  expiresAtUtc?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAtUtc?: string | null;
  requiresPasswordChange?: boolean;
}

interface OperationResponse {
  success: boolean;
  error?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = signal<AuthUser | null>(null);

  readonly currentUser = this.user.asReadonly();

  readonly isLoggedIn = computed(() => this.user() !== null);

  readonly isAdmin = computed(() => {
    const u = this.user();
    return u !== null && (u.role === 'admin' || u.role === 'superadmin');
  });

  readonly isSuperAdmin = computed(() => {
    const u = this.user();
    return u !== null && u.role === 'superadmin';
  });

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string; requiresPasswordChange?: boolean }> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${AUTH_API}/login`, { username, password })
      );

      if (!response.success || !response.user || !response.token || !response.refreshToken) {
        return {
          success: false,
          error: response.error || 'اسم المستخدم أو كلمة المرور غير صحيحة',
          requiresPasswordChange: !!response.requiresPasswordChange
        };
      }

      this.user.set(response.user);
      saveStoredSession({
        user: response.user,
        token: response.token,
        expiresAtUtc: response.expiresAtUtc || null,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAtUtc: response.refreshTokenExpiresAtUtc || null
      });
      return { success: true };
    } catch (err: any) {
      const requiresPasswordChange = !!err?.error?.requiresPasswordChange;
      if (requiresPasswordChange) {
        return {
          success: false,
          error: err?.error?.error || 'يجب تغيير كلمة المرور قبل الدخول',
          requiresPasswordChange: true
        };
      }

      return {
        success: false,
        error: err?.error?.error || 'تعذر الاتصال بالخادم، حاول مرة أخرى'
      };
    }
  }

  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<OperationResponse>(`${AUTH_API}/change-password`, {
          username,
          currentPassword,
          newPassword
        })
      );

      if (!response.success) {
        return { success: false, error: response.error || 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'تعذر تغيير كلمة المرور' };
    }
  }

  async adminResetPassword(
    username: string,
    newPassword: string,
    mustChangePassword: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<OperationResponse>(`${AUTH_API}/admin/reset-password`, {
          username,
          newPassword,
          mustChangePassword
        })
      );

      if (!response.success) {
        return { success: false, error: response.error || 'تعذر إعادة تعيين كلمة المرور' };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.error?.error || 'تعذر إعادة تعيين كلمة المرور' };
    }
  }

  logout(): void {
    const session = getStoredSession();
    if (session?.refreshToken && !isRefreshTokenExpired(session) && !isAccessTokenExpired(session)) {
      void firstValueFrom(this.http.post(`${AUTH_API}/logout`, { refreshToken: session.refreshToken })).catch(() => {});
    }

    this.user.set(null);
    clearStoredSession();
  }

  hasRole(role: UserRole): boolean {
    const u = this.user();
    if (!u) return false;
    if (role === 'student') return true;
    if (role === 'admin') return u.role === 'admin' || u.role === 'superadmin';
    if (role === 'superadmin') return u.role === 'superadmin';
    return false;
  }

  private loadFromStorage(): void {
    const session = getStoredSession();
    if (!session || isRefreshTokenExpired(session)) {
      this.user.set(null);
      clearStoredSession();
      return;
    }

    this.user.set(session.user);
  }
}
