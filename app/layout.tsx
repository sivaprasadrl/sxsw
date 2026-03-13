import type { Metadata } from "next";
import { Lexend_Mega, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const lexendMega = Lexend_Mega({
  variable: "--font-lexend-mega",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sxswtechevents.com"),
  title: "SXSW 2026 Sessions Explorer",
  description:
    "4,000+ SXSW sessions are hard to navigate. Filter by date, time & category, search across all sessions, bookmark your picks, and view venues on a map. A free community tool for SXSW 2026 attendees.",
  keywords: [
    "SXSW 2026",
    "SXSW sessions",
    "SXSW schedule",
    "SXSW planner",
    "SXSW Austin",
    "SXSW events",
    "AI",
    "Design",
    "Tech",
    "Marketing",
  ],
  authors: [{ name: "sw3ll", url: "https://sw3ll.ai" }],
  creator: "sw3ll",
  openGraph: {
    type: "website",
    title: "SXSW 2026 Sessions Explorer",
    description:
      "4,000+ sessions are hard to navigate. We made it easier — filter, search, bookmark, and map your SXSW.",
    siteName: "SXSW 2026 Sessions Explorer",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SXSW 2026 Sessions Explorer",
    description:
      "4,000+ sessions are hard to navigate. We made it easier — filter, search, bookmark, and map your SXSW.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexendMega.variable} ${publicSans.variable} antialiased bg-nb-bg text-nb-black`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
