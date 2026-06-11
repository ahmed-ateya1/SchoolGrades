import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <main class="login-page">
      <div class="login-container">
        <div class="login-card animate-fade-in">
          <div class="login-header">
            <div class="login-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
            </div>
            <h2>تسجيل الدخول</h2>
            <p>لوحة التحكم الإدارية</p>
          </div>

          <form (ngSubmit)="submit()" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                اسم المستخدم
              </label>
              <input type="text" id="username" [(ngModel)]="username" name="username" placeholder="أدخل اسم المستخدم" class="form-input" required autocomplete="username" />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                كلمة المرور
              </label>
              <input type="password" id="password" [(ngModel)]="password" name="password" placeholder="أدخل كلمة المرور" class="form-input" required autocomplete="current-password" />
            </div>

            @if (requiresPasswordChange()) {
              <div class="error-message info-message">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                قم بتعيين كلمة مرور جديدة للمتابعة
              </div>

              <div class="form-group">
                <label for="newPassword" class="form-label">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  كلمة المرور الجديدة
                </label>
                <input type="password" id="newPassword" [(ngModel)]="newPassword" name="newPassword" placeholder="أدخل كلمة مرور جديدة" class="form-input" required autocomplete="new-password" />
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="form-label">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z"/></svg>
                  تأكيد كلمة المرور
                </label>
                <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="أعد إدخال كلمة المرور" class="form-input" required autocomplete="new-password" />
              </div>
            }

            @if (errorMessage()) {
              <div class="error-message">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {{ errorMessage() }}
              </div>
            }

            <button
              type="submit"
              class="login-btn"
              [disabled]="!username || !password || isLoading() || (requiresPasswordChange() && (!newPassword || !confirmPassword))"
              id="login-btn"
            >
              @if (isLoading()) {
                <span class="spinner"></span>
                جاري المعالجة...
              } @else {
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                {{ requiresPasswordChange() ? 'تحديث كلمة المرور' : 'تسجيل الدخول' }}
              }
            </button>
          </form>

          <div class="login-footer">
            <p>هذه الصفحة مخصصة لإدارة المدرسة فقط</p>
          </div>
        </div>
      </div>
    </main>

    <app-footer />
  `,
  styles: [`
    .login-page {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      background: var(--gov-bg);
    }

    .login-container {
      width: 100%;
      max-width: 440px;
    }

    .login-card {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow-lg);
      overflow: hidden;
      border: 1px solid var(--gov-border-light);
    }

    .login-header {
      text-align: center;
      padding: 36px 28px 24px;
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
      color: white;
    }

    .login-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      border: 2px solid rgba(212, 175, 55, 0.3);
    }

    .login-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .login-header p {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.65);
    }

    .login-form {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--gov-text);
    }

    .form-label svg {
      width: 16px;
      height: 16px;
      color: var(--gov-text-muted);
    }

    .form-input {
      padding: 14px 16px;
      border: 2px solid var(--gov-border);
      border-radius: var(--gov-radius);
      font-size: 1rem;
      color: var(--gov-text);
      background: var(--gov-bg);
      transition: all var(--transition);
      direction: ltr;
      text-align: right;
    }

    .form-input:focus {
      border-color: var(--gov-blue);
      background: white;
      box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.1);
    }

    .form-input::placeholder {
      color: var(--gov-text-muted);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--gov-danger-bg);
      color: var(--gov-danger);
      border-radius: var(--gov-radius);
      font-size: 0.9rem;
      font-weight: 600;
      border: 1px solid rgba(231, 76, 60, 0.2);
      animation: fadeIn 0.3s ease;
    }

    .error-message svg { width: 18px; height: 18px; flex-shrink: 0; }

    .info-message {
      background: var(--gov-info-bg);
      color: var(--gov-info);
      border-color: rgba(52, 152, 219, 0.25);
    }

    .login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(135deg, var(--gov-gold) 0%, var(--gov-gold-dark) 100%);
      color: var(--gov-navy);
      font-size: 1.05rem;
      font-weight: 700;
      border-radius: var(--gov-radius);
      transition: all var(--transition);
      box-shadow: var(--gov-shadow-gold);
      width: 100%;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }

    .login-btn svg { width: 20px; height: 20px; }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(0, 51, 102, 0.2);
      border-top: 2px solid var(--gov-navy);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .login-footer {
      padding: 16px 28px;
      text-align: center;
      border-top: 1px solid var(--gov-border-light);
      background: var(--gov-bg);
    }

    .login-footer p {
      font-size: 0.8rem;
      color: var(--gov-text-muted);
    }

    @media (max-width: 480px) {
      .login-page { padding: 24px 16px; }
      .login-form { padding: 20px; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = signal('');
  isLoading = signal(false);
  requiresPasswordChange = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in as admin, redirect to admin
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async submit() {
    if (this.requiresPasswordChange()) {
      await this.changePassword();
      return;
    }

    await this.login();
  }

  private async login() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await this.authService.login(this.username, this.password);

    this.isLoading.set(false);

    if (result.success) {
      this.router.navigate(['/admin/dashboard']);
    } else if (result.requiresPasswordChange) {
      this.requiresPasswordChange.set(true);
      this.errorMessage.set('يجب تغيير كلمة المرور الافتراضية أولاً');
    } else {
      this.errorMessage.set(result.error || 'حدث خطأ غير متوقع');
    }
  }

  private async changePassword() {
    this.errorMessage.set('');

    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage.set('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('تأكيد كلمة المرور غير متطابق');
      return;
    }

    this.isLoading.set(true);
    const changed = await this.authService.changePassword(this.username, this.password, this.newPassword);
    this.isLoading.set(false);

    if (!changed.success) {
      this.errorMessage.set(changed.error || 'تعذر تغيير كلمة المرور');
      return;
    }

    this.password = this.newPassword;
    this.newPassword = '';
    this.confirmPassword = '';
    this.requiresPasswordChange.set(false);
    await this.login();
  }
}
