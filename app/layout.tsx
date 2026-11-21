import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TAMPIL — AI Communication Coach (Web Edition v2.0)",
  description: "Platform latihan komunikasi mahasiswa berbasis AI dengan Next.js, Tailwind CSS, PostgreSQL, dan Prisma ORM.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
