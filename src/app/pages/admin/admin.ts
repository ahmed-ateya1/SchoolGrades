import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ResultsService } from '../../services/results.service';
import { AuthService } from '../../services/auth.service';
import { StudentResult, EducationalStage, AcademicTrack } from '../../models/models';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <main class="admin-page">
      <div class="admin-container">
        <!-- Page Title -->
        <div class="page-title-bar">
          <div class="title-content">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <div>
              <h1>لوحة التحكم الإدارية</h1>
              <p>إدارة نتائج الطلاب ورفع ملفات الدرجات</p>
            </div>
          </div>
        </div>

        <!-- Statistics Cards (5 cards) -->
        <div class="stats-grid">
          <div class="stat-card first-secondary">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats().firstSecondaryCount }}</span>
              <span class="stat-label">أولى ثانوي عام</span>
            </div>
          </div>
          <div class="stat-card second-scientific">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats().secondScientificCount }}</span>
              <span class="stat-label">ثانية ثانوي علمي</span>
            </div>
          </div>
          <div class="stat-card second-literary">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats().secondLiteraryCount }}</span>
              <span class="stat-label">ثانية ثانوي أدبي</span>
            </div>
          </div>
          <div class="stat-card total">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats().totalStudents }}</span>
              <span class="stat-label">إجمالي الطلاب</span>
            </div>
          </div>
          <div class="stat-card publish" [class.published]="stats().isPublished">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats().isPublished ? 'منشورة' : 'غير منشورة' }}</span>
              <span class="stat-label">حالة النتيجة</span>
            </div>
          </div>
        </div>

        <!-- Upload Section (3 zones) -->
        <div class="upload-section">
          <h2 class="admin-section-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
            رفع ملفات النتائج
          </h2>
          <div class="upload-grid-3">
            <!-- First Secondary Upload -->
            <div class="upload-card">
              <div class="upload-card-header first-secondary-header">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                <h3>رفع ملف أولى ثانوي</h3>
              </div>
              <div class="upload-zone" (click)="firstSecInput.click()"
                   (dragover)="onDragOver($event)" (drop)="onDrop($event, 'أولى ثانوي', 'عام')">
                <input #firstSecInput type="file" accept=".xlsx,.xls" hidden
                       (change)="onFileSelected($event, 'أولى ثانوي', 'عام')" id="upload-first-secondary" />
                <div class="upload-zone-content">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                  <p>اسحب الملف هنا أو اضغط للاختيار</p>
                  <span class="upload-hint">.xlsx أو .xls</span>
                </div>
              </div>
              @if (firstSecFileName()) {
                <div class="file-selected">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
                  <span>{{ firstSecFileName() }}</span>
                </div>
              }
            </div>

            <!-- Second Scientific Upload -->
            <div class="upload-card">
              <div class="upload-card-header scientific-header">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
                <h3>رفع ملف ثانية ثانوي - علمي</h3>
              </div>
              <div class="upload-zone" (click)="scientificInput.click()"
                   (dragover)="onDragOver($event)" (drop)="onDrop($event, 'ثانية ثانوي', 'علمي')">
                <input #scientificInput type="file" accept=".xlsx,.xls" hidden
                       (change)="onFileSelected($event, 'ثانية ثانوي', 'علمي')" id="upload-scientific" />
                <div class="upload-zone-content">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                  <p>اسحب الملف هنا أو اضغط للاختيار</p>
                  <span class="upload-hint">.xlsx أو .xls</span>
                </div>
              </div>
              @if (scientificFileName()) {
                <div class="file-selected">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
                  <span>{{ scientificFileName() }}</span>
                </div>
              }
            </div>

            <!-- Second Literary Upload -->
            <div class="upload-card">
              <div class="upload-card-header literary-header">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                <h3>رفع ملف ثانية ثانوي - أدبي</h3>
              </div>
              <div class="upload-zone" (click)="literaryInput.click()"
                   (dragover)="onDragOver($event)" (drop)="onDrop($event, 'ثانية ثانوي', 'أدبي')">
                <input #literaryInput type="file" accept=".xlsx,.xls" hidden
                       (change)="onFileSelected($event, 'ثانية ثانوي', 'أدبي')" id="upload-literary" />
                <div class="upload-zone-content">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                  <p>اسحب الملف هنا أو اضغط للاختيار</p>
                  <span class="upload-hint">.xlsx أو .xls</span>
                </div>
              </div>
              @if (literaryFileName()) {
                <div class="file-selected">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
                  <span>{{ literaryFileName() }}</span>
                </div>
              }
            </div>
          </div>

          @if (uploadMessage()) {
            <div class="upload-message" [class.success]="uploadSuccess()" [class.error]="!uploadSuccess()">
              @if (uploadSuccess()) {
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              }
              {{ uploadMessage() }}
            </div>
          }

          @if (isUploading()) {
            <div class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <span>جاري استيراد البيانات...</span>
            </div>
          }
        </div>

        <!-- Publish Toggle -->
        <div class="publish-section">
          <div class="publish-card">
            <div class="publish-info">
              <h3>نشر النتيجة</h3>
              <p>عند تفعيل النشر، سيتمكن الطلاب من الاستعلام عن نتائجهم</p>
            </div>
            <button class="publish-toggle" [class.active]="stats().isPublished" (click)="togglePublish()" id="publish-toggle">
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="toggle-label">{{ stats().isPublished ? 'منشورة' : 'غير منشورة' }}</span>
            </button>
          </div>
        </div>

        <!-- Security Management -->
        @if (authService.isSuperAdmin()) {
          <div class="security-section">
            <h2 class="admin-section-title">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.78-7 8.94v-8.94H5V6.3l7-3.11v8.8z"/></svg>
              إدارة كلمات المرور
            </h2>
            <div class="security-grid">
              <div class="form-group-inline">
                <label for="reset-username">اسم المستخدم</label>
                <input id="reset-username" type="text" [(ngModel)]="resetUsername" class="security-input" placeholder="admin أو super" />
              </div>
              <div class="form-group-inline">
                <label for="reset-password">كلمة مرور مؤقتة</label>
                <input id="reset-password" type="password" [(ngModel)]="resetPassword" class="security-input" placeholder="كلمة مرور جديدة" />
              </div>
              <label class="security-checkbox">
                <input type="checkbox" [(ngModel)]="resetMustChangePassword" />
                إجبار تغيير كلمة المرور عند أول دخول
              </label>
              <button class="security-btn" (click)="resetAdminPassword()" [disabled]="isResetting() || !resetUsername.trim() || !resetPassword.trim()">
                {{ isResetting() ? 'جاري التنفيذ...' : 'إعادة تعيين كلمة المرور' }}
              </button>
            </div>
            @if (resetMessage()) {
              <div class="upload-message" [class.success]="resetSuccess()" [class.error]="!resetSuccess()">
                {{ resetMessage() }}
              </div>
            }
          </div>
        }

        <!-- Student Management -->
        <div class="management-section">
          <h2 class="admin-section-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            إدارة الطلاب
          </h2>

          <!-- Filters Row -->
          <div class="filters-row">
            <div class="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input type="text" [(ngModel)]="searchQuery" placeholder="ابحث بالاسم أو رقم الجلوس..." class="admin-search-input" id="admin-search" />
            </div>
            <div class="stage-filter-wrapper">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
              <select [(ngModel)]="stageFilter" class="stage-filter-select" id="stage-filter">
                <option value="all">جميع المراحل</option>
                <option value="أولى ثانوي - عام">أولى ثانوي - عام</option>
                <option value="ثانية ثانوي - علمي">ثانية ثانوي - علمي</option>
                <option value="ثانية ثانوي - أدبي">ثانية ثانوي - أدبي</option>
              </select>
            </div>
          </div>

          <!-- Students Table -->
          @if (paginatedStudents().length > 0) {
            <div class="table-wrapper">
              <table class="admin-table" id="students-table">
                <thead>
                  <tr>
                    <th>رقم الجلوس</th>
                    <th>اسم الطالب</th>
                    <th>المرحلة</th>
                    <th>الشعبة</th>
                    <th>المجموع</th>
                    <th>النسبة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  @for (student of paginatedStudents(); track student.seatNumber) {
                    <tr>
                      <td class="seat-col">{{ student.seatNumber }}</td>
                      <td>{{ student.name }}</td>
                      <td>
                        <span class="stage-chip">{{ student.stage }}</span>
                      </td>
                      <td>
                        <span class="type-chip" [class.scientific]="student.track === 'علمي'" [class.literary]="student.track === 'أدبي'" [class.general]="student.track === 'عام'">
                          {{ student.track }}
                        </span>
                      </td>
                      <td>{{ student.totalScore }} / {{ student.maxTotalScore }}</td>
                      <td>{{ student.percentage }}%</td>
                      <td>
                        <span class="status-chip"
                          [class.pass]="student.status === 'ناجح'"
                          [class.second-round]="student.status === 'له دور ثان'"
                          [class.fail]="student.status === 'راسب'">
                          {{ student.status }}
                        </span>
                      </td>
                      <td class="actions-col">
                        <button class="table-btn edit-btn" (click)="startEdit(student)" title="تعديل">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="table-btn delete-btn" (click)="deleteStudent(student.seatNumber)" title="حذف">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-bar">
              <div class="pagination-info">
                عرض {{ paginationStart() + 1 }} - {{ paginationEnd() }} من {{ filteredStudents().length }} طالب
              </div>
              <div class="pagination-controls">
                <button class="page-btn" [disabled]="currentPage() <= 1" (click)="goToPage(1)" title="الأولى">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"/></svg>
                </button>
                <button class="page-btn" [disabled]="currentPage() <= 1" (click)="goToPage(currentPage() - 1)" title="السابقة">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </button>
                <span class="page-indicator">{{ currentPage() }} / {{ totalPages() }}</span>
                <button class="page-btn" [disabled]="currentPage() >= totalPages()" (click)="goToPage(currentPage() + 1)" title="التالية">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </button>
                <button class="page-btn" [disabled]="currentPage() >= totalPages()" (click)="goToPage(totalPages())" title="الأخيرة">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"/></svg>
                </button>
              </div>
            </div>
          } @else {
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
              <p>لا توجد بيانات طلاب بعد</p>
              <span>قم برفع ملف Excel لاستيراد بيانات الطلاب</span>
            </div>
          }
        </div>

        <!-- Edit Modal -->
        @if (editingStudent()) {
          <div class="modal-overlay" (click)="cancelEdit()">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3>تعديل درجات الطالب</h3>
                <button class="modal-close" (click)="cancelEdit()">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
              <div class="modal-body">
                <div class="edit-info">
                  <span>الطالب: {{ editingStudent()!.name }}</span>
                  <span>رقم الجلوس: {{ editingStudent()!.seatNumber }}</span>
                  <span>{{ editingStudent()!.stage }} - {{ editingStudent()!.track }}</span>
                </div>
                <div class="edit-grades">
                  @for (subject of editSubjects(); track subject.name; let i = $index) {
                    <div class="edit-grade-row">
                      <label>{{ subject.name }}</label>
                      <input type="number" [ngModel]="subject.grade" (ngModelChange)="updateSubjectGrade(i, $event)" min="0" max="100" class="grade-input" />
                    </div>
                  }
                </div>
              </div>
              <div class="modal-footer">
                <button class="modal-btn save-btn" (click)="saveEdit()" id="save-edit-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  حفظ التعديلات
                </button>
                <button class="modal-btn cancel-btn" (click)="cancelEdit()">إلغاء</button>
              </div>
            </div>
          </div>
        }

        <!-- Delete Confirmation -->
        @if (deletingSeatNumber()) {
          <div class="modal-overlay" (click)="cancelDelete()">
            <div class="modal confirm-modal" (click)="$event.stopPropagation()">
              <div class="modal-header danger">
                <h3>تأكيد الحذف</h3>
              </div>
              <div class="modal-body">
                <div class="confirm-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
                <p class="confirm-text">هل أنت متأكد من حذف بيانات هذا الطالب؟</p>
                <p class="confirm-sub">لا يمكن التراجع عن هذا الإجراء</p>
              </div>
              <div class="modal-footer">
                <button class="modal-btn danger-btn" (click)="confirmDelete()">نعم، احذف</button>
                <button class="modal-btn cancel-btn" (click)="cancelDelete()">إلغاء</button>
              </div>
            </div>
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
  styles: [`
    .admin-page {
      padding: 32px 0 60px;
      min-height: 70vh;
    }

    .admin-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--container-padding);
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Page Title */
    .page-title-bar {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 24px 32px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
      border-right: 4px solid var(--gov-gold);
    }

    .title-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .title-content svg {
      color: var(--gov-gold);
      flex-shrink: 0;
    }

    .title-content h1 {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--gov-navy);
    }

    .title-content p {
      font-size: 0.9rem;
      color: var(--gov-text-muted);
      margin-top: 4px;
    }

    /* Stats Grid - 5 cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    .stat-card {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 20px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
      display: flex;
      align-items: center;
      gap: 14px;
      transition: all var(--transition);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--gov-shadow-md);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card.first-secondary .stat-icon {
      background: rgba(46, 134, 193, 0.12);
      color: #2e86c1;
    }

    .stat-card.second-scientific .stat-icon {
      background: rgba(0, 90, 156, 0.1);
      color: var(--gov-blue);
    }

    .stat-card.second-literary .stat-icon {
      background: rgba(212, 175, 55, 0.1);
      color: var(--gov-gold-dark);
    }

    .stat-card.total .stat-icon {
      background: rgba(0, 51, 102, 0.1);
      color: var(--gov-navy);
    }

    .stat-card.publish .stat-icon {
      background: rgba(231, 76, 60, 0.1);
      color: var(--gov-danger);
    }

    .stat-card.publish.published .stat-icon {
      background: rgba(39, 174, 96, 0.1);
      color: var(--gov-success);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .stat-value {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--gov-navy);
      white-space: nowrap;
    }

    .stat-label {
      font-size: 0.78rem;
      color: var(--gov-text-muted);
      font-weight: 500;
      white-space: nowrap;
    }

    /* Section Title */
    .admin-section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--gov-navy);
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--gov-gold);
    }

    .admin-section-title svg {
      color: var(--gov-gold);
    }

    /* Upload Section - 3 zones */
    .upload-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 32px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
    }

    .upload-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .upload-card {
      border: 1px solid var(--gov-border);
      border-radius: var(--gov-radius-md);
      overflow: hidden;
    }

    .upload-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      color: white;
      font-weight: 700;
    }

    .upload-card-header svg {
      width: 22px;
      height: 22px;
    }

    .upload-card-header h3 {
      font-size: 0.88rem;
    }

    .first-secondary-header {
      background: linear-gradient(135deg, #2e86c1, #3498db);
    }

    .scientific-header {
      background: linear-gradient(135deg, var(--gov-blue), var(--gov-blue-light));
    }

    .literary-header {
      background: linear-gradient(135deg, var(--gov-gold-dark), var(--gov-gold));
      color: var(--gov-navy);
    }

    .upload-zone {
      padding: 24px 16px;
      cursor: pointer;
      transition: all var(--transition);
      border: 2px dashed var(--gov-border);
      margin: 12px;
      border-radius: var(--gov-radius);
      background: var(--gov-bg);
    }

    .upload-zone:hover {
      border-color: var(--gov-blue);
      background: rgba(0, 90, 156, 0.03);
    }

    .upload-zone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
    }

    .upload-zone-content svg {
      color: var(--gov-text-muted);
      opacity: 0.5;
    }

    .upload-zone-content p {
      color: var(--gov-text-light);
      font-weight: 600;
      font-size: 0.85rem;
    }

    .upload-hint {
      font-size: 0.75rem;
      color: var(--gov-text-muted);
    }

    .file-selected {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--gov-success-bg);
      color: var(--gov-success);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .file-selected svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .upload-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: var(--gov-radius);
      margin-top: 16px;
      font-weight: 600;
      font-size: 0.95rem;
      animation: fadeIn 0.3s ease;
    }

    .upload-message svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .upload-message.success {
      background: var(--gov-success-bg);
      color: var(--gov-success);
      border: 1px solid rgba(39, 174, 96, 0.2);
    }

    .upload-message.error {
      background: var(--gov-danger-bg);
      color: var(--gov-danger);
      border: 1px solid rgba(231, 76, 60, 0.2);
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
      align-items: center;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: var(--gov-border-light);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--gov-blue), var(--gov-gold));
      border-radius: 3px;
      width: 60%;
      animation: shimmer 1.5s infinite;
      background-size: 200% 100%;
    }

    .upload-progress span {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
    }

    /* Publish Section */
    .publish-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 32px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
    }

    .publish-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .publish-info h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--gov-navy);
      margin-bottom: 4px;
    }

    .publish-info p {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
    }

    .publish-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px;
    }

    .toggle-track {
      width: 52px;
      height: 28px;
      background: var(--gov-border);
      border-radius: 14px;
      position: relative;
      transition: all var(--transition);
    }

    .publish-toggle.active .toggle-track {
      background: var(--gov-success);
    }

    .toggle-thumb {
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      right: 3px;
      transition: all var(--transition);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .publish-toggle.active .toggle-thumb {
      right: 27px;
    }

    .toggle-label {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--gov-text);
    }

    /* Security Section */
    .security-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 24px 28px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
    }

    .security-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 16px;
      align-items: end;
    }

    .form-group-inline {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group-inline label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--gov-text-light);
    }

    .security-input {
      padding: 11px 12px;
      border: 2px solid var(--gov-border);
      border-radius: var(--gov-radius-sm);
      background: var(--gov-bg);
      transition: all var(--transition);
    }

    .security-input:focus {
      border-color: var(--gov-blue);
      background: white;
      box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.08);
    }

    .security-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.86rem;
      color: var(--gov-text);
      font-weight: 600;
    }

    .security-btn {
      padding: 12px 18px;
      border-radius: var(--gov-radius);
      background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
      color: white;
      font-weight: 700;
      transition: all var(--transition);
      border: none;
      cursor: pointer;
    }

    .security-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* Management Section */
    .management-section {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      padding: 32px;
      box-shadow: var(--gov-shadow);
      border: 1px solid var(--gov-border-light);
    }

    /* Filters Row */
    .filters-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 2px solid var(--gov-border);
      border-radius: var(--gov-radius);
      background: var(--gov-bg);
      transition: all var(--transition);
      flex: 1;
    }

    .search-input-wrapper:focus-within {
      border-color: var(--gov-blue);
      background: white;
      box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.1);
    }

    .search-input-wrapper svg {
      color: var(--gov-text-muted);
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .admin-search-input {
      flex: 1;
      font-size: 0.95rem;
      color: var(--gov-text);
      background: transparent;
    }

    .admin-search-input::placeholder {
      color: var(--gov-text-muted);
    }

    .stage-filter-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border: 2px solid var(--gov-border);
      border-radius: var(--gov-radius);
      background: var(--gov-bg);
      transition: all var(--transition);
      min-width: 220px;
    }

    .stage-filter-wrapper:focus-within {
      border-color: var(--gov-blue);
      background: white;
    }

    .stage-filter-wrapper svg {
      color: var(--gov-text-muted);
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .stage-filter-select {
      flex: 1;
      font-size: 0.9rem;
      color: var(--gov-text);
      background: transparent;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }

    .stage-filter-select:focus {
      outline: none;
    }

    /* Admin Table */
    .table-wrapper {
      overflow-x: auto;
      border-radius: var(--gov-radius);
      border: 1px solid var(--gov-border-light);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table thead {
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-blue) 100%);
    }

    .admin-table th {
      padding: 14px 14px;
      text-align: right;
      font-size: 0.82rem;
      font-weight: 700;
      color: white;
      white-space: nowrap;
    }

    .admin-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--gov-border-light);
      font-size: 0.88rem;
    }

    .admin-table tbody tr:nth-child(even) {
      background: var(--gov-bg);
    }

    .admin-table tbody tr:hover {
      background: rgba(0, 90, 156, 0.04);
    }

    .seat-col {
      font-weight: 700;
      color: var(--gov-blue);
    }

    .stage-chip {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(0, 51, 102, 0.08);
      color: var(--gov-navy);
    }

    .type-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .type-chip.scientific {
      background: rgba(0, 90, 156, 0.1);
      color: var(--gov-blue);
    }

    .type-chip.literary {
      background: rgba(212, 175, 55, 0.1);
      color: var(--gov-gold-dark);
    }

    .type-chip.general {
      background: rgba(46, 134, 193, 0.1);
      color: #2e86c1;
    }

    .status-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .status-chip.pass {
      background: var(--gov-success-bg);
      color: var(--gov-success);
    }

    .status-chip.second-round {
      background: rgba(212, 175, 55, 0.12);
      color: var(--gov-gold-dark);
    }

    .status-chip.fail {
      background: var(--gov-danger-bg);
      color: var(--gov-danger);
    }

    .actions-col {
      display: flex;
      gap: 8px;
    }

    .table-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
    }

    .edit-btn {
      background: rgba(0, 90, 156, 0.1);
      color: var(--gov-blue);
    }

    .edit-btn:hover {
      background: var(--gov-blue);
      color: white;
    }

    .delete-btn {
      background: rgba(231, 76, 60, 0.1);
      color: var(--gov-danger);
    }

    .delete-btn:hover {
      background: var(--gov-danger);
      color: white;
    }

    /* Pagination */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      margin-top: 8px;
      border-top: 1px solid var(--gov-border-light);
    }

    .pagination-info {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
      font-weight: 500;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gov-bg);
      color: var(--gov-navy);
      border: 1px solid var(--gov-border);
      transition: all var(--transition);
      cursor: pointer;
    }

    .page-btn:hover:not(:disabled) {
      background: var(--gov-blue);
      color: white;
      border-color: var(--gov-blue);
    }

    .page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .page-btn svg {
      width: 18px;
      height: 18px;
    }

    .page-indicator {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--gov-navy);
      padding: 0 12px;
      min-width: 60px;
      text-align: center;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .empty-state svg {
      color: var(--gov-text-muted);
      opacity: 0.3;
    }

    .empty-state p {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--gov-text-light);
    }

    .empty-state span {
      font-size: 0.85rem;
      color: var(--gov-text-muted);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }

    .modal {
      background: var(--gov-white);
      border-radius: var(--gov-radius-md);
      box-shadow: var(--gov-shadow-lg);
      width: 100%;
      max-width: 520px;
      max-height: 80vh;
      overflow-y: auto;
      animation: fadeInUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
      color: white;
    }

    .modal-header.danger {
      background: linear-gradient(135deg, var(--gov-danger), #c0392b);
    }

    .modal-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: rgba(255, 255, 255, 0.15);
      transition: all var(--transition);
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-body {
      padding: 24px;
    }

    .edit-info {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding: 12px 16px;
      background: var(--gov-bg);
      border-radius: var(--gov-radius);
      font-size: 0.88rem;
      color: var(--gov-text-light);
      font-weight: 600;
    }

    .edit-grades {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .edit-grade-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
    }

    .edit-grade-row label {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--gov-text);
    }

    .grade-input {
      width: 80px;
      padding: 8px 12px;
      border: 2px solid var(--gov-border);
      border-radius: var(--gov-radius-sm);
      text-align: center;
      font-weight: 700;
      font-size: 1rem;
      color: var(--gov-navy);
      background: var(--gov-bg);
      transition: all var(--transition);
    }

    .grade-input:focus {
      border-color: var(--gov-blue);
      background: white;
      box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.1);
    }

    .confirm-icon {
      text-align: center;
      color: var(--gov-danger);
      margin-bottom: 16px;
    }

    .confirm-text {
      text-align: center;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--gov-text);
      margin-bottom: 8px;
    }

    .confirm-sub {
      text-align: center;
      font-size: 0.85rem;
      color: var(--gov-text-muted);
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--gov-border-light);
    }

    .modal-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: var(--gov-radius);
      font-weight: 700;
      font-size: 0.9rem;
      transition: all var(--transition);
      flex: 1;
    }

    .save-btn {
      background: linear-gradient(135deg, var(--gov-navy), var(--gov-blue));
      color: white;
    }

    .save-btn:hover {
      box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
    }

    .danger-btn {
      background: var(--gov-danger);
      color: white;
    }

    .danger-btn:hover {
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    .cancel-btn {
      background: var(--gov-bg);
      color: var(--gov-text);
      border: 1px solid var(--gov-border);
    }

    .cancel-btn:hover {
      background: var(--gov-border-light);
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .upload-grid-3 {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .stat-card {
        padding: 16px;
      }

      .stat-value {
        font-size: 1.15rem;
      }

      .upload-grid-3 {
        grid-template-columns: 1fr;
      }

      .security-grid {
        grid-template-columns: 1fr;
      }

      .publish-card {
        flex-direction: column;
        text-align: center;
      }

      .upload-section, .publish-section, .management-section {
        padding: 20px;
      }

      .page-title-bar {
        padding: 16px 20px;
      }

      .title-content h1 {
        font-size: 1.1rem;
      }

      .edit-info {
        flex-direction: column;
        gap: 8px;
      }

      .filters-row {
        flex-direction: column;
      }

      .stage-filter-wrapper {
        min-width: auto;
      }

      .pagination-bar {
        flex-direction: column;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-icon {
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  searchQuery = '';
  stageFilter = 'all';
  firstSecFileName = signal('');
  scientificFileName = signal('');
  literaryFileName = signal('');
  uploadMessage = signal('');
  uploadSuccess = signal(false);
  isUploading = signal(false);
  editingStudent = signal<StudentResult | null>(null);
  editSubjects = signal<{ name: string; grade: number | null; maxGrade: number; isAbsent?: boolean; failed?: boolean }[]>([]);
  deletingSeatNumber = signal<string | null>(null);
  resetUsername = '';
  resetPassword = '';
  resetMustChangePassword = true;
  resetMessage = signal('');
  resetSuccess = signal(false);
  isResetting = signal(false);

  // Pagination
  readonly PAGE_SIZE = 15;
  currentPage = signal(1);

  stats = computed(() => this.resultsService.statistics());

  filteredStudents = computed(() => {
    const query = this.searchQuery.trim().toLowerCase();
    const filter = this.stageFilter;
    let all = this.resultsService.allStudents();

    // Stage filter
    if (filter !== 'all') {
      if (filter === 'أولى ثانوي - عام') {
        all = all.filter(s => s.stage === 'أولى ثانوي');
      } else if (filter === 'ثانية ثانوي - علمي') {
        all = all.filter(s => s.stage === 'ثانية ثانوي' && s.track === 'علمي');
      } else if (filter === 'ثانية ثانوي - أدبي') {
        all = all.filter(s => s.stage === 'ثانية ثانوي' && s.track === 'أدبي');
      }
    }

    // Search filter
    if (query) {
      all = all.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.seatNumber.includes(query)
      );
    }

    return all;
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredStudents().length / this.PAGE_SIZE)));

  paginationStart = computed(() => (this.currentPage() - 1) * this.PAGE_SIZE);

  paginationEnd = computed(() => Math.min(this.paginationStart() + this.PAGE_SIZE, this.filteredStudents().length));

  paginatedStudents = computed(() => {
    const start = this.paginationStart();
    const end = this.paginationEnd();
    return this.filteredStudents().slice(start, end);
  });

  constructor(
    private resultsService: ResultsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    void this.resultsService.refreshAdminData();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent, stage: EducationalStage, track: AcademicTrack) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0], stage, track);
    }
  }

  onFileSelected(event: Event, stage: EducationalStage, track: AcademicTrack) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0], stage, track);
    }
  }

  async processFile(file: File, stage: EducationalStage, track: AcademicTrack) {
    // Update correct file name signal
    if (stage === 'أولى ثانوي') {
      this.firstSecFileName.set(file.name);
    } else if (track === 'علمي') {
      this.scientificFileName.set(file.name);
    } else {
      this.literaryFileName.set(file.name);
    }

    this.isUploading.set(true);
    this.uploadMessage.set('');

    try {
      const count = await this.resultsService.importFromExcel(file, stage, track);
      this.uploadSuccess.set(true);
      this.uploadMessage.set(`تم استيراد ${count} طالب بنجاح - ${stage} (${track})`);
      // Reset pagination
      this.currentPage.set(1);
    } catch (err: any) {
      this.uploadSuccess.set(false);
      this.uploadMessage.set(err.message || 'حدث خطأ أثناء استيراد الملف');
    } finally {
      this.isUploading.set(false);
    }
  }

  async togglePublish() {
    await this.resultsService.togglePublished();
  }

  startEdit(student: StudentResult) {
    this.editingStudent.set(student);
    this.editSubjects.set(student.subjects.map(s => ({ ...s })));
  }

  updateSubjectGrade(index: number, grade: number | null) {
    const subjects = [...this.editSubjects()];
    subjects[index] = {
      ...subjects[index],
      grade: grade === null || grade === undefined ? null : Number(grade),
      isAbsent: false
    };
    this.editSubjects.set(subjects);
  }

  async saveEdit() {
    const student = this.editingStudent();
    if (!student) return;

    await this.resultsService.editStudent(student.seatNumber, {
      subjects: this.editSubjects()
    });

    this.editingStudent.set(null);
    this.editSubjects.set([]);
  }

  cancelEdit() {
    this.editingStudent.set(null);
    this.editSubjects.set([]);
  }

  deleteStudent(seatNumber: string) {
    this.deletingSeatNumber.set(seatNumber);
  }

  async confirmDelete() {
    const seatNumber = this.deletingSeatNumber();
    if (seatNumber) {
      await this.resultsService.deleteStudent(seatNumber);
    }
    this.deletingSeatNumber.set(null);
  }

  cancelDelete() {
    this.deletingSeatNumber.set(null);
  }

  async resetAdminPassword() {
    this.resetMessage.set('');

    if (!this.resetUsername.trim() || !this.resetPassword.trim()) {
      this.resetSuccess.set(false);
      this.resetMessage.set('يرجى إدخال اسم المستخدم وكلمة المرور الجديدة');
      return;
    }

    this.isResetting.set(true);
    const result = await this.authService.adminResetPassword(
      this.resetUsername.trim(),
      this.resetPassword.trim(),
      this.resetMustChangePassword
    );
    this.isResetting.set(false);

    this.resetSuccess.set(result.success);
    this.resetMessage.set(result.success
      ? `تم تحديث كلمة مرور المستخدم ${this.resetUsername.trim()} بنجاح`
      : (result.error || 'تعذر إعادة تعيين كلمة المرور'));

    if (result.success) {
      this.resetPassword = '';
    }
  }
}
