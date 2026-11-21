import { PrismaClient, AspectCI, ContentStatus, MaterialType, SessionType, SessionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database PostgreSQL...");

  // 1. Bersihkan data lama jika ada
  await prisma.feedbackRating.deleteMany({});
  await prisma.feedbackAccess.deleteMany({});
  await prisma.analysisResult.deleteMany({});
  await prisma.speechMetrics.deleteMany({});
  await prisma.testSession.deleteMany({});
  await prisma.userDailyChallenge.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.learningMaterial.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.caseStudy.deleteMany({});
  await prisma.userStats.deleteMany({});
  await prisma.userQuota.deleteMany({});
  await prisma.selfConfidenceLog.deleteMany({});
  await prisma.consent.deleteMany({});
  await prisma.xPLog.deleteMany({});
  await prisma.streakLog.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // 2. Buat Admin User
  const admin = await prisma.adminUser.create({
    data: {
      nama: "Administrator TAMPIL",
      email: "admin@tampil.id",
      passwordHash: "$2b$10$demoHashedPasswordAdminTampil2026",
      role: "admin",
      status: "active",
    },
  });
  console.log("✅ Admin user dibuat:", admin.email);

  // 3. Buat Demo Mahasiswa User (Putri Rahmawati - PRD Section 6 & 19.3)
  const student = await prisma.user.create({
    data: {
      nama: "Putri Rahmawati",
      email: "putri@mahasiswa.ac.id",
      tahunLahir: 2006,
      isAdult: true,
      statusPengguna: "Mahasiswa",
      tujuanUtama: ["Presentasi di Kelas & Diskusi", "Percakapan Santai Sehari-hari"],
      consents: {
        create: [
          { consentType: "TERMS_PRIVACY", docVersion: "v1.4", status: "GRANTED" },
          { consentType: "VOICE_RECORDING", docVersion: "v1.4", status: "GRANTED" },
          { consentType: "THIRD_PARTY_AI", docVersion: "v1.4", status: "GRANTED" },
        ],
      },
      stats: {
        create: {
          totalXp: 245,
          level: "Menengah",
          currentStreak: 5,
          longestStreak: 7,
          lastActivityDate: "2026-10-30",
          fokusAspek: AspectCI.CAKUPAN_ISI,
        },
      },
      quotas: {
        create: {
          periode: "2026-10-30",
          sesiHarianMaks: 5,
          sesiHarianPakai: 2,
          kuotaFeedbackDasar: 3,
          kuotaFeedbackPakai: 1,
        },
      },
      confidenceLogs: {
        create: [
          { nilai: 2, konteks: "onboarding" },
          { nilai: 4, konteks: "berkala" },
        ],
      },
    },
  });
  console.log("✅ Demo user dibuat:", student.nama);

  // 4. Buat 3 Units Pembelajaran (PRD Bagian 8.1 & 11)
  const unit1 = await prisma.unit.create({
    data: {
      id: "u1",
      nama: "Unit 1: Daily Communication",
      konteks: "Daily Communication",
      urutan: 1,
      status: ContentStatus.PUBLISHED,
      createdById: admin.id,
    },
  });

  const unit2 = await prisma.unit.create({
    data: {
      id: "u2",
      nama: "Unit 2: Peer Communication",
      konteks: "Peer Communication",
      urutan: 2,
      status: ContentStatus.PUBLISHED,
      createdById: admin.id,
    },
  });

  const unit3 = await prisma.unit.create({
    data: {
      id: "u3",
      nama: "Unit 3: Public Speaking",
      konteks: "Public Speaking",
      urutan: 3,
      status: ContentStatus.PUBLISHED,
      createdById: admin.id,
    },
  });

  // 5. Data 15 Lessons (5 per Unit)
  const lessonsData = [
    // Unit 1
    {
      id: "u1-l1",
      unitId: unit1.id,
      urutan: 1,
      judul: "Mengatur Jeda Napas Saat Bicara Santai",
      targetAspek: AspectCI.KELANCARAN_JEDA,
      status: ContentStatus.PUBLISHED,
      artikel: "Jeda 0,3 hingga 1 detik adalah jeda alami yang membantu pendengar mencerna kalimatmu. Hindari terburu-buru menyambung kalimat tanpa bernapas.",
      quiz: {
        question: "Berapa durasi jeda wajar yang efektif dalam percakapan santai?",
        options: ["0,3 - 1,0 detik", "3 - 5 detik", "Tidak boleh ada jeda sama sekali", "Di atas 7 detik"],
        correctIndex: 0,
        explanation: "Jeda 0,3 - 1,0 detik memberikan ritme artikulasi alami tanpa membuat keheningan terasa canggung.",
      },
    },
    {
      id: "u1-l2",
      unitId: unit1.id,
      urutan: 2,
      judul: "Mengurangi Filler Words (Eee, Anu, Hmm)",
      targetAspek: AspectCI.KEBERSIHAN_UCAPAN,
      status: ContentStatus.PUBLISHED,
      artikel: "Filler words seperti 'eee', 'anu', atau 'apa ya' muncul ketika mulut berbicara lebih cepat daripada pikiran. Ganti kebiasaan mengucapkan 'eee' dengan diam sejenak 0,5 detik.",
      quiz: {
        question: "Apa strategi terbaik saat pikiran belum menemukan kata yang tepat?",
        options: ["Mengucapkan 'eee' panjang", "Diam sejenak (silent pause) 0,5 detik", "Bicara lebih cepat", "Meminta maaf berulang kali"],
        correctIndex: 1,
        explanation: "Silent pause jauh lebih profesional dan terdengar berbobot dibanding mengisi jeda dengan filler words.",
      },
    },
    {
      id: "u1-l3",
      unitId: unit1.id,
      urutan: 3,
      judul: "Menjaga Tempo Bicara 120–160 WPM",
      targetAspek: AspectCI.TEMPO,
      status: ContentStatus.PUBLISHED,
      artikel: "Tempo ideal Bahasa Indonesia berada di kisaran 120 hingga 160 kata per menit (WPM). Terlalu cepat (>180 WPM) membuat artikulasi kabur.",
      quiz: {
        question: "Berapa rentang Words Per Minute (WPM) optimal untuk komunikasi bahasa Indonesia?",
        options: ["80 - 100 WPM", "120 - 160 WPM", "200 - 240 WPM", "50 - 70 WPM"],
        correctIndex: 1,
        explanation: "Rentang 120 - 160 WPM memungkinkan pendengar mencerna informasi dengan nyaman.",
      },
    },
    {
      id: "u1-l4",
      unitId: unit1.id,
      urutan: 4,
      judul: "Menyampaikan Poin Inti Penolakan Sopan",
      targetAspek: AspectCI.CAKUPAN_ISI,
      status: ContentStatus.PUBLISHED,
      artikel: "Saat menolak ajakan teman, pastikan 4 poin kunci terpenuhi: apresiasi ajakan, alasan jelas, kalimat penolakan tegas namun sopan, dan tawaran waktu alternatif.",
      quiz: {
        question: "Urutan penolakan asertif yang sopan adalah...",
        options: ["Apresiasi -> Alasan -> Penolakan Sopan -> Opsi Waktu Lain", "Langsung menolak tanpa alasan", "Menerima lalu membatalkan mendadak", "Menyalahkan orang lain"],
        correctIndex: 0,
        explanation: "Urutan asertif menjaga hubungan pertemanan tetap hangat sekaligus menetapkan batasan jadwal pribadi.",
      },
    },
    {
      id: "u1-l5",
      unitId: unit1.id,
      urutan: 5,
      judul: "Struktur Pembuka & Penutup Percakapan",
      targetAspek: AspectCI.STRUKTUR,
      status: ContentStatus.PUBLISHED,
      artikel: "Gunakan kata pembuka seperti 'Menurut saya' atau 'Jadi begini', kata penghubung 'karena/selanjutnya', serta penutup 'Intinya/Terima kasih'.",
      quiz: {
        question: "Struktur percakapan yang lengkap mencakup...",
        options: ["Pembuka, Penghubung/Isi, dan Penutup", "Hanya kesimpulan", "Tanpa pembuka langsung ke penutup", "Bebas tanpa alur"],
        correctIndex: 0,
        explanation: "Struktur tripartit memastikan audiens memahami awal, inti, dan akhir pesan.",
      },
    },
    // Unit 2
    {
      id: "u2-l1",
      unitId: unit2.id,
      urutan: 1,
      judul: "Jeda Strategis dalam Diskusi Kelompok",
      targetAspek: AspectCI.KELANCARAN_JEDA,
      status: ContentStatus.PUBLISHED,
      artikel: "Dalam diskusi kelompok, jeda sejenak sebelum menanggapi teman menunjukkan bahwa kamu mendengarkan dengan saksama dan mempertimbangkan masukannya.",
      quiz: {
        question: "Manfaat jeda 1 detik sebelum merespons pendapat rekan diskusi adalah...",
        options: ["Memberi kesan menyimak dan menurunkan tensi debat", "Membuat rekan bingung", "Membuang-buang waktu rapat", "Menunjukkan ketidakpahaman"],
        correctIndex: 0,
        explanation: "Jeda sebelum merespons menunjukkan rasa hormat dan pemikiran yang matang.",
      },
    },
    {
      id: "u2-l2",
      unitId: unit2.id,
      urutan: 2,
      judul: "Menyampaikan Ketidaksetujuan Tanpa Konflik",
      targetAspek: AspectCI.CAKUPAN_ISI,
      status: ContentStatus.PUBLISHED,
      artikel: "Gunakan teknik Sandwich: (1) Validasi niat baik rekan, (2) Kemukakan kendala data/anggaran/waktu secara objektif, (3) Berikan opsi solusi alternatif.",
      quiz: {
        question: "Inti dari metode Sandwich dalam rapat adalah...",
        options: ["Validasi ide -> Sampaikan data kendala -> Tawarkan solusi alternatif", "Kritik langsung tanpa ampun", "Setuju di rapat tapi tidak dikerjakan", "Diam saja tidak bersuara"],
        correctIndex: 0,
        explanation: "Sandwich feedback memfokuskan kritik pada masalah/data, bukan pada pribadi orang yang berbicara.",
      },
    },
    {
      id: "u2-l3",
      unitId: unit2.id,
      urutan: 3,
      judul: "Artikulasi Bersih Tanpa Gumaman di Rapat",
      targetAspek: AspectCI.KEBERSIHAN_UCAPAN,
      status: ContentStatus.PUBLISHED,
      artikel: "Saat gugup di rapat organisasi, catat 3 kata kunci di kertas kecil agar tidak kehilangan alur dan menggumam.",
      quiz: {
        question: "Cara efektif mengatasi gumaman saat giliran berbicara di rapat...",
        options: ["Siapkan catatan 3 poin kunci & proyeksikan vokal", "Tundukkan kepala", "Bicara dengan suara bisik", "Menyerahkan giliran ke orang lain"],
        correctIndex: 0,
        explanation: "Catatan poin kunci memandu alur pikiran agar artikulasi tetap tegas.",
      },
    },
    {
      id: "u2-l4",
      unitId: unit2.id,
      urutan: 4,
      judul: "Mengatur Ritme Saat Menjelaskan Data",
      targetAspek: AspectCI.TEMPO,
      status: ContentStatus.PUBLISHED,
      artikel: "Perlambat tempo bicaramu saat menyebutkan angka penting, persentase, atau kesimpulan utama dalam rapat tim.",
      quiz: {
        question: "Saat menyebut angka atau persentase statistik, apa yang harus dilakukan?",
        options: ["Perlambat tempo dan berikan penekanan", "Ucapkan secepat mungkin", "Lewati angkanya", "Bisikkan angkanya"],
        correctIndex: 0,
        explanation: "Data numerik memerlukan waktu olah kognitif lebih tinggi bagi pendengar.",
      },
    },
    {
      id: "u2-l5",
      unitId: unit2.id,
      urutan: 5,
      judul: "Merangkai Argumen Sebab-Akibat yang Runtut",
      targetAspek: AspectCI.STRUKTUR,
      status: ContentStatus.PUBLISHED,
      artikel: "Gunakan kerangka PREP: Point (Poin utama), Reason (Alasan), Example (Contoh/Bukti), Point (Penegasan ulang).",
      quiz: {
        question: "Kepanjangan dari metode PREP adalah...",
        options: ["Point, Reason, Example, Point", "Plan, Review, Execute, Process", "Preparation, Reading, Evaluation, Practice", "People, Role, Event, Post"],
        correctIndex: 0,
        explanation: "PREP adalah formula argumen terstruktur paling teruji untuk diskusi profesional.",
      },
    },
    // Unit 3
    {
      id: "u3-l1",
      unitId: unit3.id,
      urutan: 1,
      judul: "Mengatasi Blank & Jeda Panjang Saat Presentasi",
      targetAspek: AspectCI.KELANCARAN_JEDA,
      status: ContentStatus.PUBLISHED,
      artikel: "Jika tiba-tiba lupa materi saat presentasi kelas, ulangi poin terakhir secara singkat sambil melihat transisi slide untuk me-reset fokus.",
      quiz: {
        question: "Langkah penyelamatan saat mendadak 'blank' di depan audiens:",
        options: ["Ulangi poin terakhir secara tenang sambil bernapas dalam", "Panik dan lari keluar ruangan", "Mematikan proyektor", "Menyalahkan rekan satu kelompok"],
        correctIndex: 0,
        explanation: "Mengulang poin terakhir memberikan jeda mikroskopik untuk otak menyambung kembali asosiasi materi.",
      },
    },
    {
      id: "u3-l2",
      unitId: unit3.id,
      urutan: 2,
      judul: "Eliminasi Filler Saat Menjawab Dosen Penguji",
      targetAspek: AspectCI.KEBERSIHAN_UCAPAN,
      status: ContentStatus.PUBLISHED,
      artikel: "Ucapkan 'Terima kasih atas pertanyaannya, Pak/Bu' untuk memberi waktu 2 detik bagi otak menyusun struktur jawaban tanpa menggunakan 'eee...'.",
      quiz: {
        question: "Frasa penyangga yang efektif sebelum menjawab penguji sidang...",
        options: ["'Terima kasih atas pertanyaannya'", "'Eee anu apa ya pak'", "'Aduh saya lupa'", "'Pertanyaannya susah sekali'"],
        correctIndex: 0,
        explanation: "Frasa apresiasi bertindak sebagai penyangga sopan pengganti jeda hening/filler.",
      },
    },
    {
      id: "u3-l3",
      unitId: unit3.id,
      urutan: 3,
      judul: "Kontrol Tempo Public Speaking di Ruang Kelas",
      targetAspek: AspectCI.TEMPO,
      status: ContentStatus.PUBLISHED,
      artikel: "Adrenalin membuat kita bicara 30% lebih cepat saat di depan kelas. Sadari napas dan jaga di 130–150 WPM.",
      quiz: {
        question: "Pengaruh adrenalin pada tempo berbicara di atas panggung adalah...",
        options: ["Cenderung mempercepat ucapan tanpa disadari", "Membuat ucapan sangat lambat", "Tidak ada pengaruh sama sekali", "Membuat suara menjadi sengau"],
        correctIndex: 0,
        explanation: "Hormon stres memicu dorongan mempercepat ucapan; penting untuk mengatur napas diafragma.",
      },
    },
    {
      id: "u3-l4",
      unitId: unit3.id,
      urutan: 4,
      judul: "Menjawab Seluruh Poin Pertanyaan Audiens",
      targetAspek: AspectCI.CAKUPAN_ISI,
      status: ContentStatus.PUBLISHED,
      artikel: "Pastikan setiap elemen pertanyaan audiens terjawab dengan memecahnya menjadi poin-poin terpisah sebelum menjawab.",
      quiz: {
        question: "Bagaimana cara memastikan semua poin pertanyaan terselesaikan?",
        options: ["Catat kata kunci penanya lalu jawab satu per satu", "Jawab yang mudah saja dan abaikan sisanya", "Bicara panjang lebar tanpa menjawab inti", "Balik bertanya secara agresif"],
        correctIndex: 0,
        explanation: "Mencatat kata kunci memastikan tidak ada sub-pertanyaan yang terlewat.",
      },
    },
    {
      id: "u3-l5",
      unitId: unit3.id,
      urutan: 5,
      judul: "Opening Hook & Call-to-Action Penutup Presentasi",
      targetAspek: AspectCI.STRUKTUR,
      status: ContentStatus.PUBLISHED,
      artikel: "Buka presentasi dengan fakta mengejutkan atau cerita relevan (Hook), dan tutup dengan kesimpulan serta ajakan bertindak (CTA).",
      quiz: {
        question: "Kombinasi pembuka dan penutup presentasi yang paling memikat adalah...",
        options: ["Hook fakta menarik di awal + Call to Action di akhir", "Langsung membaca slide teks penuh tanpa sapaan", "Mengeluh capek di awal dan mengucap sekian di akhir", "Tidak ada penutup"],
        correctIndex: 0,
        explanation: "Hook membangkitkan rasa ingin tahu, sedangkan CTA memberikan dampak yang membekas.",
      },
    },
  ];

  for (const l of lessonsData) {
    const lesson = await prisma.lesson.create({
      data: {
        id: l.id,
        unitId: l.unitId,
        urutan: l.urutan,
        judul: l.judul,
        targetAspek: l.targetAspek,
        status: l.status,
        createdById: admin.id,
        materials: {
          create: [
            {
              judul: `Video Pembelajaran: ${l.judul}`,
              deskripsi: "Video panduan interaktif dengan demonstrasi teknik berbicara langsung (durasi ≤ 3 menit).",
              tipe: MaterialType.VIDEO,
              isRequired: true,
              xpReward: 10,
              contentUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              status: ContentStatus.PUBLISHED,
            },
            {
              judul: `Ringkasan Materi: ${l.judul}`,
              deskripsi: "Bacaan ringkas pendalaman materi dan tips praktis komunikasi.",
              tipe: MaterialType.ARTIKEL,
              isRequired: false,
              xpReward: 5,
              isiArtikel: l.artikel,
              status: ContentStatus.PUBLISHED,
            },
            {
              judul: `Kuis Pemahaman: ${l.judul}`,
              deskripsi: "Uji pemahamanmu dengan kuis interaktif (syarat lulus minimal 60%).",
              tipe: MaterialType.KUIS,
              isRequired: true,
              xpReward: 15,
              status: ContentStatus.PUBLISHED,
              quizQuestions: {
                create: [
                  {
                    pertanyaan: l.quiz.question,
                    opsi: l.quiz.options,
                    jawabanBenar: l.quiz.correctIndex,
                    penjelasan: l.quiz.explanation,
                    status: ContentStatus.PUBLISHED,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Buat initial progress untuk user demo
    const isCompleted = l.id === "u1-l1" || l.id === "u1-l2" || l.id === "u2-l1";
    await prisma.userProgress.create({
      data: {
        userId: student.id,
        lessonId: lesson.id,
        status: isCompleted ? "completed" : "unlocked",
        videoWatched: isCompleted,
        articleRead: isCompleted,
        scoreKuis: isCompleted ? 100 : null,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }
  console.log("✅ 15 Lessons & Materi berhasil dibuat.");

  // 6. Buat 4 Kasus Studi Communication Test (PRD Bagian 10.5 & ADM-8)
  const caseStudiesData = [
    {
      id: "case-1",
      judul: "Menolak Ajakan Teman karena Bentrok Jadwal Kuliah",
      konteks: "Daily Communication",
      kategori: "Percakapan Teman",
      difficulty: "Mudah",
      durasiMaks: 90,
      status: ContentStatus.PUBLISHED,
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
      judul: "Meminta Maaf Terlambat Hadir Kerja Kelompok (Kasus Retest Setara)",
      konteks: "Daily Communication",
      kategori: "Percakapan Teman",
      difficulty: "Mudah",
      durasiMaks: 90,
      status: ContentStatus.PUBLISHED,
      promptBrief: "Kamu terlambat 20 menit datang ke pertemuan kerja kelompok karena kendala transportasi. Sampaikan permintaan maaf yang tulus, jelaskan alasan singkat tanpa mencari-cari alasan berlebihan, dan tawarkan kontribusi pengganti.",
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
      status: ContentStatus.PUBLISHED,
      promptBrief: "Dalam rapat kepanitiaan kampus, ketua divisi mengusulkan konsep acara outdoor yang berisiko terkendala cuaca hujan dan melebihi anggaran. Sampaikan pendapatmu secara objektif dan tawarkan opsi cadangan.",
      keyPoints: [
        { label: "Mengapresiasi ide awal rekan", triggers: ["ide bagus", "menarik", "apresiasi", "setuju konsepnya", "terima kasih usulannya"] },
        { label: "Menyebutkan risiko anggaran atau cuaca", triggers: ["anggaran", "budget", "cuaca", "hujan", "risiko", "biaya"] },
        { label: "Mengusulkan alternatif tempat/solusi", triggers: ["alternatif", "semi indoor", "aula", "opsi cadangan", "plan b", "usulan"] },
      ],
    },
    {
      id: "case-4",
      judul: "Presentasi Singkat Usulan Topik Tugas Akhir di Kelas",
      konteks: "Public Speaking",
      kategori: "Presentasi Kelas",
      difficulty: "Sulit",
      durasiMaks: 120,
      status: ContentStatus.PUBLISHED,
      promptBrief: "Presentasikan usulan topik penelitian atau proyek kelompokmu di depan dosen dan teman sekelas dalam waktu 60–90 detik. Jelaskan latar belakang masalah, solusi yang ditawarkan, dan manfaat utamanya.",
      keyPoints: [
        { label: "Membuka presentasi & menyebut topik", triggers: ["selamat pagi", "perkenalkan", "pertama-tama", "topik", "proyek kami"] },
        { label: "Menjelaskan latar belakang masalah", triggers: ["masalah", "latar belakang", "kendala", "fenomena", "kesulitan"] },
        { label: "Menjelaskan solusi atau metode", triggers: ["solusi", "metode", "aplikasi", "pendekatan", "dirancang untuk"] },
        { label: "Menutup dengan manfaat & kesimpulan", triggers: ["manfaat", "kesimpulannya", "intinya", "harapannya", "terima kasih"] },
      ],
    },
  ];

  for (const cs of caseStudiesData) {
    await prisma.caseStudy.create({
      data: {
        id: cs.id,
        judul: cs.judul,
        konteks: cs.konteks,
        kategori: cs.kategori,
        difficulty: cs.difficulty,
        durasiMaks: cs.durasiMaks,
        status: cs.status,
        promptBrief: cs.promptBrief,
        keyPoints: cs.keyPoints,
        createdById: admin.id,
      },
    });
  }
  console.log("✅ 4 Case Studies berhasil dibuat.");

  // 7. Buat Riwayat Sesi Test & Hasil Analisis Demo (Test Awal & Retest)
  const initialSession = await prisma.testSession.create({
    data: {
      id: "ses_101",
      userId: student.id,
      caseId: "case-1",
      tipe: SessionType.TEST,
      attemptNo: 1,
      audioDuration: 52.4,
      audioExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      transcript: "Halo selamat siang teman-teman. Maaf banget ya, aku terima kasih sudah diajak ikut kegiatan kepanitiaan luar kampus sore ini. Tapi kebetulan sekali ada jadwal kelas pengganti kuliah dari dosen jam 4 sore sampai jam 6. Jadi aku tidak bisa ikut hadir kali ini. Semoga acaranya lancar ya, mungkin lain kali aku bisa ikut gabung.",
      status: SessionStatus.COMPLETED,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 hari lalu
      metrics: {
        create: {
          durasiBicara: 52.4,
          jumlahKata: 74,
          wpm: 84.7,
          jumlahFiller: 5,
          fillerPerMenit: 5.7,
          jumlahJedaPanjang: 4,
          totalDurasiJeda: 8.2,
          rasioJeda: 0.156,
          pauseThresholdUsed: 1.5,
          cakupanKeyPoints: [
            { label: "Menghargai ajakan teman", captured: true },
            { label: "Menyebut alasan bentrok jadwal", captured: true },
            { label: "Menolak dengan jelas dan sopan", captured: true },
            { label: "Menawarkan alternatif waktu lain", captured: true },
          ],
          skorStruktur: 80,
        },
      },
      result: {
        create: {
          id: "res_101",
          skorJeda: 58,
          skorFiller: 65,
          skorTempo: 62,
          skorCakupan: 100,
          skorStruktur: 80,
          communicationIndex: 68.2,
          kategori: "Berkembang",
          aiFeedback: {
            strengths: [
              "Cakupan isi sangat lengkap, seluruh 4 poin penolakan asertif tersampaikan dengan jelas.",
              "Sikap empati dan nada penolakan sangat sopan sehingga tidak menyinggung perasaan rekan.",
            ],
            weaknesses: [
              "Tempo berbicara agak lambat (84.7 WPM), idealnya ditingkatkan ke 120-140 WPM.",
              "Terdapat 4 jeda panjang di atas 1,5 detik yang membuat kalimat terasa terputus.",
            ],
            recommendations: [
              "Latih modul Unit 1 Lesson 3 untuk membiasakan ritme bicara 120-160 WPM.",
              "Bernapaslah teratur di setiap tanda koma dan titik agar jeda lebih terdistribusi merata.",
            ],
          },
        },
      },
    },
  });

  // Retest Session
  const retestSession = await prisma.testSession.create({
    data: {
      id: "ses_102",
      userId: student.id,
      caseId: "case-2",
      tipe: SessionType.RETEST,
      parentSessionId: initialSession.id,
      attemptNo: 2,
      audioDuration: 44.8,
      audioExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      transcript: "Halo teman-teman, mohon maaf sekali aku terlambat 20 menit hadir di kerja kelompok kita hari ini. Tadi di jalan ada kendala macet parah dan angkutan umum sempat mogok. Terima kasih banyak kalian sudah berkenan menunggu. Untuk mengganti waktu keterlambatanku, bagian analisis data dan pembuatan slide presentasi siap aku yang kerjakan penuh malam ini.",
      status: SessionStatus.COMPLETED,
      createdAt: new Date(),
      metrics: {
        create: {
          durasiBicara: 44.8,
          jumlahKata: 71,
          wpm: 128.5,
          jumlahFiller: 2,
          fillerPerMenit: 2.7,
          jumlahJedaPanjang: 1,
          totalDurasiJeda: 3.4,
          rasioJeda: 0.076,
          pauseThresholdUsed: 1.5,
          cakupanKeyPoints: [
            { label: "Meminta maaf secara langsung", captured: true },
            { label: "Menjelaskan kendala secara singkat", captured: true },
            { label: "Menghargai waktu teman yang menunggu", captured: true },
            { label: "Menawarkan kontribusi/solusi tugas", captured: true },
          ],
          skorStruktur: 90,
        },
      },
      result: {
        create: {
          id: "res_102",
          skorJeda: 85,
          skorFiller: 88,
          skorTempo: 92,
          skorCakupan: 100,
          skorStruktur: 90,
          communicationIndex: 90.4,
          kategori: "Sangat Baik",
          aiFeedback: {
            strengths: [
              "Peningkatan tempo luar biasa dari 84.7 WPM menjadi 128.5 WPM (kategori optimal).",
              "Pengurangan filler words drastis dan jeda panjang berhasil ditekan dari 4 kali menjadi 1 kali.",
              "Tawaran solusi konkret mencerminkan profesionalisme tinggi dalam kerja tim.",
            ],
            weaknesses: [
              "Hampir sempurna! Jaga konsistensi intonasi pada kalimat penutup agar terdengar semakin mantap.",
            ],
            recommendations: [
              "Lanjutkan ke Unit 3: Public Speaking untuk memperluas kemampuan berbicara di depan forum yang lebih besar.",
            ],
          },
        },
      },
    },
  });

  // Catat FeedbackAccess
  await prisma.feedbackAccess.create({
    data: {
      userId: student.id,
      resultId: "res_101",
      status: "success",
      quotaCharged: true,
    },
  });

  await prisma.feedbackAccess.create({
    data: {
      userId: student.id,
      resultId: "res_102",
      status: "success",
      quotaCharged: true,
    },
  });

  console.log("✅ Data Sesi Test & Retest berhasil dibuat.");
  console.log("🎉 Seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
