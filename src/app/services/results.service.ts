import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StudentResult, DashboardStats, EducationalStage, AcademicTrack, UploadRecord } from '../models/models';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from './api.config';

interface AdminDataResponse {
  students: StudentResult[];
  uploads: UploadRecord[];
  stats: DashboardStats;
  isPublished: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private readonly apiBase = `${API_BASE_URL}/results`;
  private students = signal<StudentResult[]>([]);
  private published = signal<boolean>(false);
  private uploads = signal<UploadRecord[]>([]);

  readonly isPublished = this.published.asReadonly();
  readonly allStudents = this.students.asReadonly();
  readonly allUploads = this.uploads.asReadonly();

  readonly statistics = computed<DashboardStats>(() => {
    const all = this.students();
    return {
      firstSecondaryCount: all.filter(s => s.stage === 'أولى ثانوي').length,
      secondScientificCount: all.filter(s => s.stage === 'ثانية ثانوي' && s.track === 'علمي').length,
      secondLiteraryCount: all.filter(s => s.stage === 'ثانية ثانوي' && s.track === 'أدبي').length,
      scientificCount: all.filter(s => s.track === 'علمي').length,
      literaryCount: all.filter(s => s.track === 'أدبي').length,
      totalStudents: all.length,
      isPublished: this.published()
    };
  });

  constructor(private http: HttpClient) {
    this.refreshAdminData();
  }

  async refreshAdminData(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<AdminDataResponse>(`${this.apiBase}/admin-data`)
      );

