import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ResultsService } from '../../services/results.service';
import { EducationalStage, AcademicTrack } from '../../models/models';

@Component({
  selector: 'app-home',
  imports: [FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg-pattern"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            نتائج الامتحانات
          </div>
          <h1 class="hero-title">نتيجة الشهادة الثانوية</h1>
          <p class="hero-subtitle">استعلم عن النتيجة برقم الجلوس</p>
          <div class="hero-decorative">
            <span class="hero-line"></span>
            <svg
              class="hero-diamond"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
            </svg>
            <span class="hero-line"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="search-container">
        <!-- Step Indicator -->
        <div class="step-indicator animate-fade-in">
          <div class="step" [class.active]="true" [class.done]="selectedStage()">
            <span class="step-num">1</span>
            <span class="step-text">اختيار المرحلة</span>
          </div>
          <div class="step-connector" [class.active]="selectedStage()"></div>
          <div class="step" [class.active]="selectedStage()" [class.done]="selectedTrack()">
            <span class="step-num">2</span>
            <span class="step-text">اختيار الشعبة</span>
          </div>
          <div class="step-connector" [class.active]="selectedTrack()"></div>
          <div class="step" [class.active]="selectedTrack()">
            <span class="step-num">3</span>
            <span class="step-text">الاستعلام</span>
          </div>
        </div>

        <!-- Step 1: Stage Selection -->
        <div class="stage-selection animate-fade-in">
          <h2 class="section-title">
            <span class="step-badge">1</span>
            اختر المرحلة الدراسية
          </h2>
          <div class="stage-cards">
            <button
              class="stage-card"
              [class.active]="selectedStage() === 'أولى ثانوي'"
              (click)="selectStage('أولى ثانوي')"
              id="stage-first"
            >
              <div class="stage-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path
                    d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
                  />
                </svg>
              </div>
              <div class="stage-card-content">
                <span class="stage-label">أولى ثانوي</span>
                <span class="stage-sublabel">First Secondary</span>
                <span class="stage-track-hint">عام</span>
              </div>
              @if (selectedStage() === 'أولى ثانوي') {
                <div class="selected-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              }
            </button>
            <button
              class="stage-card"
              [class.active]="selectedStage() === 'ثانية ثانوي'"
              (click)="selectStage('ثانية ثانوي')"
              id="stage-second"
            >
              <div class="stage-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path
                    d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
                  />
                </svg>
              </div>
              <div class="stage-card-content">
                <span class="stage-label">ثانية ثانوي</span>
                <span class="stage-sublabel">Second Secondary</span>
                <span class="stage-track-hint">علمي / أدبي</span>
              </div>
              @if (selectedStage() === 'ثانية ثانوي') {
                <div class="selected-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              }
            </button>
          </div>
        </div>

        <!-- Step 2: Track Selection (appears after stage is selected) -->
        @if (selectedStage()) {
          <div class="track-selection animate-fade-in-up">
            <h2 class="section-title">
              <span class="step-badge">2</span>
              @if (selectedStage() === 'أولى ثانوي') {
                الشعبة: عام
              } @else {
                اختر الشعبة
              }
            </h2>

            @if (selectedStage() === 'أولى ثانوي') {
              <!-- Auto-selected as عام -->
              <div class="auto-track-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>تم اختيار الشعبة العامة تلقائياً لطلاب الصف الأول الثانوي</span>
              </div>
            } @else {
              <!-- Scientific / Literary choice -->
              <div class="track-cards">
                <button
                  class="track-card"
                  [class.active]="selectedTrack() === 'علمي'"
                  (click)="selectTrack('علمي')"
                  id="track-scientific"
                >
                  <div class="track-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                    </svg>
                  </div>
                  <span class="track-label">علمي</span>
                  <span class="track-sublabel">Scientific</span>
                </button>
                <button
                  class="track-card"
                  [class.active]="selectedTrack() === 'أدبي'"
                  (click)="selectTrack('أدبي')"
                  id="track-literary"
                >
                  <div class="track-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path
                        d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
                      />
                    </svg>
                  </div>
                  <span class="track-label">أدبي</span>
                  <span class="track-sublabel">Literary</span>
                </button>
              </div>
            }
          </div>
        }

        <!-- Search Card (appears after track is selected) -->
        @if (selectedTrack()) {
          <div class="search-card animate-fade-in-up">
            <div class="search-card-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <h3>استعلم عن النتيجة</h3>
            </div>

            <form (ngSubmit)="searchResult()" class="search-form">
              <!-- Selected stage & track badges -->
              <div class="selection-badges">
                <div class="sel-badge stage-sel">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path
                      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
                    />
                  </svg>
                  {{ selectedStage() }}
                </div>
                <div class="sel-badge track-sel">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  {{ selectedTrack() }}
                </div>
              </div>

              <div class="form-group">
                <label for="seatNumber" class="form-label">رقم الجلوس</label>
                <div class="input-wrapper">
                  <svg
                    class="input-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  <input
                    type="text"
                    id="seatNumber"
                    [(ngModel)]="seatNumber"
                    name="seatNumber"
                    placeholder="أدخل رقم الجلوس"
                    class="form-input"
                    required
                    autocomplete="off"
                  />
                </div>
              </div>

              @if (errorMessage()) {
                <div class="error-message">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    />
                  </svg>
                  {{ errorMessage() }}
                </div>
              }

              <button
                type="submit"
                class="search-btn"
                [disabled]="!seatNumber || !selectedTrack() || isSearching()"
                id="search-btn"
              >
                @if (isSearching()) {
                  <span class="spinner"></span>
                  جاري البحث...
                } @else {
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path
                      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    />
                  </svg>
                  استعلم عن النتيجة
                }
              </button>
            </form>
          </div>
        }
      </div>
    </section>

    <!-- Announcements -->
    <section class="announcements-section">
      <div class="section-container">
        <h2 class="section-heading">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path
              d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1l5 3V6L5 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"
            />
          </svg>
          إعلانات هامة
        </h2>
        <div class="announcements-grid">
          <div class="announcement-card">
            <div class="announcement-icon success">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </div>
            <h3>موعد ظهور النتيجة</h3>
            <p>سيتم الإعلان عن النتيجة فور اعتمادها رسمياً من الإدارة التعليمية</p>
          </div>
          <div class="announcement-card">
            <div class="announcement-icon info">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                />
              </svg>
            </div>
            <h3>التظلمات</h3>
            <p>باب التظلمات مفتوح لمدة 15 يوم من تاريخ إعلان النتيجة</p>
          </div>
          <div class="announcement-card">
            <div class="announcement-icon warning">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h3>تنبيه هام</h3>
            <p>يرجى التأكد من رقم الجلوس قبل الاستعلام عن النتيجة</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Instructions -->
    <section class="instructions-section">
      <div class="section-container">
        <h2 class="section-heading">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path
              d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
            />
          </svg>
          تعليمات الاستعلام
        </h2>
        <div class="instructions-card">
          <ul class="instructions-list">
            <li>
              <span class="step-number">1</span>
              <span>اختر المرحلة الدراسية (أولى ثانوي أو ثانية ثانوي)</span>
            </li>
            <li>
              <span class="step-number">2</span>
              <span>اختر الشعبة الدراسية (عام، علمي، أو أدبي)</span>
            </li>
            <li>
              <span class="step-number">3</span>
              <span>أدخل رقم الجلوس الخاص بالطالب</span>
            </li>
            <li>
              <span class="step-number">4</span>
              <span>اضغط على زر "استعلم عن النتيجة"</span>
            </li>
            <li>
              <span class="step-number">5</span>
              <span>يمكنك طباعة النتيجة أو تحميلها كملف PDF</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="contact-section">
      <div class="section-container">
        <h2 class="section-heading">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          تواصل معنا
        </h2>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
            </div>
            <h3>العنوان</h3>
            <p>جمهورية مصر العربية</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                />
              </svg>
            </div>
            <h3>الهاتف</h3>
            <p dir="ltr">055 2630316</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
            </div>
            <h3>البريد الإلكتروني</h3>
            <p>info&#64;school.edu.eg</p>
          </div>
        </div>
      </div>
    </section>

    <app-footer />
  `,
  styles: [
    `
      /* ===== Hero Section ===== */
      .hero {
        background: linear-gradient(
          135deg,
          var(--gov-navy) 0%,
          var(--gov-blue) 50%,
          var(--gov-navy-dark) 100%
        );
        padding: 40px 0 24px;
        position: relative;
        overflow: hidden;
      }

      .hero-bg-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 50% 80%, rgba(0, 90, 156, 0.15) 0%, transparent 50%);
        pointer-events: none;
      }

      .hero-container {
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 var(--container-padding);
        position: relative;
        z-index: 1;
      }

      .hero-content {
        text-align: center;
        animation: fadeInUp 0.8s ease;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(212, 175, 55, 0.15);
        color: var(--gov-gold-light);
        padding: 8px 20px;
        border-radius: 24px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 16px;
        border: 1px solid rgba(212, 175, 55, 0.25);
      }

      .hero-badge svg {
        width: 16px;
        height: 16px;
      }

      .hero-title {
        font-family: var(--font-primary);
        font-size: 2.2rem;
        font-weight: 800;
        color: var(--gov-white);
        margin-bottom: 10px;
        line-height: 1.3;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .hero-subtitle {
        font-family: var(--font-secondary);
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.75);
        font-weight: 400;
        margin-bottom: 16px;
      }

      .hero-decorative {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .hero-line {
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gov-gold), transparent);
        border-radius: 1px;
      }

      .hero-diamond {
        color: var(--gov-gold);
        width: 16px;
        height: 16px;
        animation: pulse 2s ease-in-out infinite;
      }

      /* ===== Step Indicator ===== */
      .step-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        margin-bottom: 32px;
        padding: 20px 0;
      }

      .step {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 24px;
        background: var(--gov-bg);
        border: 2px solid var(--gov-border);
        transition: all 0.3s ease;
      }

      .step.active {
        border-color: var(--gov-blue);
        background: rgba(0, 90, 156, 0.06);
      }

      .step.done {
        border-color: var(--gov-gold);
        background: rgba(212, 175, 55, 0.08);
      }

      .step-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--gov-border);
        color: var(--gov-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.8rem;
        transition: all 0.3s ease;
      }

      .step.active .step-num {
        background: var(--gov-blue);
        color: white;
      }

      .step.done .step-num {
        background: var(--gov-gold);
        color: var(--gov-navy);
      }

      .step-text {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--gov-text-muted);
        transition: color 0.3s ease;
      }

      .step.active .step-text {
        color: var(--gov-navy);
      }

      .step.done .step-text {
        color: var(--gov-gold-dark);
      }

      .step-connector {
        width: 40px;
        height: 2px;
        background: var(--gov-border);
        transition: background 0.3s ease;
      }

      .step-connector.active {
        background: linear-gradient(90deg, var(--gov-gold), var(--gov-blue));
      }

      /* ===== Search Section ===== */
      .search-section {
        padding: 48px 0 64px;
        margin-top: -32px;
        position: relative;
        z-index: 2;
      }

      .search-container {
        max-width: 780px;
        margin: 0 auto;
        padding: 0 var(--container-padding);
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--gov-navy);
        margin-bottom: 20px;
      }

      .step-badge {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        flex-shrink: 0;
      }

      /* Stage Selection */
      .stage-selection {
        margin-bottom: 28px;
      }

      .stage-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .stage-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px 20px;
        background: var(--gov-white);
        border: 2px solid var(--gov-border);
        border-radius: var(--gov-radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--gov-shadow-sm);
        position: relative;
        text-align: right;
      }

      .stage-card:hover {
        border-color: var(--gov-blue);
        box-shadow: var(--gov-shadow);
        transform: translateY(-3px);
      }

      .stage-card.active {
        border-color: var(--gov-gold);
        background: linear-gradient(
          135deg,
          rgba(212, 175, 55, 0.06) 0%,
          rgba(212, 175, 55, 0.02) 100%
        );
        box-shadow: var(--gov-shadow-gold);
      }

      .stage-card-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: var(--gov-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gov-navy);
        flex-shrink: 0;
        transition: all 0.3s ease;
      }

      .stage-card.active .stage-card-icon {
        background: var(--gov-gold);
        color: var(--gov-navy);
      }

      .stage-card-icon svg {
        width: 28px;
        height: 28px;
      }

      .stage-card-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
      }

      .stage-label {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--gov-navy);
      }

      .stage-sublabel {
        font-size: 0.78rem;
        color: var(--gov-text-muted);
      }

      .stage-track-hint {
        font-size: 0.75rem;
        color: var(--gov-blue);
        font-weight: 600;
        margin-top: 4px;
        padding: 2px 10px;
        background: rgba(0, 90, 156, 0.06);
        border-radius: 8px;
        display: inline-block;
        width: fit-content;
      }

      .selected-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--gov-gold);
        color: var(--gov-navy);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      }

      /* Track Selection */
      .track-selection {
        margin-bottom: 28px;
      }

      .auto-track-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        background: rgba(212, 175, 55, 0.08);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: var(--gov-radius);
        color: var(--gov-gold-dark);
        font-weight: 600;
        font-size: 0.92rem;
      }

      .auto-track-badge svg {
        width: 20px;
        height: 20px;
        color: var(--gov-gold-dark);
        flex-shrink: 0;
      }

      .track-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .track-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 24px 16px;
        background: var(--gov-white);
        border: 2px solid var(--gov-border);
        border-radius: var(--gov-radius-md);
        cursor: pointer;
        transition: all var(--transition);
        box-shadow: var(--gov-shadow-sm);
      }

      .track-card:hover {
        border-color: var(--gov-blue);
        box-shadow: var(--gov-shadow);
        transform: translateY(-2px);
      }

      .track-card.active {
        border-color: var(--gov-gold);
        background: linear-gradient(
          135deg,
          rgba(212, 175, 55, 0.05) 0%,
          rgba(212, 175, 55, 0.02) 100%
        );
        box-shadow: var(--gov-shadow-gold);
      }

      .track-card.active .track-icon {
        background: var(--gov-gold);
        color: var(--gov-navy);
      }

      .track-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--gov-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gov-navy);
        transition: all var(--transition);
      }

      .track-icon svg {
        width: 28px;
        height: 28px;
      }

      .track-label {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--gov-navy);
      }

      .track-sublabel {
        font-size: 0.8rem;
        color: var(--gov-text-muted);
        font-weight: 400;
      }

      /* Selection Badges */
      .selection-badges {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .sel-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .sel-badge svg {
        width: 14px;
        height: 14px;
      }

      .sel-badge.stage-sel {
        background: rgba(0, 51, 102, 0.08);
        color: var(--gov-navy);
        border: 1px solid rgba(0, 51, 102, 0.15);
      }

      .sel-badge.track-sel {
        background: rgba(212, 175, 55, 0.1);
        color: var(--gov-gold-dark);
        border: 1px solid rgba(212, 175, 55, 0.25);
      }

      /* Search Card */
      .search-card {
        background: var(--gov-white);
        border-radius: var(--gov-radius-md);
        box-shadow: var(--gov-shadow-md);
        overflow: hidden;
        border: 1px solid var(--gov-border-light);
      }

      .search-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 28px;
        background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
        color: white;
      }

      .search-card-header svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .search-card-header h3 {
        font-size: 1.1rem;
        font-weight: 700;
      }

      .search-form {
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
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--gov-text);
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border: 2px solid var(--gov-border);
        border-radius: var(--gov-radius);
        transition: all var(--transition);
        background: var(--gov-bg);
      }

      .input-wrapper:focus-within {
        border-color: var(--gov-blue);
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.1);
      }

      .input-icon {
        width: 20px;
        height: 20px;
        color: var(--gov-text-muted);
        flex-shrink: 0;
      }

      .form-input {
        flex: 1;
        font-size: 1rem;
        color: var(--gov-text);
        background: transparent;
        direction: rtl;
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

      .error-message svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      .search-btn {
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

      .search-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
      }

      .search-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .search-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }

      .search-btn svg {
        width: 20px;
        height: 20px;
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(0, 51, 102, 0.2);
        border-top: 2px solid var(--gov-navy);
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ===== Announcements ===== */
      .announcements-section,
      .instructions-section,
      .contact-section {
        padding: 48px 0;
      }

      .section-container {
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 var(--container-padding);
      }

      .section-heading {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--gov-navy);
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 3px solid var(--gov-gold);
      }

      .section-heading svg {
        width: 24px;
        height: 24px;
        color: var(--gov-gold);
      }

      .announcements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }

      .announcement-card {
        background: var(--gov-white);
        border-radius: var(--gov-radius-md);
        padding: 28px;
        box-shadow: var(--gov-shadow);
        border: 1px solid var(--gov-border-light);
        transition: all var(--transition);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .announcement-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--gov-shadow-md);
      }

      .announcement-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .announcement-icon.success {
        background: var(--gov-success-bg);
        color: var(--gov-success);
      }

      .announcement-icon.info {
        background: var(--gov-info-bg);
        color: var(--gov-info);
      }

      .announcement-icon.warning {
        background: var(--gov-warning-bg);
        color: var(--gov-warning);
      }

      .announcement-icon svg {
        width: 24px;
        height: 24px;
      }

      .announcement-card h3 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--gov-navy);
      }

      .announcement-card p {
        font-size: 0.9rem;
        color: var(--gov-text-light);
        line-height: 1.7;
      }

      /* ===== Instructions ===== */
      .instructions-section {
        background: var(--gov-bg-alt);
      }

      .instructions-card {
        background: var(--gov-white);
        border-radius: var(--gov-radius-md);
        padding: 32px;
        box-shadow: var(--gov-shadow);
        border: 1px solid var(--gov-border-light);
      }

      .instructions-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .instructions-list li {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 1rem;
        color: var(--gov-text);
        line-height: 1.6;
      }

      .step-number {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        flex-shrink: 0;
      }

      /* ===== Contact ===== */
      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
      }

      .contact-card {
        background: var(--gov-white);
        border-radius: var(--gov-radius-md);
        padding: 32px;
        text-align: center;
        box-shadow: var(--gov-shadow);
        border: 1px solid var(--gov-border-light);
        transition: all var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .contact-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--gov-shadow-md);
      }

      .contact-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .contact-icon svg {
        width: 28px;
        height: 28px;
      }

      .contact-card h3 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--gov-navy);
      }

      .contact-card p {
        font-size: 0.9rem;
        color: var(--gov-text-light);
      }

      /* ===== Responsive ===== */
      @media (max-width: 768px) {
        .hero {
          padding: 28px 0 18px;
        }

        .hero-title {
          font-size: 1.7rem;
        }

        .hero-subtitle {
          font-size: 0.95rem;
        }

        .search-section {
          padding: 32px 0 48px;
        }

        .step-indicator {
          flex-wrap: wrap;
          gap: 8px;
        }

        .step-connector {
          display: none;
        }

        .stage-cards {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .section-heading {
          font-size: 1.2rem;
        }
      }

      @media (max-width: 480px) {
        .hero-title {
          font-size: 1.4rem;
        }

        .track-cards {
          gap: 12px;
        }

        .track-card {
          padding: 16px 12px;
        }

        .search-form {
          padding: 20px;
        }

        .announcement-card {
          padding: 20px;
        }

        .step {
          padding: 6px 12px;
        }

        .step-text {
          font-size: 0.75rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  selectedStage = signal<EducationalStage | null>(null);
  selectedTrack = signal<AcademicTrack | null>(null);
  seatNumber = '';
  errorMessage = signal<string>('');
  isSearching = signal(false);

  constructor(
    private router: Router,
    private resultsService: ResultsService,
  ) {}

  selectStage(stage: EducationalStage) {
    this.selectedStage.set(stage);
    this.errorMessage.set('');

    if (stage === 'أولى ثانوي') {
      // Auto-set track to عام for first secondary
      this.selectedTrack.set('عام');
    } else {
      // Reset track when switching to second secondary
      this.selectedTrack.set(null);
    }
  }

  selectTrack(track: AcademicTrack) {
    this.selectedTrack.set(track);
    this.errorMessage.set('');
  }

  async searchResult() {
    this.errorMessage.set('');

    if (!this.selectedStage()) {
      this.errorMessage.set('يرجى اختيار المرحلة الدراسية أولاً');
      return;
    }

    if (!this.selectedTrack()) {
      this.errorMessage.set('يرجى اختيار الشعبة أولاً');
      return;
    }

    if (!this.seatNumber.trim()) {
      this.errorMessage.set('يرجى إدخال رقم الجلوس');
      return;
    }

    this.isSearching.set(true);

    // Simulate brief search delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const result = await this.resultsService.searchBySeatNumber(
      this.seatNumber.trim(),
      this.selectedStage()!,
      this.selectedTrack()!,
    );

    this.isSearching.set(false);

    if (!result) {
      const isPublished = this.resultsService.isPublished();
      if (!isPublished) {
        this.errorMessage.set('لم يتم نشر النتيجة بعد، يرجى المحاولة لاحقاً');
      } else {
        this.errorMessage.set('لم يتم العثور على نتيجة برقم الجلوس المدخل');
      }
      return;
    }

    this.router.navigate(['/result', this.seatNumber.trim()]);
  }
}
