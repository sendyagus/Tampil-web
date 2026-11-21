import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// Speech-to-Text endpoint (PRD Bagian 10.11) — Groq Whisper STT
// Menerima blob audio dari client (MediaRecorder), meneruskannya ke Groq
// Audio Transcriptions API, lalu mengembalikan teks transkrip (id-ID).
// ============================================================================

const GROQ_STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_STT_MODEL = process.env.GROQ_STT_MODEL || "whisper-large-v3";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "gsk_demo_dummy_key" || apiKey.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "MISSING_API_KEY",
          message:
            "GROQ_API_KEY belum diisi dengan kunci asli. Tambahkan kunci Groq di file .env untuk mengaktifkan Speech-to-Text.",
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const audio = formData.get("audio");
    const language = (formData.get("language") as string) || "id";

    if (!audio || !(audio instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "Berkas audio tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    // Teruskan audio ke Groq (multipart/form-data)
    const groqForm = new FormData();
    const mime = audio.type || "audio/webm";
    const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm";
    groqForm.append("file", audio, `recording.${ext}`);
    groqForm.append("model", GROQ_STT_MODEL);
    groqForm.append("language", language);
    groqForm.append("response_format", "json");
    groqForm.append("temperature", "0");

    const groqRes = await fetch(GROQ_STT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: groqForm,
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      console.warn("Groq STT error:", groqRes.status, errText);
      return NextResponse.json(
        {
          success: false,
          code: "GROQ_ERROR",
          message: `Groq Whisper gagal memproses audio (HTTP ${groqRes.status}). Periksa kunci & kuota API.`,
        },
        { status: 502 }
      );
    }

    const groqJson = (await groqRes.json()) as { text?: string };
    const transcript = (groqJson.text || "").trim();

    if (transcript.length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "EMPTY_TRANSCRIPT",
          message: "Audio berhasil diproses tetapi tidak ada ucapan yang terdeteksi. Coba rekam lagi sambil berbicara lebih jelas.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, transcript, language });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("STT route failed:", error);
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: errMessage },
      { status: 500 }
    );
  }
}
