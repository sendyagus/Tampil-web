import type {
  AdminStats,
  RecentSessionItem,
  User,
  Unit,
  CaseStudy,
  TestSession,
  KeyPoint,
  AiFeedback,
  SessionType,
} from "./entities";

/**
 * Standard API Response envelope
 * Digunakan secara konsisten di seluruh route API TAMPIL
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

/**
 * Data response untuk route GET /api/admin/data
 */
export interface AdminData {
  stats: AdminStats;
  units: Unit[];
  caseStudies: CaseStudy[];
  recentSessions: RecentSessionItem[];
}

export type AdminApiResponse = ApiResponse<AdminData>;

/**
 * Data response untuk route GET /api/student/data
 */
export interface StudentData {
  user: User | null;
  units?: Unit[];
  caseStudies?: CaseStudy[];
  testSessions?: TestSession[];
}

export type StudentApiResponse = ApiResponse<StudentData>;

/**
 * Request payload untuk route POST /api/test/submit
 */
export interface TestSubmitRequest {
  caseId?: string;
  sessionType?: SessionType;
  parentSessionId?: string;
  transcript: string;
  duration?: number;
}

/**
 * Metrik hasil kalkulasi pengujian suara
 */
export interface TestSubmitMetrics {
  wpm: number;
  durasiBicara: number;
  jumlahKata: number;
  jumlahFiller: number;
  fillerPerMenit: number;
  jumlahJedaPanjang: number;
  totalDurasiJeda: number;
  rasioJeda: number;
  cakupanKeyPoints: KeyPoint[];
  skorJeda: number;
  skorFiller: number;
  skorTempo: number;
  skorCakupan: number;
  skorStruktur: number;
}

/**
 * Data response untuk route POST /api/test/submit
 */
export interface TestSubmitData {
  sessionId: string;
  resultId: string;
  communicationIndex: number;
  kategori: string;
  metrics: TestSubmitMetrics;
  aiFeedback: AiFeedback;
}

export type TestSubmitApiResponse = ApiResponse<TestSubmitData>;

/**
 * Data response untuk route POST /api/stt
 */
export interface SttData {
  transcript: string;
  language?: string;
}

export type SttApiResponse = ApiResponse<SttData>;