      this.students.set((data.students || []).map(student => this.normalizeStudent(student)));
      this.uploads.set((data.uploads || []).map(u => ({ ...u, uploadDate: new Date(u.uploadDate) })));
      this.published.set(!!data.isPublished);
    } catch {
      this.students.set([]);
      this.uploads.set([]);
      this.published.set(false);
    }
  }

  async searchBySeatNumber(
    seatNumber: string,
    stage?: EducationalStage,
    track?: AcademicTrack
  ): Promise<StudentResult | null> {
    if (!seatNumber.trim()) return null;

    try {
      const params = new URLSearchParams();
      params.set('seatNumber', seatNumber.trim());
      if (stage) params.set('stage', stage);
      if (track) params.set('track', track);

      const result = await firstValueFrom(
        this.http.get<StudentResult>(`${this.apiBase}/search?${params.toString()}`)
      );

      return this.normalizeStudent(result);
    } catch {
      await this.syncPublishState();
      return null;
    }
  }

  adminSearchBySeatNumber(seatNumber: string): StudentResult | null {
    return this.students().find(s => s.seatNumber === seatNumber) || null;
  }

  getStudentsByStageAndTrack(stage: EducationalStage, track: AcademicTrack): StudentResult[] {
    return this.students().filter(s => s.stage === stage && s.track === track);
  }

  async importFromExcel(
    file: File,
    stage: EducationalStage,
    track: AcademicTrack,
    uploadedBy: string = 'مدير النظام'
  ): Promise<number> {
    const newStudents = await this.readStudentsFromExcel(file, stage, track);

    try {
      const response = await firstValueFrom(this.http.post<{ count: number }>(`${this.apiBase}/import`, {
        fileName: file.name,
        uploadedBy,
        stage,
        track,
        students: newStudents
      }));

      await this.refreshAdminData();
      return response?.count ?? newStudents.length;
    } catch {
      throw new Error('تعذر رفع البيانات إلى الخادم');
    }
  }

  async editStudent(seatNumber: string, data: Partial<StudentResult>): Promise<boolean> {
    const current = this.students().find(s => s.seatNumber === seatNumber);
    if (!current) return false;

    const updated: StudentResult = { ...current, ...data };

    try {
      const saved = await firstValueFrom(
        this.http.put<StudentResult>(`${this.apiBase}/students/${encodeURIComponent(seatNumber)}`, updated)
      );
      const normalized = this.normalizeStudent(saved);
      const students = [...this.students()];
      const index = students.findIndex(s => s.seatNumber === seatNumber);
      if (index !== -1) {
        students[index] = normalized;
        this.students.set(students);
      }
      return true;
    } catch {
      return false;
    }
  }

  async deleteStudent(seatNumber: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiBase}/students/${encodeURIComponent(seatNumber)}`));
      this.students.set(this.students().filter(s => s.seatNumber !== seatNumber));
      return true;
    } catch {
      return false;
    }
  }

  async togglePublished(): Promise<void> {
    await this.setPublished(!this.published());
  }

  async setPublished(value: boolean): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiBase}/publish-state`, { isPublished: value }));
    this.published.set(value);
  }

  private async syncPublishState(): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.get<{ isPublished: boolean }>(`${this.apiBase}/publish-state`));
      this.published.set(!!response?.isPublished);
    } catch {
      this.published.set(false);
    }
  }

  private async readStudentsFromExcel(
    file: File,
    stage: EducationalStage,
    track: AcademicTrack
  ): Promise<StudentResult[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const buffer = e.target?.result;
          if (!buffer) {
            reject(new Error('الملف غير صالح'));
            return;
          }

          const data = new Uint8Array(buffer as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

          if (jsonData.length === 0) {
            reject(new Error('الملف فارغ'));
            return;
          }

          const students = jsonData.map((row, index) => this.mapRowToStudent(row, index, stage, track, index === 0));
          resolve(students);
        } catch {
          reject(new Error('خطأ في قراءة الملف'));
        }
      };

      reader.onerror = () => reject(new Error('خطأ في تحميل الملف'));
      reader.readAsArrayBuffer(file);
    });
  }

  private mapRowToStudent(
    row: Record<string, unknown>,
    index: number,
    stage: EducationalStage,
    track: AcademicTrack,
    logMapping: boolean = false
  ): StudentResult {
    const keys = Object.keys(row);

    const nameKey = keys.find(k => {
      const n = k.trim();
      return n.includes('اسم') || n.includes('الاسم') || n.toLowerCase().includes('name');
    }) || keys[0];

    const seatKey = keys.find(k => {
      const n = k.trim();
      return n.includes('جلوس') || n.includes('رقم الجلوس') || n.toLowerCase().includes('seat');
    }) || keys.find(k => {
      const n = k.trim();
      return k !== nameKey && (n === 'رقم' || n.includes('رقم'));
    }) || keys[1];

    const totalKey = keys.find(k => this.isTotalColumn(k));
    const secondRoundKey = keys.find(k => this.isSecondRoundColumn(k));
    const totalColumnIndex = totalKey ? keys.indexOf(totalKey) : -1;

    const excludedPatterns = [
      'النسبة', 'نسبة', '%',
      'حالة', 'الحالة',
      'منتظم', 'انتظام', 'منازل',
      'ترتيب', 'الترتيب',
      'القيد', 'رقم القيد',
      'كود', 'الكود',
      'سرى', 'سري',
      'ملاحظات', 'ملاحظه', 'ملاحظة',
      'نوع', 'النوع',
      'المدرسة', 'مدرسة',
      'المرحلة', 'مرحلة',
      'الصف', 'صف',
      'الشعبة', 'شعبة',
      'فصل', 'الفصل',
      'العام', 'السنة', 'عام',
      'تقدير', 'التقدير',
      'الدرجة الكبرى', 'الدرجة الصغرى',
      'مسلسل', 'رقم مسلسل',
    ];

    const excludedEnglish = [
      'percentage', 'status', 'rank', 'school',
      'stage', 'track', 'type', 'code', 'serial', 'number',
      'notes', 'grade', 'class', 'year', 'section',
    ];

    const columnMapping: { key: string; role: string }[] = [];
    const subjectKeys = keys.filter((k, columnIndex) => {
      const trimmed = k.trim();

      if (k === nameKey) {
        columnMapping.push({ key: trimmed, role: 'اسم الطالب (name)' });
        return false;
      }
      if (k === seatKey) {
        columnMapping.push({ key: trimmed, role: 'رقم الجلوس (seat)' });
        return false;
      }
      if (k === totalKey) {
        columnMapping.push({ key: trimmed, role: 'المجموع الرسمي' });
        return false;
      }
      if (k === secondRoundKey) {
        columnMapping.push({ key: trimmed, role: 'الدور الثاني' });
        return false;
      }

      if (trimmed.length <= 1) {
        columnMapping.push({ key: trimmed || '(empty)', role: 'مستبعد (single char / empty)' });
        return false;
      }

      if (/^\d+(\.\d+)?$/.test(this.normalizeDigits(trimmed))) {
        columnMapping.push({ key: trimmed, role: 'مستبعد (pure number)' });
        return false;
      }

      if (excludedPatterns.some(token => trimmed.includes(token))) {
        columnMapping.push({ key: trimmed, role: 'مستبعد (metadata)' });
        return false;
      }

      const normalizedHeader = trimmed.toLowerCase();
      if (excludedEnglish.some(token => normalizedHeader.includes(token))) {
        columnMapping.push({ key: trimmed, role: 'مستبعد (metadata EN)' });
        return false;
      }

      const cellValue = row[k];
      if (typeof cellValue === 'string') {
        const trimmedValue = cellValue.trim();
        if (trimmedValue && !this.isAbsentCell(trimmedValue) && this.parseNumericCell(trimmedValue) === null) {
          columnMapping.push({ key: trimmed, role: 'مستبعد (text column)' });
          return false;
        }
      }

      const role = totalColumnIndex >= 0 && columnIndex > totalColumnIndex
        ? '✅ مادة (بعد المجموع - لا تدخل في الإجمالي)'
        : '✅ مادة (subject)';
      columnMapping.push({ key: trimmed, role });
      return true;
    });

    const secondRoundSubjects = this.normalizeSecondRoundSubjects(secondRoundKey ? row[secondRoundKey] : null);
    const secondRoundSubjectList = secondRoundSubjects ? secondRoundSubjects.split(', ') : [];
    const hasSecondRound = secondRoundSubjectList.length > 0;

    const subjects = subjectKeys
      .map(key => {
        const cleanName = this.cleanSubjectName(key);
        const rawValue = row[key];
        const isAbsent = this.isAbsentCell(rawValue);
        const grade = isAbsent ? null : this.parseNumericCell(rawValue);
        const maxGrade = this.extractMaxGrade(key);
        const failed = hasSecondRound && this.isSubjectInSecondRound(cleanName, secondRoundSubjectList);

        return {
          name: cleanName,
          grade,
          maxGrade,
          isAbsent,
          failed
        };
      })
      .filter(subject => subject.name.length > 0);

    const officialTotalScore = totalKey ? this.parseNumericCell(row[totalKey]) : null;
    const subjectsUpToTotal = totalColumnIndex >= 0
      ? subjectKeys.filter(key => keys.indexOf(key) < totalColumnIndex)
      : subjectKeys;

    const fallbackMaxTotal = subjectsUpToTotal.reduce((sum, key) => sum + this.extractMaxGrade(key), 0);
    const maxTotalFromHeader = totalKey ? this.extractMaxGrade(totalKey) : 0;
    const maxTotalScore = maxTotalFromHeader > 0 ? maxTotalFromHeader : fallbackMaxTotal;
    const totalScore = officialTotalScore ?? subjects.reduce((sum, s) => sum + (s.grade ?? 0), 0);
    const percentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 10000) / 100 : 0;

    if (logMapping) {
      console.group('📊 Excel Column Mapping Detected');
      console.table(columnMapping);
      console.log(`Name column: "${nameKey}"`);
      console.log(`Seat column: "${seatKey}"`);
      console.log(`Total column: "${totalKey ?? '(not found)'}"`);
      console.log(`Second round column: "${secondRoundKey ?? '(not found)'}"`);
      console.log('Normalized second-round subjects:', secondRoundSubjects || '(empty)');
      console.groupEnd();
    }

    const studentName = String(row[nameKey] ?? `طالب ${index + 1}`).trim();
    const seatNumber = String(row[seatKey] ?? index + 1).trim();

    return {
      name: studentName,
      studentName,
      seatNumber,
      school: 'مدرسة الشهيد ملازم اول حمادة فهمي مباشر الثانوية المشتركة',
      stage,
      track,
      studentType: track === 'أدبي' ? 'أدبي' : 'علمي',
      academicYear: '2025/2026',
      subjects,
      totalScore,
      maxTotalScore,
      percentage,
      status: hasSecondRound ? 'له دور ثان' : 'ناجح',
      hasSecondRound,
      secondRoundSubjects: secondRoundSubjects || ''
    };
  }

  /** Strip trailing numbers (max grade) from subject names. e.g. "عربي100" → "عربي" */
  private cleanSubjectName(rawName: string): string {
    return this.normalizeSubjectToken(this.normalizeDigits(rawName).replace(/\d+(\.\d+)?\s*$/, ''));
  }

  private extractMaxGrade(label: string): number {
    const match = this.normalizeDigits(label).match(/(\d+(?:\.\d+)?)\s*$/);
    if (match && match[1]) {
      return Number(match[1]);
    }
    return 100;
  }

  private isTotalColumn(label: string): boolean {
    const normalized = this.normalizeHeader(label);
    return normalized.includes('المجموع') || normalized.includes('مجموع') || normalized.includes('total');
  }

  private isSecondRoundColumn(label: string): boolean {
    const normalized = this.normalizeHeader(label);
    return normalized.includes('الدور الثاني')
      || normalized.includes('الدور الثانى')
      || normalized.includes('دور ثاني')
      || normalized.includes('دور ثان')
      || normalized.includes('دور تاني')
      || normalized.includes('دور تان')
      || normalized.includes('مواد الدور');
  }

  private isAbsentCell(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const normalized = value.trim().replace(/\s+/g, '');
    return normalized === 'غ' || normalized === 'غائب';
  }

  private parseNumericCell(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const normalized = this.normalizeDigits(value)
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .replace(/٬/g, '')
      .replace(/٫/g, '.')
      .replace(/−/g, '-');

    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private normalizeSecondRoundSubjects(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    const text = String(value).trim();
    if (!text) {
      return '';
    }

    const parts = text
      .split(/[\n\r,،;؛\/\\|+\-]+/)
      .map(part => this.normalizeSubjectToken(part))
      .filter(Boolean);

    const unique = new Map<string, string>();
    for (const part of parts) {
      const key = this.normalizeComparableSubjectName(part);
      if (!key || unique.has(key)) continue;
      unique.set(key, part);
    }

    return Array.from(unique.values()).join(', ');
  }

  private isSubjectInSecondRound(subjectName: string, secondRoundSubjects: string[]): boolean {
    const normalizedSubject = this.normalizeComparableSubjectName(subjectName);
    if (!normalizedSubject) {
      return false;
    }

    return secondRoundSubjects.some(candidate => {
      const normalizedCandidate = this.normalizeComparableSubjectName(candidate);
      return normalizedCandidate.length > 0
        && (normalizedSubject.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedSubject));
    });
  }

  private normalizeStudent(student: StudentResult): StudentResult {
    const normalizedName = student.name || student.studentName || '';
    const normalizedSecondRoundSubjects = this.normalizeSecondRoundSubjects(student.secondRoundSubjects ?? '');
    const hasSecondRound = !!student.hasSecondRound || !!normalizedSecondRoundSubjects;
    const status = hasSecondRound ? 'له دور ثان' : (student.status === 'راسب' ? 'راسب' : 'ناجح');
    return {
      ...student,
      name: normalizedName,
      studentName: normalizedName,
      status,
      hasSecondRound,
      secondRoundSubjects: normalizedSecondRoundSubjects,
      subjects: (student.subjects || []).map(subject => {
        const isAbsent = !!subject.isAbsent;
        const numericGrade = subject.grade === null || subject.grade === undefined
          ? null
          : Number(subject.grade);
        return {
          ...subject,
          grade: isAbsent ? null : numericGrade,
          isAbsent
        };
      })
    };
  }

  private normalizeHeader(text: string): string {
    return this.normalizeDigits(text).replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private normalizeSubjectToken(text: string): string {
    return text
      .replace(/^[\s\-–—_.,،;:]+/, '')
      .replace(/[\s\-–—_.,،;:]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeComparableSubjectName(text: string): string {
    return this.normalizeSubjectToken(text)
      .replace(/[^\p{L}\p{N}]/gu, '')
      .toLowerCase();
  }

  private normalizeDigits(text: string): string {
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    return text.replace(/[٠-٩]/g, digit => String(arabicDigits.indexOf(digit)));
  }
}
