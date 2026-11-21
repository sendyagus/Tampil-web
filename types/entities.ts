// ============================================================================
// ENUMS & DOMAIN CONSTANTS
// Sinkron dengan Prisma schema (prisma/schema.prisma)
// ============================================================================

export type AuthProvider = "CREDENTIALS" | "GOOGLE";

export type ConsentType = "TERMS_PRIVACY" | "VOICE_RECORDING" | "THIRD_PARTY_AI";

export type ConsentStatus = "GRANTED" | "REVOKED";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export type AspectCI =
  | "KELANCARAN_JEDA"
  | "KEBERSIHAN_UCAPAN"
  | "TEMPO"
  | "CAKUPAN_ISI"
  | "STRUKTUR";

export type MaterialType = "VIDEO" | "ARTIKEL" | "KUIS";

export type SessionType = "ASSESSMENT" | "TEST" | "RETEST" | "DAILY";

export type SessionStatus = "DRAFT" | "PROCESSING" | "COMPLETED" | "FAILED";

export type CommunicationCategory =
  | "Perlu Latihan"
  | "Berkembang"
  | "Baik"
  | "Sangat Baik";

// ============================================================================
// SUPPORTING ENTITIES & SUB-TYPES
// ============================================================================

export interface Consent {
  id: string;
  userId: string;
  consentType: ConsentType;
  docVersion: string;
  status: ConsentStatus;
  grantedAt: Date | string;
  revokedAt?: Date | string | null;
}

export interface UserStats {
  userId: string;
  totalXp: number;
  level: string; // Pemula (0-199) | Menengah (200-799) | Profesional (800+)
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string | null;
  fokusAspek?: AspectCI | null;
}

export interface UserQuota {
  id: string;
  userId: string;
  periode: string; // YYYY-MM-DD (Zona WIB - 1 jam)
  kuotaFeedbackDasar: number;
  kuotaFeedbackPakai: number;
  sesiHarianMaks: number;
  sesiHarianPakai: number;
}

export interface SelfConfidenceLog {
  id: string;
  userId: string;
  nilai: number; // Skala 1 - 5
  konteks: string; // onboarding | retest | berkala
  tanggal: Date | string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: "locked" | "unlocked" | "completed" | string;
  videoWatched: boolean;
  articleRead: boolean;
  scoreKuis?: number | null;
  completedAt?: Date | string | null;
}

export interface UserDailyChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: string;
  xpAwarded: number;
  completedAt: Date | string;
}

export interface XPLog {
  id: string;
  userId: string;
  sumberAktivitas: string; // daily_challenge | test | retest | video | artikel | kuis
  refId?: string | null;
  jumlahXp: number;
  createdAt: Date | string;
}

export interface StreakLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  activityType: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string; // free | plus_monthly | plus_yearly | sprint_7d
  status: string; // inactive | active
  dailyQuota: number;
  startedAt?: Date | string | null;
  expiresAt?: Date | string | null;
}

export interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string; // active | disabled
  createdAt: Date | string;
  lastLoginAt?: Date | string | null;
}

export interface KeyPoint {
  label: string;
  captured?: boolean;
  triggers?: string[];
}

export interface QuizQuestion {
  id: string;
  materialId: string;
  pertanyaan: string;
  opsi: string[];
  jawabanBenar: number;
  penjelasan?: string | null;
  status?: ContentStatus;
}

export interface LearningMaterial {
  id: string;
  lessonId: string;
  judul: string;
  deskripsi?: string | null;
  tipe: MaterialType;
  isRequired: boolean;
  xpReward: number;
  contentUrl?: string | null;
  isiArtikel?: string | null;
  status?: ContentStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  quizQuestions?: QuizQuestion[];
}

export interface AiFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface FeedbackAccess {
  id: string;
  userId: string;
  resultId: string;
  status: string;
  quotaCharged: boolean;
  createdAt: Date | string;
}

export interface FeedbackRating {
  id: string;
  resultId: string;
  userId: string;
  rating: number; // 1 - 5
  komentar?: string | null;
  createdAt: Date | string;
}

export interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  totalUnits: number;
  totalLessons: number;
  totalCases: number;
}

export interface RecentSessionItem {
  id: string;
  createdAt: Date | string;
  user?: {
    nama: string;
    email: string;
  } | null;
  caseStudy?: {
    judul: string;
  } | null;
  result?: AnalysisResult | null;
}

// ============================================================================
// CORE ENTITIES (User, Unit, Lesson, CaseStudy, TestSession, SpeechMetrics, AnalysisResult)
// Digunakan secara konsisten antara Prisma Model dan Frontend Views
// ============================================================================

