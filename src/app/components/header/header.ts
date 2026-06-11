import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Top gold accent bar -->
    <div class="top-accent"></div>

    <!-- Main header -->
    <header class="gov-header">
      <div class="header-container">
        <div class="header-content">
          <!-- Logo & Title -->
          <div class="header-brand">
            <img src="Logo/logo.jpg" alt="شعار المدرسة" class="school-logo" />
            <div class="header-text">
              <h1 class="school-name">مدرسة الشهيد ملازم اول حمادة فهمي مباشر الثانوية المشتركة</h1>
              <p class="academic-year">العام الدراسي 2025 / 2026</p>
            </div>
          </div>

          <!-- Eagle emblem -->
          <div class="header-emblem">
            <div class="emblem-circle">
              <img src="Logo/Ministry.png" alt="شعار الوزارة" class="ministry-emblem" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="gov-nav no-print">
      <div class="nav-container">
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            الرئيسية
          </a>
          @if (authService.isAdmin()) {
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              لوحة التحكم
            </a>
          }
        </div>
        <div class="nav-actions">
          @if (authService.isLoggedIn()) {
            <div class="user-info">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <span>{{ authService.currentUser()?.displayName }}</span>
            </div>
            <button class="nav-btn logout-btn" (click)="logout()">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
              خروج
            </button>
          }
          <span class="badge">جمهورية مصر العربية</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .top-accent {
      height: 4px;
      background: linear-gradient(90deg, var(--gov-gold) 0%, var(--gov-gold-light) 50%, var(--gov-gold) 100%);
    }

    .gov-header {
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-navy-dark) 100%);
      padding: 20px 0;
      position: relative;
      overflow: hidden;
    }

    .gov-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .header-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--container-padding);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
    }

    .school-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border-radius: 50%;
      border: 3px solid var(--gov-gold);
      padding: 2px;
      background: white;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .header-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .school-name {
      font-family: var(--font-primary);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--gov-white);
      line-height: 1.5;
      letter-spacing: 0;
    }

    .academic-year {
      font-family: var(--font-secondary);
      font-size: 0.9rem;
      color: var(--gov-gold);
      font-weight: 500;
    }

    .header-emblem { flex-shrink: 0; }

    .emblem-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid rgba(212, 175, 55, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(212, 175, 55, 0.05);
    }

    .ministry-emblem {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    /* Navigation */
    .gov-nav {
      background: var(--gov-blue);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .nav-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--container-padding);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      font-size: 0.95rem;
      transition: all var(--transition);
      position: relative;
      border-bottom: 3px solid transparent;
    }

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-bottom-color: var(--gov-gold);
    }

    .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.8rem;
      font-weight: 500;
    }

    .user-info svg { width: 16px; height: 16px; }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all var(--transition);
      cursor: pointer;
      white-space: nowrap;
    }

    .nav-btn svg { width: 16px; height: 16px; }

    .logout-btn {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .logout-btn:hover {
      background: rgba(231, 76, 60, 0.3);
      color: white;
      border-color: rgba(231, 76, 60, 0.4);
    }

    .badge {
      background: rgba(212, 175, 55, 0.15);
      color: var(--gov-gold-light);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid rgba(212, 175, 55, 0.25);
      white-space: nowrap;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content { flex-direction: column; text-align: center; }
      .header-brand { flex-direction: column; text-align: center; }
      .school-name { font-size: 1.05rem; text-align: center; }
      .school-logo { width: 64px; height: 64px; }
      .header-emblem { display: none; }

      .nav-container {
        flex-direction: column;
        gap: 8px;
        padding: 8px var(--container-padding);
      }

      .nav-links { width: 100%; justify-content: center; }
      .nav-link { padding: 10px 16px; font-size: 0.85rem; }
      .nav-actions { flex-wrap: wrap; justify-content: center; }
      .badge { display: none; }
    }

    @media (max-width: 480px) {
      .school-name { font-size: 0.95rem; }
      .gov-header { padding: 14px 0; }
    }

    @media print {
      .gov-header { background: white !important; padding: 10px 0; border-bottom: 2px solid #003366; }
      .school-name { color: #003366 !important; }
      .academic-year { color: #666 !important; }
      .top-accent { display: none; }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
