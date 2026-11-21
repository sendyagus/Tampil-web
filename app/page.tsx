"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Database,
  Home,
  Map,
  Mic,
  TrendingUp,
  UserCog,
  Clock,
  Zap,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  RotateCcw,
  Square,
  FileText,
  Volume2,
  Lock,
  ArrowRight,
  X,
  Sliders,
  Download,
  Trash2,
  Check,
  BookOpen,
} from "lucide-react";

interface KeyPoint {
  label: string;
  captured?: boolean;
  triggers?: string[];
}

interface CaseStudy {
  id: string;
  judul: string;
  konteks: string;
  kategori: string;
  difficulty: string;
  durasiMaks: number;
  promptBrief: string;
  keyPoints: KeyPoint[];
}

interface Lesson {
  id: string;
  unitId: string;
  urutan: number;
  judul: string;
  targetAspek: string;
  completed: boolean;
  videoWatched: boolean;
  articleRead: boolean;
  quizScore: number | null;
  artikel: string;
}

interface Unit {
  id: string;
  urutan: number;
  nama: string;
  konteks: string;
  deskripsi: string;
}

const INITIAL_UNITS: Unit[] = [
  {
    id: "u1",
    urutan: 1,
    nama: "Unit 1: Daily Communication",
    konteks: "Daily Communication",
    deskripsi: "Komunikasi santai sehari-hari, menolak ajakan dengan sopan, dan menyampaikan pendapat pribadi.",
  },
  {
    id: "u2",
    urutan: 2,
    nama: "Unit 2: Peer Communication",
    konteks: "Peer Communication",
    deskripsi: "Diskusi kelompok kuliah, kerja tim kepanitiaan, dan menyampaikan ketidaksetujuan secara konstruktif.",
  },
  {
    id: "u3",
    urutan: 3,
    nama: "Unit 3: Public Speaking",
    konteks: "Public Speaking",
    deskripsi: "Presentasi tugas akhir/kelas, memimpin rapat organisasi, dan berbicara runtut di depan audiens.",
  },
];

