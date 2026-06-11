import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ResultsService } from '../../services/results.service';
import { StudentResult } from '../../models/models';

declare var jspdf: any;

@Component({
  selector: 'app-result',
  imports: [HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <main class="result-page">
      <div class="result-container">

        @if (student()) {
          <!-- Student Info Card -->
          <div class="student-info-card animate-fade-in">
            <div class="info-card-header">
              <div class="info-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2>بيانات الطالب</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">اسم الطالب</span>
                <span class="info-value">{{ student()!.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">رقم الجلوس</span>
                <span class="info-value seat-number">{{ student()!.seatNumber }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">المرحلة الدراسية</span>
                <span class="info-value stage-value">{{ student()!.stage }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">الشعبة</span>
                <span class="info-value track-value">{{ student()!.track }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">المدرسة</span>
                <span class="info-value">{{ student()!.school }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">العام الدراسي</span>
                <span class="info-value">{{ student()!.academicYear }}</span>
              </div>
            </div>
          </div>

          <!-- Result Summary -->
          <div class="result-summary animate-fade-in-up">
            <div class="summary-header">
              <h2>ملخص النتيجة</h2>
            </div>
            <div class="summary-content">
              <!-- Percentage Circle -->
              <div class="percentage-circle-wrapper">
                <div class="percentage-circle"
                  [class.pass]="student()!.status === 'ناجح'"
                  [class.second-round]="student()!.status === 'له دور ثان'"
                  [class.fail]="student()!.status === 'راسب'">
                  <svg class="circle-svg" viewBox="0 0 120 120">
                    <circle class="circle-bg" cx="60" cy="60" r="52" />
                    <circle class="circle-progress" cx="60" cy="60" r="52"
                      [style.stroke-dasharray]="circumference"
                      [style.stroke-dashoffset]="dashOffset()" />
                  </svg>
                  <div class="circle-content">
                    <span class="percentage-value">{{ student()!.percentage }}%</span>
                  </div>
                </div>
                <span class="percentage-label">النسبة المئوية</span>
              </div>

              <!-- Score Details -->
              <div class="score-details">
                <div class="score-item">
                  <span class="score-label">المجموع الكلي</span>
                  <span class="score-value">{{ formatScore(student()!.totalScore) }} / {{ formatScore(student()!.maxTotalScore) }}</span>
                </div>
                <div class="score-item">
                  <span class="score-label">الحالة</span>
                  <span class="status-badge"
                    [class.pass]="student()!.status === 'ناجح'"
                    [class.second-round]="student()!.status === 'له دور ثان'"
                    [class.fail]="student()!.status === 'راسب'">
                    @if (student()!.status === 'ناجح') {
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    } @else if (student()!.status === 'له دور ثان') {
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    }
                    {{ student()!.status }}
                  </span>
                </div>
                @if (student()!.rank) {
                  <div class="score-item">
                    <span class="score-label">الترتيب</span>
                    <span class="score-value rank">{{ student()!.rank }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Grades Table -->
          <div class="grades-section animate-fade-in-up">
            <div class="grades-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              <h2>درجات المواد</h2>
            </div>
            <div class="table-wrapper">
              <table class="grades-table" id="grades-table">
                <thead>
                  <tr>
                    <th>المادة</th>
                    <th>الدرجة</th>
                  </tr>
                </thead>
                <tbody>
                  @for (subject of student()!.subjects; track subject.name) {
                    <tr>
                      <td>{{ subject.name }}</td>
                      <td>
                        @if (subject.isAbsent) {
                          <span class="grade-absent">غائب</span>
                        } @else {
                          <span class="grade-value" [class.low]="subject.failed">{{ formatScore(subject.grade ?? 0) }}</span>
                          <span class="grade-max">/ {{ formatScore(subject.maxGrade) }}</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <td>المجموع الكلي</td>
                    <td>
                      <span class="grade-total">{{ formatScore(student()!.totalScore) }}</span>
                      <span class="grade-max">/ {{ formatScore(student()!.maxTotalScore) }}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- QR Code Placeholder -->
          <div class="qr-section animate-fade-in-up">
            <div class="qr-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>
              <h2>رمز التحقق</h2>
            </div>
            <div class="qr-content">
              <div class="qr-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>
              </div>
              <p class="qr-note">يمكن مسح رمز التحقق للتأكد من صحة النتيجة</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-bar no-print animate-fade-in-up">
            <button class="action-btn print-btn" (click)="printResult()" id="print-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
              طباعة النتيجة
            </button>
            <button class="action-btn pdf-btn" (click)="downloadPDF()" id="pdf-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              تحميل PDF
            </button>
            <button class="action-btn back-btn" (click)="goBack()" id="back-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              العودة للبحث
            </button>
          </div>
        } @else {
          <!-- Not Found -->
          <div class="not-found animate-fade-in">
            <div class="not-found-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <h2>لم يتم العثور على النتيجة</h2>
            <p>لا توجد نتيجة مسجلة لرقم الجلوس المدخل</p>
            <button class="action-btn back-btn" (click)="goBack()">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              العودة للبحث
            </button>
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
  styles: [`
    .result-page {
      padding: 40px 0 60px;
      min-height: 60vh;
    }

    .result-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 var(--container-padding);
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    /* Student Info Card */
    .student-info-card {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow);
      overflow: hidden;
      border: 1px solid var(--gov-border-light);
    }

    .info-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 28px;
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
      color: white;
    }

    .info-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info-card-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }

    .info-item {
      padding: 16px 28px;
      border-bottom: 1px solid var(--gov-border-light);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item:nth-child(odd) {
      border-left: 1px solid var(--gov-border-light);
    }

    .info-item:last-child,
    .info-item:nth-last-child(2):nth-child(odd) ~ .info-item {
      border-bottom: none;
    }

    .info-label {
      font-size: 0.8rem;
      color: var(--gov-text-muted);
      font-weight: 500;
    }

    .info-value {
      font-size: 1rem;
      color: var(--gov-text);
      font-weight: 600;
    }

    .stage-value {
      color: var(--gov-navy);
      font-weight: 700;
    }

    .track-value {
      color: var(--gov-gold-dark);
      font-weight: 700;
    }

    .seat-number {
      color: var(--gov-blue);
      font-size: 1.1rem;
      font-weight: 700;
    }

    /* Result Summary */
    .result-summary {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow);
      overflow: hidden;
      border: 1px solid var(--gov-border-light);
    }

    .summary-header {
      padding: 20px 28px;
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
      color: white;
    }

    .summary-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .summary-content {
      padding: 36px 28px;
      display: flex;
      align-items: center;
      gap: 48px;
    }

    /* Percentage Circle */
    .percentage-circle-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .percentage-circle {
      width: 140px;
      height: 140px;
      position: relative;
    }

    .circle-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .circle-bg {
      fill: none;
      stroke: var(--gov-border-light);
      stroke-width: 8;
    }

    .circle-progress {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s ease;
    }

    .percentage-circle.pass .circle-progress {
      stroke: var(--gov-success);
    }

    .percentage-circle.second-round .circle-progress {
      stroke: var(--gov-gold-dark);
    }

    .percentage-circle.fail .circle-progress {
      stroke: var(--gov-danger);
    }

    .circle-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .percentage-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--gov-navy);
    }

    .percentage-label {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
      font-weight: 600;
    }

    /* Score Details */
    .score-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .score-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: var(--gov-bg);
      border-radius: var(--gov-radius);
      border: 1px solid var(--gov-border-light);
    }

    .score-label {
      font-size: 0.95rem;
      color: var(--gov-text-light);
      font-weight: 600;
    }

    .score-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--gov-navy);
    }

    .score-value.rank {
      color: var(--gov-gold-dark);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border-radius: 24px;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .status-badge svg {
      width: 18px;
      height: 18px;
    }

    .status-badge.pass {
      background: var(--gov-success-bg);
      color: var(--gov-success);
      border: 1px solid rgba(39, 174, 96, 0.2);
    }

    .status-badge.second-round {
      background: rgba(212, 175, 55, 0.12);
      color: var(--gov-gold-dark);
      border: 1px solid rgba(212, 175, 55, 0.3);
    }

    .status-badge.fail {
      background: var(--gov-danger-bg);
      color: var(--gov-danger);
      border: 1px solid rgba(231, 76, 60, 0.2);
    }

    /* Grades Table */
    .grades-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow);
      overflow: hidden;
      border: 1px solid var(--gov-border-light);
    }

    .grades-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 28px;
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
      color: white;
    }

    .grades-header svg {
      width: 24px;
      height: 24px;
    }

    .grades-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .grades-table {
      width: 100%;
      border-collapse: collapse;
    }

    .grades-table thead {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
    }

    .grades-table th {
      padding: 16px 28px;
      text-align: right;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--gov-gold-dark);
      border-bottom: 2px solid var(--gov-gold);
    }

    .grades-table td {
      padding: 14px 28px;
      border-bottom: 1px solid var(--gov-border-light);
      font-size: 0.95rem;
    }

    .grades-table tbody tr:nth-child(even) {
      background: var(--gov-bg);
    }

    .grades-table tbody tr:hover {
      background: rgba(0, 90, 156, 0.04);
    }

    .grade-value {
      font-weight: 700;
      color: var(--gov-navy);
      font-size: 1.05rem;
    }

    .grade-value.low {
      color: var(--gov-navy);
    }

    .grade-max {
      color: var(--gov-text-muted);
      font-size: 0.85rem;
      margin-right: 4px;
    }

    .grade-absent {
      color: var(--gov-gold-dark);
      font-weight: 700;
      font-size: 0.98rem;
    }

    .grades-table tfoot {
      background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
    }

    .grades-table tfoot td {
      padding: 16px 28px;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      border: none;
    }

    .grade-total {
      font-weight: 800;
      font-size: 1.15rem;
    }

    .grades-table tfoot .grade-max {
      color: rgba(255, 255, 255, 0.65);
    }

    /* Actions */
    .actions-bar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: var(--gov-radius);
      font-weight: 700;
      font-size: 0.95rem;
      transition: all var(--transition);
      flex: 1;
      justify-content: center;
      min-width: 160px;
    }

    .action-btn svg {
      width: 20px;
      height: 20px;
    }

    .print-btn {
      background: var(--gov-navy);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 51, 102, 0.2);
    }

    .print-btn:hover {
      background: var(--gov-navy-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
    }

    .pdf-btn {
      background: linear-gradient(135deg, var(--gov-gold) 0%, var(--gov-gold-dark) 100%);
      color: var(--gov-navy);
      box-shadow: var(--gov-shadow-gold);
    }

    .pdf-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
    }

    .back-btn {
      background: var(--gov-white);
      color: var(--gov-navy);
      border: 2px solid var(--gov-border);
      box-shadow: var(--gov-shadow-sm);
    }

    .back-btn:hover {
      border-color: var(--gov-navy);
      transform: translateY(-2px);
      box-shadow: var(--gov-shadow);
    }

    /* Not Found */
    .not-found {
      text-align: center;
      padding: 80px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .not-found-icon {
      color: var(--gov-text-muted);
      opacity: 0.5;
      margin-bottom: 8px;
    }

    .not-found h2 {
      font-size: 1.4rem;
      color: var(--gov-navy);
    }

    .not-found p {
      color: var(--gov-text-muted);
      font-size: 1rem;
    }

    .not-found .back-btn {
      margin-top: 16px;
      flex: none;
    }

    /* QR Code Section */
    .qr-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow);
      overflow: hidden;
      border: 1px solid var(--gov-border-light);
    }

    .qr-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 28px;
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
      color: white;
    }

    .qr-header svg {
      width: 24px;
      height: 24px;
    }

    .qr-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .qr-content {
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .qr-placeholder {
      width: 120px;
      height: 120px;
      border: 3px dashed var(--gov-border);
      border-radius: var(--gov-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gov-bg);
      color: var(--gov-text-muted);
      opacity: 0.5;
    }

    .qr-note {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
      font-weight: 500;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-item:nth-child(odd) {
        border-left: none;
      }

      .summary-content {
        flex-direction: column;
        gap: 32px;
      }

      .actions-bar {
        flex-direction: column;
      }

      .action-btn {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .result-page {
        padding: 24px 0 40px;
      }

      .info-item {
        padding: 12px 20px;
      }

      .grades-table th,
      .grades-table td,
      .grades-table tfoot td {
        padding: 12px 16px;
      }
    }

    /* Print Styles */
    @media print {
      .result-page {
        padding: 0;
      }

      .student-info-card,
      .result-summary,
      .grades-section {
        box-shadow: none !important;
        border: 1px solid #ddd !important;
        break-inside: avoid;
      }

      .info-card-header,
      .summary-header,
      .grades-header {
        background: #003366 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .grades-table tfoot {
        background: #003366 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .grades-table thead {
        background: rgba(212, 175, 55, 0.1) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `]
})
export class ResultComponent implements OnInit {
  student = signal<StudentResult | null>(null);
  circumference = 2 * Math.PI * 52;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultsService: ResultsService
  ) {}

  ngOnInit() {
    const seatNumber = this.route.snapshot.paramMap.get('seatNumber');
    if (seatNumber) {
      this.loadStudent(seatNumber);
    }
  }

  private async loadStudent(seatNumber: string) {
    const result = await this.resultsService.searchBySeatNumber(seatNumber);
    this.student.set(result);
  }

  dashOffset(): number {
    const student = this.student();
    if (!student) return this.circumference;
    const progress = student.percentage / 100;
    return this.circumference * (1 - progress);
  }

  formatScore(value: number): string {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }
    return rounded.toFixed(3);
  }

  printResult() {
    window.print();
  }

  async downloadPDF() {
    const student = this.student();
    if (!student) return;

    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);

    const source = document.querySelector('.result-container') as HTMLElement | null;
    if (!source) return;

    const canvas = await html2canvas(source, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      ignoreElements: (element: Element) => element.classList.contains('no-print')
    });

    const image = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const printWidth = pageWidth - margin * 2;
    const printHeight = (canvas.height * printWidth) / canvas.width;

    let heightLeft = printHeight;
    let position = margin;

    pdf.addImage(image, 'PNG', margin, position, printWidth, printHeight);
    heightLeft -= (pageHeight - margin * 2);

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (printHeight - heightLeft);
      pdf.addImage(image, 'PNG', margin, position, printWidth, printHeight);
      heightLeft -= (pageHeight - margin * 2);
    }

    pdf.save(`result_${student.seatNumber}.pdf`);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