/**
 * 1. User
 * Entitas utama pengguna platform TAMPIL dengan prinsip minimisasi data.
 */
export interface User {
  id: string;
  nama: string;
  email: string;
  passwordHash?: string | null;
  authProvider: AuthProvider;
  tahunLahir: number;
  isAdult: boolean;
  statusPengguna?: string | null;
  tujuanUtama: string[];
  createdAt: Date | string;
  deletedAt?: Date | string | null;

  // Relasi opsional
  consents?: Consent[];
  stats?: UserStats | null;
  quotas?: UserQuota[];
  confidenceLogs?: SelfConfidenceLog[];
  progress?: UserProgress[];
  dailyChallenges?: UserDailyChallenge[];
  xpLogs?: XPLog[];
  streakLogs?: StreakLog[];
  testSessions?: TestSession[];
  subscriptions?: Subscription[];
}

/**
 * 2. Unit
 * Modul pembelajaran tematik (Daily Communication, Peer Communication, Public Speaking).
 */
export interface Unit {
  id: string;
  nama: string;
  konteks: string;
  urutan: number;
  deskripsi?: string;
  status?: ContentStatus;
  createdById?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  lessons?: Lesson[];
}

/**
 * 3. Lesson
 * Materi spesifik dalam setiap Unit yang melatih salah satu dari 5 Aspek CI.
 */
export interface Lesson {
  id: string;
  unitId: string;
  judul: string;
  urutan: number;
  targetAspek: AspectCI | string;
  status?: ContentStatus;
  createdById?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Properti frontend & tracking pembelajaran
  completed?: boolean;
  videoWatched?: boolean;
  articleRead?: boolean;
  quizScore?: number | null;
  artikel?: string;

  materials?: LearningMaterial[];
  userProgress?: UserProgress[];
}

/**
 * 4. CaseStudy
 * Studi kasus interaktif untuk Communication Test dengan prompt brief dan key points.
 */
export interface CaseStudy {
  id: string;
  judul: string;
  konteks: string;
  kategori: string;
  difficulty: "Mudah" | "Sedang" | "Sulit" | string;
  durasiMaks: number;
  promptBrief: string;
  keyPoints: KeyPoint[];
  status?: ContentStatus;
  createdById?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  testSessions?: TestSession[];
}

/**
 * 5. TestSession
 * Sesi rekaman dan pengujian komunikasi pengguna.
 */
export interface TestSession {
  id: string;
  userId: string;
  caseId?: string | null;
  tipe: SessionType;
  parentSessionId?: string | null;
  lessonId?: string | null;
  entryPoint?: string;
  attemptNo: number;
  audioPath?: string | null;
  audioDuration: number;
  audioExpiresAt: Date | string;
  transcript: string;
  isPartial: boolean;
  status: SessionStatus;
  createdAt: Date | string;

  // Relasi
  user?: Partial<User> | null;
  caseStudy?: Partial<CaseStudy> | null;
  parentSession?: TestSession | null;
  retests?: TestSession[];
  metrics?: SpeechMetrics | null;
  result?: AnalysisResult | null;
}

/**
 * 6. SpeechMetrics
 * Metrik objektif sinyal suara dan transkrip (WPM, filler, jeda, struktur, dsb).
 */
export interface SpeechMetrics {
  id?: string;
  sessionId?: string;
  durasiBicara: number;
  jumlahKata: number;
  wpm: number;
  jumlahFiller: number;
  fillerPerMenit: number;
  jumlahJedaPanjang: number;
  totalDurasiJeda: number;
  rasioJeda: number;
  pauseThresholdUsed?: number;
  cakupanKeyPoints: KeyPoint[] | Record<string, unknown>;
  skorStruktur: number;

  // Sub-skor pendukung evaluasi
  skorJeda?: number;
  skorFiller?: number;
  skorTempo?: number;
  skorCakupan?: number;
}

/**
 * 7. AnalysisResult
 * Skor Communication Index (0-100), kategori kemampuan, dan feedback kualitatif AI.
 */
export interface AnalysisResult {
  id?: string;
  sessionId?: string;
  skorJeda?: number | null;
  skorFiller: number;
  skorTempo: number;
  skorCakupan?: number | null;
  skorStruktur: number;
  communicationIndex: number;
  kategori: CommunicationCategory | string;
  formulaVersion?: string;
  isPartial?: boolean;
  aiFeedback?: AiFeedback | null;
  aiPromptVersion?: string | null;
  aiModelName?: string | null;
  createdAt?: Date | string;

  feedbackAccesses?: FeedbackAccess[];
  feedbackRating?: FeedbackRating | null;
}
