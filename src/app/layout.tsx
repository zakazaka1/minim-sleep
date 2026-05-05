import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MinimSleep — тихий анализ сна",
  description:
    "MinimSleep — минималистичный сервис анализа сна: пройди короткий тест и получи научно обоснованную оценку сна и персональные рекомендации.",
  applicationName: "MinimSleep",
  authors: [{ name: "MinimSleep" }],
  keywords: ["сон", "велнесс", "трекер", "оценка сна", "минимализм", "панель"],
  openGraph: {
    title: "MinimSleep",
    description: "Тихий, честный анализ сна.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh font-sans text-fg antialiased">
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
