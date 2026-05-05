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
  title: "MinimSleep — quiet sleep analysis",
  description:
    "MinimSleep is a minimalist sleep analysis service: take a quick check-in, get a science-grounded sleep score and personal recommendations.",
  applicationName: "MinimSleep",
  authors: [{ name: "MinimSleep" }],
  keywords: ["sleep", "wellness", "tracker", "score", "minimal", "dashboard"],
  openGraph: {
    title: "MinimSleep",
    description: "Quiet, honest sleep analysis.",
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
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh font-sans text-fg antialiased">
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
