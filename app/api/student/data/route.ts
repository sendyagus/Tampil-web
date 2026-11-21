import { NextResponse } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Cari user demo atau user pertama
    const user = await prisma.user.findFirst({
      where: { email: "putri@mahasiswa.ac.id" },
      include: {
        stats: true,
        quotas: {
          orderBy: { periode: "desc" },
          take: 1,
        },
        consents: true,
        confidenceLogs: {
          orderBy: { tanggal: "asc" },
        },
      },
    });

    const units = await prisma.unit.findMany({
      orderBy: { urutan: "asc" },
      include: {
        lessons: {
          orderBy: { urutan: "asc" },
          include: {
            materials: {
              include: {
                quizQuestions: true,
              },
            },
            userProgress: user
              ? {
                  where: { userId: user.id },
                }
              : true,
          },
        },
      },
    });

    const caseStudies = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "asc" },
    });

    const testSessions = user
      ? await prisma.testSession.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: {
            metrics: true,
            result: true,
            caseStudy: true,
          },
        })
      : [];

    return NextResponse.json({
      success: true,
      data: {
        user,
        units,
        caseStudies,
        testSessions,
      },
    });
  } catch (error) {
    console.warn("Database query failed or not migrated yet. Returning fallback seed data:", error);
    // Return fallback state so the UI functions seamlessly even before DB migration
    return NextResponse.json({
      success: true,
      isFallback: true,
      data: {
        user: {
          id: "usr_demo",
          nama: "Putri Rahmawati",
          email: "putri@mahasiswa.ac.id",
          tahunLahir: 2006,
          isAdult: true,
          statusPengguna: "Mahasiswa",
          tujuanUtama: ["Presentasi di Kelas & Diskusi"],
          stats: {
            totalXp: 245,
            level: "Menengah",
            currentStreak: 5,
            longestStreak: 7,
            fokusAspek: "CAKUPAN_ISI",
          },
          quotas: [
            {
              sesiHarianMaks: 5,
              sesiHarianPakai: 2,
              kuotaFeedbackDasar: 3,
              kuotaFeedbackPakai: 1,
            },
          ],
          consents: [
            { consentType: "TERMS_PRIVACY", status: "GRANTED" },
            { consentType: "VOICE_RECORDING", status: "GRANTED" },
            { consentType: "THIRD_PARTY_AI", status: "GRANTED" },
          ],
        },
      },
    });
  }
}
