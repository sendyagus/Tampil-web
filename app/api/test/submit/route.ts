import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId,
      sessionType = "TEST",
      parentSessionId,
      transcript,
      duration = 45,
    } = body;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Transkripsi tidak boleh kosong." },
        { status: 400 }
      );
    }

    const durasiDetik = Math.max(20, Math.min(180, Number(duration)));
    const textLower = transcript.toLowerCase();
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const jumlahKata = words.length;

    // 1. Hitung WPM (Tempo)
    const wpm = Math.round((jumlahKata / durasiDetik) * 60);
    let skorTempo = 100;
    if (wpm < 120) {
      skorTempo = Math.max(40, Math.round(50 + (wpm / 120) * 50));
    } else if (wpm > 160) {
      skorTempo = Math.max(50, Math.round(100 - ((wpm - 160) / 40) * 40));
    }

    // 2. Deteksi Filler Words Bahasa Indonesia
    const fillerPatterns = [
      /\b(eee+|eee|eeh|eh+|ahh+|hmm+|anu|apa ya|apaan ya|gitu loh|kayak semacam)\b/gi,
    ];
    let jumlahFiller = 0;
    for (const pat of fillerPatterns) {
      const matches = transcript.match(pat);
      if (matches) jumlahFiller += matches.length;
    }
    const fillerPerMenit = Number(((jumlahFiller / durasiDetik) * 60).toFixed(1));
    let skorFiller = 100;
    if (fillerPerMenit > 1) {
      skorFiller = Math.max(35, Math.round(100 - (fillerPerMenit - 1) * 12));
    }

    // 3. Estimasi Jeda Panjang (Simulasi berbasis tanda baca dan spasi)
    const ellipsesCount = (transcript.match(/\.\.\./g) || []).length;
    const jumlahJedaPanjang = Math.min(6, Math.max(1, ellipsesCount + (jumlahFiller > 3 ? 2 : 1)));
    const totalDurasiJeda = Number((jumlahJedaPanjang * 1.8).toFixed(1));
    const rasioJeda = Number((totalDurasiJeda / durasiDetik).toFixed(3));
    const skorJeda = Math.max(45, Math.round(100 - (jumlahJedaPanjang - 1) * 14));

    // 4. Deteksi Cakupan Key Points
    let keyPointsDetail = [
      { label: "Poin Inti 1", captured: true },
      { label: "Poin Inti 2", captured: true },
      { label: "Poin Alternatif", captured: true },
    ];
    let skorCakupan = 85;

    if (caseId) {
      try {
        const caseStudy = await prisma.caseStudy.findUnique({
          where: { id: caseId },
        });
        if (caseStudy && Array.isArray(caseStudy.keyPoints)) {
          const rawKeyPoints = caseStudy.keyPoints as Array<{
            label: string;
            triggers: string[];
          }>;
          let matchedCount = 0;
          keyPointsDetail = rawKeyPoints.map((kp) => {
            const isMatch = kp.triggers.some((trigger) =>
              textLower.includes(trigger.toLowerCase())
            );
            if (isMatch) matchedCount++;
            return {
              label: kp.label,
              captured: isMatch,
            };
          });
          skorCakupan = Math.round((matchedCount / rawKeyPoints.length) * 100);
        }
      } catch (e) {
        console.warn("Could not query case study from DB, using heuristic", e);
      }
    }

    // 5. Skor Struktur (Pembuka, Alur, Penutup)
    const hasPembuka = /\b(halo|selamat|pagi|siang|sore|malam|terima kasih|menurut saya|jadi begini|perkenalkan)\b/i.test(transcript);
    const hasPenghubung = /\b(karena|tetapi|namun|selain itu|kemudian|sehingga|maka|oleh karena itu)\b/i.test(transcript);
    const hasPenutup = /\b(terima kasih|sekian|kesimpulannya|intinya|semoga|harapannya|mohon maaf)\b/i.test(transcript);

    let skorStruktur = 60;
    if (hasPembuka) skorStruktur += 15;
    if (hasPenghubung) skorStruktur += 10;
    if (hasPenutup) skorStruktur += 15;
    skorStruktur = Math.min(100, skorStruktur);

    // 6. Communication Index (Deterministik Berbobot)
    const communicationIndex = Number(
      (
        skorJeda * 0.2 +
        skorFiller * 0.2 +
        skorTempo * 0.2 +
        skorCakupan * 0.25 +
        skorStruktur * 0.15
      ).toFixed(1)
    );

    let kategori = "Perlu Latihan";
    if (communicationIndex >= 85) kategori = "Sangat Baik";
    else if (communicationIndex >= 70) kategori = "Baik";
    else if (communicationIndex >= 55) kategori = "Berkembang";

    // AI Feedback recommendations
    const aiFeedback = {
      strengths: [
        `Artikulasi tersampaikan dengan ${jumlahKata} kata dalam ${durasiDetik} detik.`,
        skorCakupan >= 75
          ? "Cakupan poin penting tersampaikan dengan baik sesuai konteks situasi."
          : "Struktur kalimat awal sudah cukup lugas.",
      ],
      weaknesses: [
        wpm < 115
          ? `Tempo bicara Anda (${wpm} WPM) masih di bawah standar ideal 120-160 WPM.`
          : jumlahFiller > 3
          ? `Terdeteksi ${jumlahFiller} filler words yang mengganggu kebersihan ucapan.`
          : "Terdapat jeda hening yang dapat dirapikan dengan jeda napas diafragma.",
      ],
      recommendations: [
        "Latih silent pause 0,5 detik saat merangkai kata berikutnya.",
        "Gunakan variasi intonasi untuk menekankan kata kunci argumen Anda.",
      ],
    };

    // Simpan ke PostgreSQL jika tersedia
    let savedSession = null;
    try {
      const student = await prisma.user.findFirst({
        where: { email: "putri@mahasiswa.ac.id" },
      });

      if (student) {
        savedSession = await prisma.testSession.create({
          data: {
            userId: student.id,
            caseId: caseId || null,
            tipe: sessionType === "RETEST" ? "RETEST" : "TEST",
            parentSessionId: parentSessionId || null,
            audioDuration: durasiDetik,
            audioExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            transcript,
            status: "COMPLETED",
            metrics: {
              create: {
                durasiBicara: durasiDetik,
                jumlahKata,
                wpm,
                jumlahFiller,
                fillerPerMenit,
                jumlahJedaPanjang,
                totalDurasiJeda,
                rasioJeda,
                cakupanKeyPoints: keyPointsDetail,
                skorStruktur,
              },
            },
            result: {
              create: {
                skorJeda,
                skorFiller,
                skorTempo,
                skorCakupan,
                skorStruktur,
                communicationIndex,
                kategori,
                aiFeedback,
              },
            },
          },
          include: {
            metrics: true,
            result: true,
          },
        });

        // Deduct quota
        await prisma.userQuota.updateMany({
          where: { userId: student.id },
          data: { sesiHarianPakai: { increment: 1 } },
        });

        // Award XP (+25 XP)
        await prisma.userStats.update({
          where: { userId: student.id },
          data: { totalXp: { increment: 25 } },
        });
      }
    } catch (dbErr) {
      console.warn("DB save skipped, returning calculated session object:", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: savedSession ? savedSession.id : `ses_${Date.now()}`,
        resultId: savedSession?.result ? savedSession.result.id : `res_${Date.now()}`,
        communicationIndex,
        kategori,
        metrics: {
          wpm,
          durasiBicara: durasiDetik,
          jumlahKata,
          jumlahFiller,
          fillerPerMenit,
          jumlahJedaPanjang,
          totalDurasiJeda,
          rasioJeda,
          cakupanKeyPoints: keyPointsDetail,
          skorJeda,
          skorFiller,
          skorTempo,
          skorCakupan,
          skorStruktur,
        },
        aiFeedback,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
