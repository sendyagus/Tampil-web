import type { KeyPoint, AiFeedback } from "./entities";

/**
 * Mode navigasi utama aplikasi TAMPIL
 */
export type SystemMode = "student" | "admin" | "specs";

/**
 * Tab navigasi pada aplikasi mahasiswa / student
 */
export type StudentTab = "home" | "roadmap" | "test" | "progress" | "profile";

/**
 * 4 Tahapan alur Communication Test
 */
export type TestStep = 1 | 2 | 3 | 4;

/**
 * Status integrasi Speech-to-Text Groq Whisper
 */
export type SttStatus = "idle" | "uploading" | "done" | "error";

/**
 * Sub-tab pada modal penampil materi pelajaran
 */
export type LessonSubTab = "video" | "article" | "quiz";

/**
 * State profil dan kuota pengguna di client frontend
 */
export interface UserProfileState {
  nama: string;
  status: string;
  goal: string;
  birthYear: number;
  isAdult: boolean;
  xp: number;
  streak: number;
  confidenceInitial: number;
  confidenceCurrent: number;
  sessionsLeft: number;
  sessionsMax: number;
  aiLeft: number;
  aiMax: number;
  consents: {
    terms: boolean;
    voice: boolean;
    ai: boolean;
  };
}

/**
 * Hasil kalkulasi kalkulator skor komunikasi di frontend
 */
export interface CalculatedResult {
  communicationIndex: number;
  kategori: string;
  metrics: {
    wpm: number;
    jumlahKata: number;
    jumlahFiller: number;
    jumlahJedaPanjang: number;
    skorJeda: number;
    skorFiller: number;
    skorTempo: number;
    skorCakupan: number;
    skorStruktur: number;
    durasiBicara?: number;
    fillerPerMenit?: number;
    totalDurasiJeda?: number;
    rasioJeda?: number;
    cakupanKeyPoints?: KeyPoint[];
  };
  aiFeedback?: AiFeedback;
}
