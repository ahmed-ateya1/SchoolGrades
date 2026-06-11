export interface Subject {
  name: string;
  grade: number | null;
  maxGrade: number;
  isAbsent?: boolean;
  needsSecondRound?: boolean;
  failed?: boolean;
}

export type EducationalStage = 'أولى ثانوي' | 'ثانية ثانوي';
export type AcademicTrack = 'عام' | 'علمي' | 'أدبي';
export type StudentType = 'علمي' | 'أدبي';
export type UserRole = 'student' | 'admin' | 'superadmin';

export interface StudentResult {
  name: string;
  studentName?: string;
  seatNumber: string;
  school: string;
  stage: EducationalStage;
  track: AcademicTrack;
  studentType: StudentType;
  academicYear: string;
  subjects: Subject[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  status: 'ناجح' | 'له دور ثان' | 'راسب';
  hasSecondRound?: boolean;
  secondRoundSubjects?: string;
  rank?: number;
}

export interface DashboardStats {
  firstSecondaryCount: number;
  secondScientificCount: number;
  secondLiteraryCount: number;
  scientificCount: number;
  literaryCount: number;
  totalStudents: number;
  isPublished: boolean;
}

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
}

export interface UploadRecord {
  fileName: string;
  uploadDate: Date;
  uploadedBy: string;
  stage: EducationalStage;
  track: AcademicTrack;
  totalStudents: number;
}