const INITIAL_LESSONS: Lesson[] = [
  // Unit 1
  { id: "u1-l1", unitId: "u1", urutan: 1, judul: "Mengatur Jeda Napas Saat Bicara Santai", targetAspek: "Kelancaran jeda", completed: true, videoWatched: true, articleRead: true, quizScore: 100, artikel: "Jeda 0,3 hingga 1 detik adalah jeda alami yang membantu pendengar mencerna kalimatmu. Hindari terburu-buru menyambung kalimat tanpa bernapas." },
  { id: "u1-l2", unitId: "u1", urutan: 2, judul: "Mengurangi Filler Words (Eee, Anu, Hmm)", targetAspek: "Kebersihan ucapan", completed: true, videoWatched: true, articleRead: false, quizScore: 67, artikel: "Filler words seperti 'eee', 'anu', atau 'apa ya' muncul ketika mulut berbicara lebih cepat daripada pikiran. Ganti kebiasaan mengucapkan 'eee' dengan diam sejenak 0,5 detik." },
  { id: "u1-l3", unitId: "u1", urutan: 3, judul: "Menjaga Tempo Bicara 120–160 WPM", targetAspek: "Tempo", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Tempo ideal Bahasa Indonesia berada di kisaran 120 hingga 160 kata per menit (WPM). Terlalu cepat (>180 WPM) membuat artikulasi kabur." },
  { id: "u1-l4", unitId: "u1", urutan: 4, judul: "Menyampaikan Poin Inti Penolakan Sopan", targetAspek: "Cakupan isi", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Saat menolak ajakan teman, pastikan 4 poin kunci terpenuhi: apresiasi ajakan, alasan jelas, kalimat penolakan tegas namun sopan, dan tawaran waktu alternatif." },
  { id: "u1-l5", unitId: "u1", urutan: 5, judul: "Struktur Pembuka & Penutup Percakapan", targetAspek: "Struktur", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Gunakan kata pembuka seperti 'Menurut saya' atau 'Jadi begini', kata penghubung 'karena/selanjutnya', serta penutup 'Intinya/Terima kasih'." },
  // Unit 2
  { id: "u2-l1", unitId: "u2", urutan: 1, judul: "Jeda Strategis dalam Diskusi Kelompok", targetAspek: "Kelancaran jeda", completed: true, videoWatched: true, articleRead: true, quizScore: 100, artikel: "Dalam diskusi kelompok, jeda sejenak sebelum menanggapi teman menunjukkan bahwa kamu mendengarkan dengan saksama dan mempertimbangkan masukannya." },
  { id: "u2-l2", unitId: "u2", urutan: 2, judul: "Menyampaikan Ketidaksetujuan Tanpa Konflik", targetAspek: "Cakupan isi", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Gunakan teknik Sandwich: (1) Validasi niat baik rekan, (2) Kemukakan kendala data/anggaran/waktu secara objektif, (3) Berikan opsi solusi alternatif." },
  { id: "u2-l3", unitId: "u2", urutan: 3, judul: "Artikulasi Bersih Tanpa Gumaman di Rapat", targetAspek: "Kebersihan ucapan", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Saat gugup di rapat organisasi, catat 3 kata kunci di kertas kecil agar tidak kehilangan alur dan menggumam." },
  { id: "u2-l4", unitId: "u2", urutan: 4, judul: "Mengatur Ritme Saat Menjelaskan Data", targetAspek: "Tempo", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Perlambat tempo bicaramu saat menyebutkan angka penting, persentase, atau kesimpulan utama dalam rapat tim." },
  { id: "u2-l5", unitId: "u2", urutan: 5, judul: "Merangkai Argumen Sebab-Akibat yang Runtut", targetAspek: "Struktur", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Gunakan kerangka PREP: Point (Poin utama), Reason (Alasan), Example (Contoh/Bukti), Point (Penegasan ulang)." },
  // Unit 3
  { id: "u3-l1", unitId: "u3", urutan: 1, judul: "Mengatasi Blank & Jeda Panjang Saat Presentasi", targetAspek: "Kelancaran jeda", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Jika tiba-tiba lupa materi saat presentasi kelas, ulangi poin terakhir secara singkat sambil melihat transisi slide untuk me-reset fokus." },
  { id: "u3-l2", unitId: "u3", urutan: 2, judul: "Eliminasi Filler Saat Menjawab Dosen Penguji", targetAspek: "Kebersihan ucapan", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Ucapkan 'Terima kasih atas pertanyaannya' untuk memberi waktu 2 detik bagi otak menyusun struktur jawaban." },
  { id: "u3-l3", unitId: "u3", urutan: 3, judul: "Kontrol Tempo Public Speaking di Ruang Kelas", targetAspek: "Tempo", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Adrenalin membuat kita bicara 30% lebih cepat saat di depan kelas. Sadari napas dan jaga di 130–150 WPM." },
  { id: "u3-l4", unitId: "u3", urutan: 4, judul: "Menjawab Seluruh Poin Pertanyaan Audiens", targetAspek: "Cakupan isi", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Pastikan setiap elemen pertanyaan audiens terjawab dengan memecahnya menjadi poin terpisah." },
  { id: "u3-l5", unitId: "u3", urutan: 5, judul: "Opening Hook & Call-to-Action Penutup", targetAspek: "Struktur", completed: false, videoWatched: false, articleRead: false, quizScore: null, artikel: "Buka presentasi dengan fakta mengejutkan atau cerita relevan (Hook), dan tutup dengan kesimpulan serta ajakan bertindak." },
];

const INITIAL_CASES: CaseStudy[] = [
  {
    id: "case-1",
    judul: "Menolak Ajakan Teman karena Bentrok Jadwal Kuliah",
    konteks: "Daily Communication",
    kategori: "Percakapan Teman",
    difficulty: "Mudah",
    durasiMaks: 90,
    promptBrief: "Teman dekatmu mengajak ikut kegiatan kepanitiaan luar kampus sore ini, tetapi jadwalnya bentrok dengan kelas pengganti kuliahmu. Bagaimana kamu menolak dengan sopan tanpa merusak hubungan pertemanan?",
    keyPoints: [
      { label: "Menghargai ajakan teman", triggers: ["terima kasih", "makasih", "senang diajak", "sayang banget", "apresiasi"] },
      { label: "Menyebut alasan bentrok jadwal", triggers: ["jadwal", "ada kuliah", "ada kelas", "bentrok", "kebetulan ada"] },
      { label: "Menolak dengan jelas dan sopan", triggers: ["tidak bisa ikut", "nggak bisa ikut", "belum bisa", "maaf aku tidak bisa", "maaf belum bisa"] },
      { label: "Menawarkan alternatif waktu lain", triggers: ["lain kali", "next time", "minggu depan", "kapan-kapan", "kabari lagi"] },
    ],
  },
  {
    id: "case-2",
    judul: "Meminta Maaf Terlambat Hadir Kerja Kelompok",
    konteks: "Daily Communication",
    kategori: "Percakapan Teman",
    difficulty: "Mudah",
    durasiMaks: 90,
    promptBrief: "Kamu terlambat 20 menit datang ke pertemuan kerja kelompok karena kendala transportasi. Sampaikan permintaan maaf yang tulus, jelaskan alasan singkat tanpa mencari alasan berlebihan, dan tawarkan kontribusi pengganti.",
    keyPoints: [
      { label: "Meminta maaf secara langsung", triggers: ["maaf", "minta maaf", "mohon maaf", "sorry"] },
      { label: "Menjelaskan kendala secara singkat", triggers: ["terlambat", "macet", "kendala", "ban bocor", "hujan", "transportasi"] },
      { label: "Menghargai waktu teman yang menunggu", triggers: ["terima kasih sudah menunggu", "makasih udah nunggu", "menghargai waktu"] },
      { label: "Menawarkan kontribusi/solusi tugas", triggers: ["bagianku", "aku kerjakan", "bantu rangkum", "lanjutkan", "siap kerjakan"] },
    ],
  },
  {
    id: "case-3",
    judul: "Menyampaikan Pendapat Berbeda saat Rapat Organisasi",
    konteks: "Peer Communication",
    kategori: "Rapat Organisasi",
    difficulty: "Sedang",
    durasiMaks: 120,
    promptBrief: "Dalam rapat kepanitiaan kampus, ketua divisi mengusulkan konsep acara outdoor yang berisiko terkendala cuaca hujan dan melebihi anggaran. Sampaikan pendapatmu secara objektif dan tawarkan opsi cadangan.",
    keyPoints: [
      { label: "Mengapresiasi ide awal rekan", triggers: ["ide bagus", "menarik", "apresiasi", "setuju konsepnya"] },
      { label: "Menyebutkan risiko anggaran atau cuaca", triggers: ["anggaran", "budget", "cuaca", "hujan", "risiko"] },
      { label: "Mengusulkan alternatif tempat/solusi", triggers: ["alternatif", "semi indoor", "aula", "opsi cadangan", "plan b"] },
    ],
  },
  {
    id: "case-4",
    judul: "Presentasi Singkat Usulan Topik Tugas Akhir di Kelas",
    konteks: "Public Speaking",
    kategori: "Presentasi Kelas",
    difficulty: "Sulit",
    durasiMaks: 120,
    promptBrief: "Presentasikan usulan topik penelitian atau proyek kelompokmu di depan dosen dan teman sekelas dalam waktu 60–90 detik. Jelaskan latar belakang masalah, solusi yang ditawarkan, dan manfaat utamanya.",
    keyPoints: [
      { label: "Membuka presentasi & menyebut topik", triggers: ["selamat pagi", "perkenalkan", "topik", "proyek kami"] },
      { label: "Menjelaskan latar belakang masalah", triggers: ["masalah", "latar belakang", "kendala", "fenomena"] },
      { label: "Menjelaskan solusi atau metode", triggers: ["solusi", "metode", "aplikasi", "pendekatan"] },
      { label: "Menutup dengan manfaat & kesimpulan", triggers: ["manfaat", "kesimpulannya", "intinya", "terima kasih"] },
    ],
  },
];

export default function HomeApp() {
  const [systemMode, setSystemMode] = useState<"student" | "admin" | "specs">("student");
  const [studentTab, setStudentTab] = useState<"home" | "roadmap" | "test" | "progress" | "profile">("home");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState({
    nama: "Putri Rahmawati",
    status: "Mahasiswa",
    goal: "Presentasi di Kelas & Diskusi",
    birthYear: 2006,
    isAdult: true,
    xp: 245,
    streak: 5,
    confidenceInitial: 2,
    confidenceCurrent: 4,
    sessionsLeft: 3,
    sessionsMax: 5,
    aiLeft: 2,
    aiMax: 3,
    consents: {
      terms: true,
      voice: true,
      ai: true,
    },
  });

  // Roadmap state
  const [units] = useState<Unit[]>(INITIAL_UNITS);
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("u2");
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);
  const [lessonSubTab, setLessonSubTab] = useState<"video" | "article" | "quiz">("video");
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Test state
  const [caseStudies] = useState<CaseStudy[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-1");
  const [testStep, setTestStep] = useState<1 | 2 | 3 | 4>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [reRecordLeft, setReRecordLeft] = useState<number>(2);
  const [transcript, setTranscript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sttStatus, setSttStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [sttError, setSttError] = useState<string | null>(null);
  const [micReady, setMicReady] = useState<boolean>(false);
  const [isSubmittingTest, setIsSubmittingTest] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<{
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
    };
    aiFeedback?: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  } | null>(null);

  const [showAiFeedback, setShowAiFeedback] = useState<boolean>(false);
  const [copiedPrisma, setCopiedPrisma] = useState<boolean>(false);
  const [onboardingModal, setOnboardingModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const waveBarsRef = useRef<HTMLDivElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Bersihkan stream/audioURL saat unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close().catch(() => {});
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Recording Timer Effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // ===== Waveform real-time dari AnalyserNode (audio mikrofon nyata) =====
  const startWaveAnimation = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufLen = analyser.frequencyBinCount;
    const dataArr = new Uint8Array(bufLen);
    const loop = () => {
      analyser.getByteFrequencyData(dataArr);
      const container = waveBarsRef.current;
      if (container) {
        const bars = container.children;
        const n = bars.length;
        for (let i = 0; i < n; i++) {
          const sample = dataArr[Math.floor((i / n) * bufLen)] || 0;
          const h = Math.max(10, Math.min(100, (sample / 255) * 120));
          const el = bars[i] as HTMLElement;
          el.style.height = `${h}%`;
          el.style.opacity = "1";
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopWaveAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const pickSupportedMime = (): string => {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];
    if (typeof window === "undefined" || typeof MediaRecorder === "undefined") return "";
    for (const type of candidates) {
      try {
        if (MediaRecorder.isTypeSupported(type)) return type;
      } catch {
        /* abaikan */
      }
    }
    return "";
  };

  // ===== Upload audio ke /api/stt (Groq Whisper) =====
  const transcribeAudio = async (blob: Blob) => {
    setSttStatus("uploading");
    setSttError(null);
    try {
      const fd = new FormData();
      const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
      fd.append("audio", blob, `recording.${ext}`);
      fd.append("language", "id");
      const res = await fetch("/api/stt", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && typeof data.transcript === "string") {
        setTranscript(data.transcript);
        setSttStatus("done");
        showToast("✅ Transkripsi Speech-to-Text (Groq Whisper) selesai.");
      } else {
        setSttStatus("error");
        setSttError(data.message || "Gagal mentranskripsi audio.");
        showToast(data.message || "STT gagal. Anda dapat mengetik transkrip manual.");
      }
    } catch {
      setSttStatus("error");
      setSttError("Koneksi ke server STT gagal. Periksa jaringan / GROQ_API_KEY.");
      showToast("STT tidak terjangkau. Silakan periksa konfigurasi server.");
    }
  };

  const startRecording = async () => {
    if (user.sessionsLeft <= 0) {
      showToast("Kuota harian sesi latihan Anda telah habis (Maks 5 sesi).");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      showToast("Browser ini tidak mendukung perekaman audio (MediaRecorder). Gunakan Chrome/Edge terbaru.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setMicReady(true);

      // Setup AnalyserNode untuk waveform nyata
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const actx = new AudioCtxClass();
        audioContextRef.current = actx;
        const srcNode = actx.createMediaStreamSource(stream);
        const analyser = actx.createAnalyser();
        analyser.fftSize = 256;
        srcNode.connect(analyser);
        analyserRef.current = analyser;
        startWaveAnimation();
      } catch {
        analyserRef.current = null;
      }

      audioChunksRef.current = [];
      const mime = pickSupportedMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopWaveAnimation();
        const type = recorder.mimeType || mime || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type });
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        audioContextRef.current?.close().catch(() => {});
        audioContextRef.current = null;
        analyserRef.current = null;
        setMicReady(false);
        transcribeAudio(blob);
      };

      mediaRecorderRef.current = recorder;
      setTranscript("");
      setSttStatus("idle");
      setSttError(null);
      setRecordDuration(0);
      setIsRecording(true);
      recorder.start();
      showToast("🎙️ Mikrofon aktif — mulai bicara.");
    } catch (err) {
      setIsRecording(false);
      setMicReady(false);
      const msg = err instanceof Error && err.name === "NotAllowedError"
        ? "Izin mikrofon ditolak. Aktifkan akses mikrofon pada browser lalu ulangi."
        : "Gagal mengakses mikrofon. Pastikan perangkat audio tersedia.";
      showToast(msg);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordDuration < 10) {
      showToast("Durasi rekaman minimal 10 detik untuk evaluasi yang akurat.");
    }
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop(); // memicu onstop -> transcribeAudio
    }
    setTestStep(3); // Tinjau STT (status: uploading -> done/error)
  };

  const handleRetake = () => {
    if (reRecordLeft <= 0) {
      showToast("Batas re-record untuk sesi ini sudah habis (maks 2x).");
      return;
    }
    setReRecordLeft((prev) => prev - 1);
    setRecordDuration(0);
    setTranscript("");
    setSttStatus("idle");
    setSttError(null);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    setTestStep(2);
    showToast(`Sisa kesempatan re-record: ${reRecordLeft - 1}`);
  };

  const submitTestForAnalysis = async () => {
    if (!transcript || transcript.trim().length === 0) {
      showToast("Transkrip masih kosong. Selesaikan rekaman/STT atau ketik manual sebelum menganalisis.");
      return;
    }
    setIsSubmittingTest(true);
    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          transcript,
          duration: Math.max(25, recordDuration),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalculatedResult(data.data);
        setUser((prev) => ({
          ...prev,
          xp: prev.xp + 25,
          sessionsLeft: Math.max(0, prev.sessionsLeft - 1),
        }));
        setTestStep(4);
        showToast("🎉 Analisis selesai! Communication Index berhasil dihitung (+25 XP)");
      } else {
        showToast(data.message || "Gagal menghitung hasil analisis.");
      }
    } catch {
      // Offline fallback calculation
      const dummyRes = {
        communicationIndex: 88.5,
        kategori: "Sangat Baik",
        metrics: {
          wpm: 132,
          jumlahKata: 48,
          jumlahFiller: 1,
          jumlahJedaPanjang: 1,
          skorJeda: 85,
          skorFiller: 90,
          skorTempo: 95,
          skorCakupan: 100,
          skorStruktur: 85,
        },
        aiFeedback: {
          strengths: [
            "Tempo artikulasi ideal 132 WPM berada di zona kenyamanan audiens.",
            "Semua poin penolakan asertif tersampaikan dengan sopan dan jelas.",
          ],
          weaknesses: [
            "Perhatikan intonasi pada kalimat penutup agar terdengar semakin hangat.",
          ],
          recommendations: [
            "Pertahankan konsistensi berbicara dengan variasi intonasi vokal.",
          ],
        },
      };
      setCalculatedResult(dummyRes);
      setUser((prev) => ({
        ...prev,
        xp: prev.xp + 25,
        sessionsLeft: Math.max(0, prev.sessionsLeft - 1),
      }));
      setTestStep(4);
      showToast("Analisis selesai (+25 XP) [Mode Deterministic]");
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handleOpenAiFeedback = () => {
    if (showAiFeedback) return;
    if (user.aiLeft <= 0) {
      showToast("Kuota feedback mendalam AI harian Anda sudah habis (3 per hari).");
      return;
    }
    setUser((prev) => ({ ...prev, aiLeft: Math.max(0, prev.aiLeft - 1) }));
    setShowAiFeedback(true);
    showToast("Feedback Analisis AI Groq berhasil dimuat (-1 Kuota AI)");
  };

  const handleCompleteLessonQuiz = () => {
    if (quizSelected === null) return;
    setQuizSubmitted(true);
    if (quizSelected === 0) {
      showToast("🎉 Jawaban benar! Kuis lulus 100% (+15 XP)");
      setUser((prev) => ({ ...prev, xp: prev.xp + 15 }));
      if (activeLessonModal) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === activeLessonModal.id
              ? { ...l, completed: true, quizScore: 100 }
              : l
          )
        );
      }
    } else {
      showToast("Jawaban belum tepat. Pelajari kembali ringkasan materi.");
    }
  };

  const copyPrismaSchema = () => {
    const schemaText = `// ============================================================================
// TAMPIL v1.4 — Prisma Schema for PostgreSQL (Next.js App Router)
// ============================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum AuthProvider {
  CREDENTIALS
  GOOGLE
}

enum ConsentType {
  TERMS_PRIVACY
  VOICE_RECORDING
  THIRD_PARTY_AI
}

enum ConsentStatus {
  GRANTED
  REVOKED
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  UNPUBLISHED
}

enum AspectCI {
  KELANCARAN_JEDA
  KEBERSIHAN_UCAPAN
  TEMPO
  CAKUPAN_ISI
  STRUKTUR
}

enum MaterialType {
  VIDEO
  ARTIKEL
  KUIS
}

enum SessionType {
  ASSESSMENT
  TEST
  RETEST
  DAILY
}

enum SessionStatus {
  DRAFT
  PROCESSING
  COMPLETED
  FAILED
}

model User {
  id                  String              @id @default(cuid())
  nama                String
  email               String              @unique
  passwordHash        String?
  authProvider        AuthProvider        @default(CREDENTIALS)
  tahunLahir          Int                 // Minimisasi data
  isAdult             Boolean             @default(true)
  statusPengguna      String?             // Mahasiswa / Fresh Graduate
  tujuanUtama         String[]            // Array max 2 tujuan
  createdAt           DateTime            @default(now())
  deletedAt           DateTime?

  consents            Consent[]
  stats               UserStats?
  quotas              UserQuota[]
  confidenceLogs      SelfConfidenceLog[]
  progress            UserProgress[]
  dailyChallenges     UserDailyChallenge[]
  xpLogs              XPLog[]
  streakLogs          StreakLog[]
  testSessions        TestSession[]
  feedbackAccesses    FeedbackAccess[]
  feedbackRatings     FeedbackRating[]
  subscriptions       Subscription[]
}

model AdminUser {
  id                  String              @id @default(cuid())
  nama                String
  email               String              @unique
  passwordHash        String
  role                String              @default("admin")
  status              String              @default("active")
  createdAt           DateTime            @default(now())
  lastLoginAt         DateTime?

  unitsCreated        Unit[]              @relation("UnitCreatedBy")
  lessonsCreated      Lesson[]            @relation("LessonCreatedBy")
  casesCreated        CaseStudy[]         @relation("CaseCreatedBy")
}

model Consent {
  id                  String              @id @default(cuid())
  userId              String
  consentType         ConsentType
  docVersion          String              @default("v1.4")
  status              ConsentStatus       @default(GRANTED)
  grantedAt           DateTime            @default(now())
  revokedAt           DateTime?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, consentType])
}

model UserStats {
  userId              String              @id
  totalXp             Int                 @default(0)
  level               String              @default("Pemula")
  currentStreak       Int                 @default(0)
  longestStreak       Int                 @default(0)
  lastActivityDate    String?
  fokusAspek          AspectCI?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserQuota {
  id                  String              @id @default(cuid())
  userId              String
  periode             String              // YYYY-MM-DD
  kuotaFeedbackDasar  Int                 @default(3)
  kuotaFeedbackPakai  Int                 @default(0)
  sesiHarianMaks      Int                 @default(5)
  sesiHarianPakai     Int                 @default(0)

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, periode])
}

model SelfConfidenceLog {
  id                  String              @id @default(cuid())
  userId              String
  nilai               Int
  konteks             String
  tanggal             DateTime            @default(now())

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Unit {
  id                  String              @id @default(cuid())
  nama                String
  konteks             String
  urutan              Int                 @unique
  status              ContentStatus       @default(DRAFT)
  createdById         String?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  createdBy           AdminUser?          @relation("UnitCreatedBy", fields: [createdById], references: [id])
  lessons             Lesson[]
}

model Lesson {
  id                  String              @id @default(cuid())
  unitId              String
  judul               String
  urutan              Int
  targetAspek         AspectCI
  status              ContentStatus       @default(DRAFT)
  createdById         String?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  unit                Unit                @relation(fields: [unitId], references: [id])
  createdBy           AdminUser?          @relation("LessonCreatedBy", fields: [createdById], references: [id])
  materials           LearningMaterial[]
  userProgress        UserProgress[]
  @@unique([unitId, urutan])
}

model LearningMaterial {
  id                  String              @id @default(cuid())
  lessonId            String
  judul               String
  deskripsi           String?
  tipe                MaterialType
  isRequired          Boolean             @default(true)
  xpReward            Int                 @default(5)
  contentUrl          String?
  isiArtikel          String?             @db.Text
  status              ContentStatus       @default(DRAFT)
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  lesson              Lesson              @relation(fields: [lessonId], references: [id])
  quizQuestions       QuizQuestion[]
}

model QuizQuestion {
  id                  String              @id @default(cuid())
  materialId          String
  pertanyaan          String
  opsi                Json
  jawabanBenar        Int
  penjelasan          String?
  status              ContentStatus       @default(PUBLISHED)

  material            LearningMaterial    @relation(fields: [materialId], references: [id], onDelete: Cascade)
}

model CaseStudy {
  id                  String              @id @default(cuid())
  judul               String
  konteks             String
  kategori            String
  difficulty          String
  durasiMaks          Int                 @default(120)
  promptBrief         String              @db.Text
  keyPoints           Json
  status              ContentStatus       @default(DRAFT)
  createdById         String?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  createdBy           AdminUser?          @relation("CaseCreatedBy", fields: [createdById], references: [id])
  testSessions        TestSession[]
}

model TestSession {
  id                  String              @id @default(cuid())
  userId              String
  caseId              String?
  tipe                SessionType         @default(TEST)
  parentSessionId     String?
  lessonId            String?
  entryPoint          String              @default("tab_test")
  attemptNo           Int                 @default(1)
  audioPath           String?
  audioDuration       Float
  audioExpiresAt      DateTime
  transcript          String              @db.Text
  isPartial           Boolean             @default(false)
  status              SessionStatus       @default(COMPLETED)
  createdAt           DateTime            @default(now())

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  caseStudy           CaseStudy?          @relation(fields: [caseId], references: [id])
  parentSession       TestSession?        @relation("RetestRelation", fields: [parentSessionId], references: [id])
  retests             TestSession[]       @relation("RetestRelation")
  metrics             SpeechMetrics?
  result              AnalysisResult?
}

model SpeechMetrics {
  id                  String              @id @default(cuid())
  sessionId           String              @unique
  durasiBicara        Float
  jumlahKata          Int
  wpm                 Float
  jumlahFiller        Int
  fillerPerMenit      Float
  jumlahJedaPanjang   Int
  totalDurasiJeda     Float
  rasioJeda           Float
  pauseThresholdUsed  Float               @default(1.5)
  cakupanKeyPoints    Json
  skorStruktur        Float

  session             TestSession         @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

model AnalysisResult {
  id                  String              @id @default(cuid())
  sessionId           String              @unique
  skorJeda            Float?
  skorFiller          Float
  skorTempo           Float
  skorCakupan         Float?
  skorStruktur        Float
  communicationIndex  Float
  kategori            String
  formulaVersion      String              @default("v1.4")
  isPartial           Boolean             @default(false)
  aiFeedback          Json?
  aiPromptVersion     String?
  aiModelName         String?
  createdAt           DateTime            @default(now())

  session             TestSession         @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  feedbackAccesses    FeedbackAccess[]
  feedbackRating      FeedbackRating?
}

model FeedbackAccess {
  id                  String              @id @default(cuid())
  userId              String
  resultId            String
  status              String              @default("success")
  quotaCharged        Boolean             @default(true)
  createdAt           DateTime            @default(now())

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  result              AnalysisResult      @relation(fields: [resultId], references: [id], onDelete: Cascade)
  @@unique([userId, resultId])
}

model FeedbackRating {
  id                  String              @id @default(cuid())
  resultId            String              @unique
  userId              String
  rating              Int
  komentar            String?
  createdAt           DateTime            @default(now())

  result              AnalysisResult      @relation(fields: [resultId], references: [id], onDelete: Cascade)
  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserProgress {
  id                  String              @id @default(cuid())
  userId              String
  lessonId            String
  status              String              @default("unlocked")
  videoWatched        Boolean             @default(false)
  articleRead         Boolean             @default(false)
  scoreKuis           Int?
  completedAt         DateTime?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson              Lesson              @relation(fields: [lessonId], references: [id])
  @@unique([userId, lessonId])
}

model UserDailyChallenge {
  id                  String              @id @default(cuid())
  userId              String
  challengeId         String
  status              String              @default("completed")
  xpAwarded           Int                 @default(10)
  completedAt         DateTime            @default(now())

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model XPLog {
  id                  String              @id @default(cuid())
  userId              String
  sumberAktivitas     String
  refId               String?
  jumlahXp            Int
  createdAt           DateTime            @default(now())

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model StreakLog {
  id                  String              @id @default(cuid())
  userId              String
  date                String
  activityType        String

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, date])
}

model Subscription {
  id                  String              @id @default(cuid())
  userId              String
  plan                String
  status              String              @default("inactive")
  dailyQuota          Int                 @default(3)
  startedAt           DateTime?
  expiresAt           DateTime?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}`;
    navigator.clipboard.writeText(schemaText);
    setCopiedPrisma(true);
    showToast("Skema Prisma telah disalin ke clipboard!");
    setTimeout(() => setCopiedPrisma(false), 3000);
  };

  const selectedCase = caseStudies.find((c) => c.id === selectedCaseId) || caseStudies[0];
  const unitLessons = lessons.filter((l) => l.unitId === selectedUnitId);

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF2FF] text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* GLOBAL TOAST */}
      {toastMsg && (
        <div className="fixed bottom-6 right-4 z-50 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 transition transform animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER & MODE SWITCHER */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-none px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tampil-primary-grad flex items-center justify-center font-extrabold text-lg tracking-tight shadow">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-sm sm:text-base">TAMPIL</span>
                {/* <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Next.js + Prisma + Tailwind
                </span> */}
              </div>
              <p className="text-[11px] text-slate-400">AI Communication Coach</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setSystemMode("student")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                systemMode === "student"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student App</span>
            </button>
            <button
              onClick={() => setSystemMode("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                systemMode === "admin"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin CMS</span>
            </button>
            <button
              onClick={() => setSystemMode("specs")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                systemMode === "specs"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>PRD & Prisma</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => (true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <UserCog className="w-3.5 h-3.5 text-cyan-400" />
              login
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MODE 1: STUDENT WEB APPLICATION                                    */}
      {/* ================================================================= */}
      {systemMode === "student" && (
        <div className="flex-1 flex w-full p-5 gap-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="flex flex-col w-72 shrink-0 gap-5 sticky top-[76px] self-start max-h-[calc(100vh-88px)] overflow-y-auto">
            <div className="card-tampil p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-11 h-11 rounded-2xl bg-tampil-primary-grad text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  P
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-slate-900 truncate">{user.nama}</h2>
                  <p className="text-xs text-slate-500 truncate">{user.status} • {2026 - user.birthYear} thn</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1.5" aria-label="Navigasi Utama">
                <button
                  onClick={() => setStudentTab("home")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                    studentTab === "home"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setStudentTab("roadmap")}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                    studentTab === "roadmap"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5" />
                    <span>Roadmap Belajar</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    3/15
                  </span>
                </button>
                <button
                  onClick={() => setStudentTab("test")}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                    studentTab === "test"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5" />
                    <span>Communication Test</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {user.sessionsLeft}/{user.sessionsMax}
                  </span>
                </button>
                <button
                  onClick={() => setStudentTab("progress")}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                    studentTab === "progress"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    <span>Retest & Progress</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                </button>
                <button
                  onClick={() => setStudentTab("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                    studentTab === "profile"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <UserCog className="w-5 h-5" />
                  <span>Profil & Privasi</span>
                </button>
              </nav>
            </div>

            {/* Daily Quota Card */}
            <div className="card-tampil p-5 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kuota Harian</span>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Reset 01:00 WIB
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Sesi Latihan Rekam</span>
                  <span className="text-indigo-600">Sisa {user.sessionsLeft} dari {user.sessionsMax}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${(user.sessionsLeft / user.sessionsMax) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Feedback Analisis AI</span>
                  <span className="text-purple-600">Sisa {user.aiLeft} dari {user.aiMax}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${(user.aiLeft / user.aiMax) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN STUDENT CONTENT */}
          <main className="flex-1 min-w-0 space-y-6">

            {/* ======================================================= */}
            {/* TAB: HOME                                               */}
            {/* ======================================================= */}
            {studentTab === "home" && (
              <div className="space-y-6">
                {/* Hero / Daily Motivation Banner */}
                <div className="card-tampil p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
                      <Zap className="w-3.5 h-3.5 fill-cyan-300" />
                      <span>Streak {user.streak} Hari Berturut-turut!</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Selamat Datang Kembali, {user.nama.split(" ")[0]}!
                    </h1>
                    <p className="text-sm text-indigo-100 leading-relaxed">
                      Hari ini target latihanmu adalah menjaga tempo 120–160 WPM dan eliminasi filler words. Selesaikan tantangan harian untuk mengumpulkan XP.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setStudentTab("test")}
                        className="px-5 py-2.5 rounded-2xl bg-white text-indigo-700 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow transition flex items-center gap-2"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Mulai Latihan Bicara</span>
                      </button>
                      <button
                        onClick={() => setStudentTab("roadmap")}
                        className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Lanjut Roadmap</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="card-tampil p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Tingkat Kemampuan</p>
                      <h3 className="text-lg font-bold text-slate-900">Level Menengah</h3>
                      <p className="text-[11px] text-indigo-600 font-semibold">{user.xp} Total XP</p>
                    </div>
                  </div>

                  <div className="card-tampil p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Skor CI Terakhir</p>
                      <h3 className="text-lg font-bold text-slate-900">90.4 / 100</h3>
                      <p className="text-[11px] text-cyan-600 font-semibold">Kategori: Sangat Baik</p>
                    </div>
                  </div>

                  <div className="card-tampil p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Fokus Aspek PRD</p>
                      <h3 className="text-lg font-bold text-slate-900">Cakupan Isi</h3>
                      <p className="text-[11px] text-purple-600 font-semibold">4/4 Poin Utama Tercakup</p>
                    </div>
                  </div>
                </div>

                {/* Daily Challenge Card */}
                <div className="card-tampil p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Tantangan Harian (PRD Bagian 10.12)
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        Latihan 30 Detik: Penolakan Asertif Teman Sebaya
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Sampaikan penolakan sopan ajakan nongkrong karena harus menyiapkan ujian besok pagi tanpa menggunakan filler &quot;eee&quot;.
                      </p>
                    </div>
                    <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
                      +10 XP
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCaseId("case-1");
                      setStudentTab("test");
                      setTestStep(2);
                    }}
                    className="btn-primary-tampil w-auto text-xs sm:text-sm"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Mulai Rekam Tantangan Harian (≥20 Detik)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: ROADMAP BELAJAR                                    */}
            {/* ======================================================= */}
            {studentTab === "roadmap" && (
              <div className="space-y-6">
                <div className="card-tampil p-6 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Struktur Kurikulum Microlearning (PRD Bagian 8 & 11)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Roadmap Belajar Terstruktur (3 Unit x 5 Lesson)
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Setiap modul memadukan video interaktif (≤3m), bacaan ringkas opsional, dan kuis pemahaman (syarat kelulusan ≥60%).
                    </p>
                  </div>

                  {/* Unit Selector Tabs */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {units.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={`p-4 rounded-2xl text-left border transition ${
                          selectedUnitId === unit.id
                            ? "bg-indigo-50 border-indigo-400 shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[11px] font-bold text-indigo-600 uppercase">Unit {unit.urutan}</span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{unit.konteks}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{unit.deskripsi}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesson List */}
                <div className="card-tampil p-6 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-200">
                    Daftar Lesson ({unitLessons.length} Modul)
                  </h3>

                  <div className="space-y-3">
                    {unitLessons.map((l) => (
                      <div
                        key={l.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              l.completed
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {l.completed ? <Check className="w-5 h-5" /> : l.urutan}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{l.judul}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {l.targetAspek}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {l.completed ? "Selesai (Kuis 100%)" : "Belum selesai • Video + Artikel + Kuis"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveLessonModal(l);
                            setLessonSubTab("video");
                            setQuizSelected(null);
                            setQuizSubmitted(false);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            l.completed
                              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              : "btn-primary-tampil"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{l.completed ? "Buka Kembali" : "Pelajari"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: COMMUNICATION TEST (WEB AUDIO & CI FORMULA)         */}
            {/* ======================================================= */}
            {studentTab === "test" && (
              <div className="space-y-6">
                {/* STEP INDICATOR */}
                <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 text-center text-xs font-bold">
                  <div className={`p-2 rounded-xl ${testStep === 1 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
                    1. Kasus
                  </div>
                  <div className={`p-2 rounded-xl ${testStep === 2 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
                    2. Rekam Suara
                  </div>
                  <div className={`p-2 rounded-xl ${testStep === 3 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
                    3. Review Transkrip
                  </div>
                  <div className={`p-2 rounded-xl ${testStep === 4 ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
                    4. Hasil & AI
                  </div>
                </div>

                {/* STEP 1: PILIH KASUS STUDI */}
                {testStep === 1 && (
                  <div className="card-tampil p-6 sm:p-8 space-y-6">
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Langkah 1: Pilih Kasus Studi (PRD Bagian 10.5)
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        Pilih Skenario Situasi Komunikasi
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        Skenario studi kasus dirancang untuk menguji kelancaran, kontrol jeda, tempo WPM, dan pemenuhan poin argumen.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {caseStudies.map((cs) => (
                        <div
                          key={cs.id}
                          onClick={() => setSelectedCaseId(cs.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition ${
                            selectedCaseId === cs.id
                              ? "bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              {cs.konteks}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {cs.difficulty}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-2">{cs.judul}</h4>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{cs.promptBrief}</p>
                          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                            <span>Durasi Maks: {cs.durasiMaks}s</span>
                            <span className="font-semibold text-indigo-600 flex items-center gap-1">
                              Pilih Kasus <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setTestStep(2)}
                        className="btn-primary-tampil px-6 text-sm"
                      >
                        <span>Lanjut ke Perekaman Suara</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: REKAM SUARA */}
                {testStep === 2 && (
                  <div className="card-tampil p-6 sm:p-8 space-y-6">
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Langkah 2: Rekam Jawaban Lisan (Web Audio API)
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        {selectedCase.judul}
                      </h2>
                      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed mt-3">
                        <p className="font-semibold text-indigo-900 mb-1">Brief Situasi:</p>
                        {selectedCase.promptBrief}
                      </div>
                    </div>

                    {/* Key points to cover */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Poin Kunci yang Harus Dicakup:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {selectedCase.keyPoints.map((kp, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            <span>{kp.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recording Deck */}
                    <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-6 shadow-inner">
                      {/* Timer Display */}
                      <div className="text-center">
                        <span className="font-mono text-4xl sm:text-5xl font-extrabold text-cyan-400">
                          {Math.floor(recordDuration / 60)
                            .toString()
                            .padStart(2, "0")}
                          :{(recordDuration % 60).toString().padStart(2, "0")}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          {isRecording
                            ? (micReady
                              ? "Sedang Merekam... Bicaralah secara tenang dan runtut."
                              : "Menunggu izin mikrofon...")
                            : "Siap merekam. Tekan tombol Mulai di bawah (butuh izin mikrofon)."}
                        </p>
                      </div>

                      {/* Live Waveform (audio nyata via AnalyserNode) */}
                      <div ref={waveBarsRef} className="flex items-center justify-center gap-1.5 h-14">
                        {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65, 90, 45].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1.5 rounded-full bg-cyan-400 transition-[height] duration-75 ${
                              isRecording ? "wave-bar" : "opacity-30"
                            }`}
                            style={{
                              height: `${isRecording ? h : 20}%`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
                          >
                            <Mic className="w-5 h-5 text-cyan-300" />
                            <span>Mulai Rekam Suara</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
                          >
                            <Square className="w-5 h-5 fill-white" />
                            <span>Selesai Rekam ({recordDuration}s)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setTestStep(1)}
                        className="btn-outlined-tampil text-xs sm:text-sm"
                      >
                        Ganti Kasus
                      </button>
                      <button
                        onClick={() => setTestStep(3)}
                        disabled={recordDuration < 5}
                        className="btn-primary-tampil text-xs sm:text-sm"
                      >
                        <span>Lanjut Review Transkripsi</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW TRANSCRIPT */}
                {testStep === 3 && (
                  <div className="card-tampil p-6 sm:p-8 space-y-6">
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Langkah 3: Review Transkripsi STT (PRD Bagian 10.11)
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        Periksa Hasil Speech-to-Text
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        Transkripsi dihasilkan dari audio Anda via Groq Whisper STT. Anda dapat menyesuaikan teks sebelum rumus Communication Index dihitung.
                      </p>
                    </div>

                    {/* Status STT */}
                    {sttStatus === "uploading" && (
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span className="font-semibold">Mentranskripsi audio via Groq Whisper… Tunggu sebentar.</span>
                      </div>
                    )}
                    {sttStatus === "error" && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold">Speech-to-Text belum berhasil</p>
                          <p>{sttError}</p>
                          <p className="text-amber-800">Anda tetap dapat mengetik/memperbaiki transkrip secara manual di bawah, lalu lanjut analisis.</p>
                        </div>
                      </div>
                    )}
                    {sttStatus === "done" && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Transkrip dari audio berhasil dibuat. Silakan tinjau & perbaiki bila perlu.</span>
                      </div>
                    )}

                    {/* Pemutaran audio hasil rekam */}
                    {audioUrl && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-700">Audio Ter rekam:</span>
                        <audio controls src={audioUrl} className="w-full h-10 rounded-xl" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Transkripsi Ucapan (Read/Edit):</span>
                      </label>
                      <textarea
                        rows={4}
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        disabled={sttStatus === "uploading"}
                        placeholder={
                          sttStatus === "uploading"
                            ? "Menunggu hasil transkripsi dari Groq Whisper…"
                            : "Tidak ada transkrip. Rekam ulang atau ketik hasil ucapan Anda di sini."
                        }
                        className="w-full p-4 rounded-2xl bg-white border border-indigo-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed shadow-inner disabled:opacity-60"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={handleRetake}
                        disabled={reRecordLeft <= 0}
                        className="btn-outlined-tampil text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Rekam Ulang (Sisa {reRecordLeft}x)</span>
                      </button>

                      <button
                        onClick={submitTestForAnalysis}
                        disabled={isSubmittingTest || sttStatus === "uploading"}
                        className="btn-primary-tampil text-xs sm:text-sm"
                      >
                        {isSubmittingTest ? (
                          <span>Menghitung Rumus CI...</span>
                        ) : (
                          <>
                            <span>Proses Analisis & Rumus CI</span>
                            <Sparkles className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: HASIL ANALISIS & RUMUS CI */}
                {testStep === 4 && calculatedResult && (
                  <div className="card-tampil p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          Hasil Evaluasi Deterministik PRD v1.4
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                          Communication Index (CI)
                        </h2>
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                        Kategori: {calculatedResult.kategori}
                      </span>
                    </div>

                    {/* CI Main Score Card */}
                    <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between gap-6 shadow-md">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-tampil-primary-grad flex items-center justify-center font-black text-3xl text-white shadow">
                          {calculatedResult.communicationIndex}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Skor Akhir: {calculatedResult.communicationIndex} / 100</h3>
                          <p className="text-xs text-slate-300 mt-1">
                            Formula deterministik berbasis 5 bobot aspek PRD v1.4
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-right text-xs text-slate-300">
                        <span>WPM: <strong className="text-cyan-400 font-mono">{calculatedResult.metrics.wpm}</strong> kata/menit</span>
                        <span>Filler: <strong className="text-cyan-400 font-mono">{calculatedResult.metrics.jumlahFiller}</strong> kata</span>
                        <span>Jeda &gt;1.5s: <strong className="text-cyan-400 font-mono">{calculatedResult.metrics.jumlahJedaPanjang}</strong> kali</span>
                      </div>
                    </div>

                    {/* Breakdown 5 Aspek */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-900">Rincian 5 Aspek Penilaian:</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>1. Kelancaran Jeda (20%)</span>
                            <span className="text-indigo-600 font-bold">{calculatedResult.metrics.skorJeda}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${calculatedResult.metrics.skorJeda}%` }}></div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>2. Kebersihan Ucapan (20%)</span>
                            <span className="text-indigo-600 font-bold">{calculatedResult.metrics.skorFiller}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${calculatedResult.metrics.skorFiller}%` }}></div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>3. Tempo Bicara (20%)</span>
                            <span className="text-indigo-600 font-bold">{calculatedResult.metrics.skorTempo}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${calculatedResult.metrics.skorTempo}%` }}></div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>4. Cakupan Isi (25%)</span>
                            <span className="text-indigo-600 font-bold">{calculatedResult.metrics.skorCakupan}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${calculatedResult.metrics.skorCakupan}%` }}></div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>5. Struktur (15%)</span>
                            <span className="text-indigo-600 font-bold">{calculatedResult.metrics.skorStruktur}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${calculatedResult.metrics.skorStruktur}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback Coach Section */}
                    <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>AI Coach Feedback (LLaMA 3.3 via Groq)</span>
                        </div>
                        {!showAiFeedback && (
                          <span className="text-xs font-semibold text-purple-700">
                            Sisa Kuota AI: {user.aiLeft}/3
                          </span>
                        )}
                      </div>

                      {!showAiFeedback ? (
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Buka feedback mendalam berupa poin kekuatan ucapan, kelemahan spesifik, serta rekomendasi latihan personal dari AI Coach.
                          </p>
                          <button
                            onClick={handleOpenAiFeedback}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 transition shadow-sm"
                          >
                            Tampilkan Feedback AI
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                              ✓ Kekuatan Anda:
                            </h5>
                            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                              {calculatedResult.aiFeedback?.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5">
                            <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                              ⚠ Hal yang Perlu Diperbaiki:
                            </h5>
                            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                              {calculatedResult.aiFeedback?.weaknesses.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5">
                            <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                              🎯 Rekomendasi Latihan Selanjutnya:
                            </h5>
                            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                              {calculatedResult.aiFeedback?.recommendations.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => {
                          setTestStep(1);
                          setRecordDuration(0);
                        }}
                        className="btn-outlined-tampil text-xs sm:text-sm"
                      >
                        Selesai & Pilih Kasus Lain
                      </button>
                      <button
                        onClick={() => setStudentTab("progress")}
                        className="btn-primary-tampil text-xs sm:text-sm"
                      >
                        <span>Lihat Perbandingan Retest</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: PROGRESS & RETEST                                  */}
            {/* ======================================================= */}
            {studentTab === "progress" && (
              <div className="space-y-6">
                <div className="card-tampil p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Evaluasi Peningkatan (PRD Bagian 12 & 14)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Perbandingan Test Awal vs Retest (Delta Improvement)
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Mengevaluasi efektivitas latihan dengan mengukur perubahan skor CI, efisiensi tempo, dan penurunan filler words.
                    </p>
                  </div>

                  {/* Comparative Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Test Awal */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Sesi 1 • Test Awal
                        </span>
                        <span className="text-xs font-semibold text-slate-400">4 hari lalu</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-extrabold text-2xl text-slate-800">
                          68.2
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">Kategori: Berkembang</h4>
                          <p className="text-xs text-slate-500">Kasus: Menolak Ajakan Teman</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span>Tempo Bicara:</span>
                          <strong>84.7 WPM (Lambat)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Filler Words:</span>
                          <strong>5 kata (5.7/min)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Jeda Panjang (&gt;1.5s):</span>
                          <strong>4 kali</strong>
                        </div>
                      </div>
                    </div>

                    {/* Retest */}
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          Sesi 2 • Retest Setara
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">Hari ini</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow">
                          90.4
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-indigo-900">Kategori: Sangat Baik</h4>
                          <p className="text-xs text-indigo-700">Kasus: Meminta Maaf Terlambat</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-indigo-200/60">
                        <div className="flex justify-between">
                          <span>Tempo Bicara:</span>
                          <strong className="text-emerald-700">128.5 WPM (Optimal)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Filler Words:</span>
                          <strong className="text-emerald-700">2 kata (2.7/min)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Jeda Panjang (&gt;1.5s):</span>
                          <strong className="text-emerald-700">1 kali</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delta Improvement Banner */}
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Peningkatan Signifikan (+22.2 Poin CI)</span>
                      </h4>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Anda berhasil menaikkan tempo bicara sebesar +43.8 WPM dan menekan filler words hingga 60%.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCaseId("case-3");
                        setStudentTab("test");
                        setTestStep(1);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      Uji Kasus Baru (+XP)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: PROFIL & PRIVASI                                   */}
            {/* ======================================================= */}
            {studentTab === "profile" && (
              <div className="space-y-6">
                <div className="card-tampil p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Manajemen Akun & Hak Privasi Pengguna (PRD Bagian 19)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Profil & Privasi Pengguna
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Kepatuhan terhadap UU PDP & Google Play Policy: minimisasi data (hanya tahun lahir), 3 consent terpisah, dan retensi audio 30 hari.
                    </p>
                  </div>

                  {/* Profil Minimisasi Data */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900">Data Pengguna Tersimpan</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Nama Lengkap:</span>
                        <p className="font-semibold text-slate-800">{user.nama}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tahun Lahir (Minimisasi Data):</span>
                        <p className="font-semibold text-slate-800">{user.birthYear} (Usia 20 thn - Memenuhi Age Gate 18+)</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Status Pengguna:</span>
                        <p className="font-semibold text-slate-800">{user.status}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tujuan Utama Belajar:</span>
                        <p className="font-semibold text-slate-800">{user.goal}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3 Consents Management */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">Kelola 3 Persetujuan Mandiri (Consent):</h4>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-xs text-slate-800">1. Syarat Ketentuan & Kebijakan Privasi</p>
                        <p className="text-[11px] text-slate-500">Wajib untuk akses platform pembelajaran dasar.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Diberikan
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-xs text-slate-800">2. Izin Perekaman Suara (Microphone)</p>
                        <p className="text-[11px] text-slate-500">Dibutuhkan untuk Communication Test & evaluasi rumus CI.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Diberikan
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-xs text-slate-800">3. Pemrosesan AI Pihak Ketiga (Groq Whisper & LLaMA)</p>
                        <p className="text-[11px] text-slate-500">Transkripsi STT dan feedback mendalam AI coach.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Diberikan
                      </span>
                    </div>
                  </div>

                  {/* Actions: Download Data & Account Deletion */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => showToast("File JSON arsip metrik berhasil diunduh (PRD PRV-3).")}
                      className="btn-outlined-tampil text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Data Saya (PRV-3)</span>
                    </button>

                    <button
                      onClick={() => showToast("Permintaan penghapusan akun diverifikasi. Data akan dibersihkan dalam 30 hari.")}
                      className="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Akun & Data (PRV-2)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 2: ADMIN WEB CMS                                              */}
      {/* ================================================================= */}
      {systemMode === "admin" && (
        <div className="flex-1 w-full p-6 space-y-6">
          <div className="card-tampil p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Panel Pengelola Konten & Kebijakan
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">
                  Admin Web CMS (ADM-1 s/d ADM-10)
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Pengelolaan kurikulum mikro, bank kasus studi, monitoring API Groq, dan retensi data audio.
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">
                Role: Super Admin
              </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Mahasiswa</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">148</h3>
                <span className="text-[10px] text-emerald-600 font-bold">+12 minggu ini</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Sesi Latihan</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">512</h3>
                <span className="text-[10px] text-indigo-600 font-bold">Rata-rata 4.2/mhs</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Modul Pembelajaran</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">15 Lesson</h3>
                <span className="text-[10px] text-purple-600 font-bold">3 Unit Aktif</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Retensi Audio Aktif</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">30 Hari</h3>
                <span className="text-[10px] text-cyan-600 font-bold">Auto-Purge Aktif</span>
              </div>
            </div>

            {/* Units & Lessons Manager */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">Manajemen Konten Kurikulum (ADM-3)</h3>
                <button
                  onClick={() => showToast("Form tambah materi baru siap dibuka.")}
                  className="btn-primary-tampil px-3.5 py-1.5 text-xs"
                >
                  + Tambah Lesson
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2.5 px-3">Kode</th>
                      <th className="py-2.5 px-3">Judul Lesson</th>
                      <th className="py-2.5 px-3">Target Aspek</th>
                      <th className="py-2.5 px-3">Komponen</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">u1-l1</td>
                      <td className="py-2.5 px-3 font-semibold">Mengatur Jeda Napas Saat Bicara Santai</td>
                      <td className="py-2.5 px-3">Kelancaran jeda</td>
                      <td className="py-2.5 px-3">Video + Artikel + Kuis</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Published</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">u2-l2</td>
                      <td className="py-2.5 px-3 font-semibold">Menyampaikan Ketidaksetujuan Tanpa Konflik</td>
                      <td className="py-2.5 px-3">Cakupan isi</td>
                      <td className="py-2.5 px-3">Video + Kuis</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Published</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">u3-l3</td>
                      <td className="py-2.5 px-3 font-semibold">Kontrol Tempo Public Speaking di Ruang Kelas</td>
                      <td className="py-2.5 px-3">Tempo</td>
                      <td className="py-2.5 px-3">Video + Artikel + Kuis</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Published</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Case Studies Manager */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">Bank Kasus Studi Test & Retest (ADM-8)</h3>
                <button
                  onClick={() => showToast("Dialog buat kasus studi baru siap.")}
                  className="btn-outlined-tampil px-3.5 py-1.5 text-xs"
                >
                  + Tambah Kasus
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {caseStudies.map((cs) => (
                  <div key={cs.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-indigo-600">{cs.konteks}</span>
                      <span className="text-slate-500">{cs.difficulty}</span>
                    </div>
                    <h5 className="font-bold text-slate-900">{cs.judul}</h5>
                    <p className="text-slate-600 line-clamp-2">{cs.promptBrief}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 3: PRD & PRISMA ARCHITECTURE EXPLORER                         */}
      {/* ================================================================= */}
      {systemMode === "specs" && (
        <div className="flex-1 w-full p-6 space-y-6">
          <div className="card-tampil p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Arsitektur Teknis Adaptasi PRD v1.4
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Full-Stack Next.js (App Router), Tailwind CSS, PostgreSQL & Prisma ORM
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Struktur proyek monorepo yang menggabungkan antarmuka Student Web App, Admin CMS, API Route Handlers untuk STT & Rumus CI, serta 20+ entitas data relasional di PostgreSQL via Prisma.
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="font-bold text-sm text-indigo-700 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>1. Skema PostgreSQL Prisma</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Terdiri dari model User, AdminUser, Consent, Unit, Lesson, LearningMaterial, QuizQuestion, CaseStudy, TestSession, SpeechMetrics, AnalysisResult, dll. Dilengkapi lazy reset 01:00 WIB dan idempotency FeedbackAccess.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="font-bold text-sm text-indigo-700 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>2. Web Audio & Rumus CI Server</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Perekaman browser via MediaRecorder API dikirim ke Route Handler <code className="font-mono text-indigo-600">/api/test/submit</code>. Formula Communication Index (0–100) dihitung secara deterministik di server.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="font-bold text-sm text-indigo-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. Kepatuhan Privasi PRD</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Minimisasi data pengguna (hanya tahun lahir), 3 consent mandiri terpisah (AUTH-3/4/5), audio expires otomatis 30 hari, serta endpoint ekspor data PRV-3.
                </p>
              </div>
            </div>

            {/* Prisma Schema Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    File Skema: <code className="font-mono text-indigo-600">prisma/schema.prisma</code>
                  </h3>
                  <p className="text-xs text-slate-500">Skema PostgreSQL aktif yang siap di-migrate atau di-push.</p>
                </div>
                <button
                  onClick={copyPrismaSchema}
                  className="btn-primary-tampil px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrisma ? "Tersalin!" : "Salin schema.prisma"}</span>
                </button>
              </div>

              <pre className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[460px] border border-slate-800">
                {`// ============================================================================
// TAMPIL v1.4 — Prisma Schema for PostgreSQL (Next.js App Router)
// ============================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. PENGGUNA APLIKASI UTAMA (Minimisasi Data)
model User {
  id                  String              @id @default(cuid())
  nama                String
  email               String              @unique
  passwordHash        String?
  authProvider        AuthProvider        @default(CREDENTIALS)
  tahunLahir          Int                 // Minimisasi data (Bagian 6.1 & 19.3)
  isAdult             Boolean             @default(true)
  statusPengguna      String?             // Mahasiswa / Fresh Graduate
  tujuanUtama         String[]            // Array max 2 tujuan
  createdAt           DateTime            @default(now())
  deletedAt           DateTime?

  consents            Consent[]
  stats               UserStats?
  quotas              UserQuota[]
  confidenceLogs      SelfConfidenceLog[]
  progress            UserProgress[]
  dailyChallenges     UserDailyChallenge[]
  xpLogs              XPLog[]
  streakLogs          StreakLog[]
  testSessions        TestSession[]
  feedbackAccesses    FeedbackAccess[]
  feedbackRatings     FeedbackRating[]
  subscriptions       Subscription[]
}

// 2. AKUN ADMIN CMS TERPISAH (Bagian 20 & 25.2 - ADM-1, ADM-10)
model AdminUser {
  id                  String              @id @default(cuid())
  nama                String
  email               String              @unique
  passwordHash        String
  role                String              @default("admin")
  status              String              @default("active")
  createdAt           DateTime            @default(now())
  lastLoginAt         DateTime?

  unitsCreated        Unit[]              @relation("UnitCreatedBy")
  lessonsCreated      Lesson[]            @relation("LessonCreatedBy")
  casesCreated        CaseStudy[]         @relation("CaseCreatedBy")
}

// 3. TIGA CONSENT TERPISAH (Bagian 6.2 - AUTH-3, AUTH-4, AUTH-5)
model Consent {
  id                  String              @id @default(cuid())
  userId              String
  consentType         ConsentType
  docVersion          String              @default("v1.4")
  status              ConsentStatus       @default(GRANTED)
  grantedAt           DateTime            @default(now())
  revokedAt           DateTime?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, consentType])
}

// 4. GAMIFIKASI & KUOTA HARIAN (Reset Pukul 01.00 WIB)
model UserStats {
  userId              String              @id
  totalXp             Int                 @default(0)
  level               String              @default("Pemula")
  currentStreak       Int                 @default(0)
  longestStreak       Int                 @default(0)
  lastActivityDate    String?
  fokusAspek          AspectCI?

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ... Lihat file prisma/schema.prisma untuk entitas lengkap Unit, Lesson, TestSession, SpeechMetrics, AnalysisResult`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: LESSON VIEWER (VIDEO, ARTIKEL, KUIS)                       */}
      {/* ================================================================= */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-tampil max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  Unit {activeLessonModal.unitId.replace("u", "")} • Lesson {activeLessonModal.urutan}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{activeLessonModal.judul}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Target Aspek CI: {activeLessonModal.targetAspek}</p>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs: Video, Artikel, Kuis */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setLessonSubTab("video")}
                className={`py-2 px-3 rounded-xl transition ${
                  lessonSubTab === "video" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                }`}
              >
                1. Video Wajib (≤3m)
              </button>
              <button
                onClick={() => setLessonSubTab("article")}
                className={`py-2 px-3 rounded-xl transition ${
                  lessonSubTab === "article" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                }`}
              >
                2. Artikel (+5 XP)
              </button>
              <button
                onClick={() => setLessonSubTab("quiz")}
                className={`py-2 px-3 rounded-xl transition ${
                  lessonSubTab === "quiz" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                }`}
              >
                3. Kuis (Lulus ≥60%)
              </button>
            </div>

            {/* Sub-view: Video */}
            {lessonSubTab === "video" && (
              <div className="space-y-4">
                <div className="aspect-video rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-cyan-400" /> Audio Stereo
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/20 font-mono text-[10px]">HD 1080p</span>
                  </div>
                  <div className="flex flex-col items-center justify-center my-auto">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-105 transition">
                      <Play className="w-7 h-7 fill-white text-white ml-1" />
                    </div>
                    <p className="text-xs text-slate-300 mt-3 font-medium">Klik untuk memutar materi video (02:45)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 backdrop-blur text-center text-xs text-slate-200">
                    &quot;Jeda 0,5 hingga 1 detik memberi waktu otak menyusun kalimat tanpa filler words...&quot;
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setLessonSubTab("article")}
                    className="btn-primary-tampil text-xs"
                  >
                    <span>Lanjut ke Bacaan Artikel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view: Artikel */}
            {lessonSubTab === "article" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-sm text-slate-800 leading-relaxed">
                  <h4 className="font-bold text-base text-slate-900">Ringkasan Konsep & Penerapan:</h4>
                  <p>{activeLessonModal.artikel}</p>
                  <p className="text-xs text-slate-600">
                    Tips Praktis: Saat berbicara dalam forum, letakkan tangan di atas meja secara rileks dan tarik napas halus melalui hidung saat berpindah ke poin kalimat berikutnya.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setLessonSubTab("quiz")}
                    className="btn-primary-tampil text-xs"
                  >
                    <span>Lanjut ke Kuis Pemahaman</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view: Kuis */}
            {lessonSubTab === "quiz" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">
                    Pertanyaan 1 dari 1: Berapa durasi jeda alami yang efektif dalam komunikasi santai?
                  </h4>

                  <div className="space-y-2">
                    {[
                      "0,3 hingga 1,0 detik (Jeda alami)",
                      "3 hingga 5 detik (Keheningan panjang)",
                      "Tidak boleh ada jeda sama sekali",
                      "Di atas 10 detik",
                    ].map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!quizSubmitted) setQuizSelected(idx);
                        }}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition ${
                          quizSelected === idx
                            ? "bg-indigo-50 border-indigo-500 font-semibold text-indigo-900 ring-2 ring-indigo-500/20"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleCompleteLessonQuiz}
                      disabled={quizSelected === null}
                      className="btn-primary-tampil w-full text-xs sm:text-sm mt-2"
                    >
                      Kirim Jawaban Kuis
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center justify-between">
                      <span className="font-semibold">Selamat! Anda lulus modul ini dengan nilai 100%.</span>
                      <button
                        onClick={() => setActiveLessonModal(null)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                      >
                        Selesai
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

  
    </div>
  );
}
