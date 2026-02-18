import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clutchly - Your Daily Ranked Copilot",
  description:
    "Before you queue, know exactly what to play. 3 picks. 1 ban. Your build. Personalized to YOUR match history.",
  keywords: [
    "League of Legends",
    "LoL",
    "champion select",
    "ranked",
    "climbing",
    "tier list",
    "meta",
  ],
  authors: [{ name: "Clutchly" }],
  openGraph: {
    title: "Clutchly - Your Daily Ranked Copilot",
    description:
      "Before you queue, know exactly what to play. Personalized League of Legends recommendations.",
    url: "https://tryclutchly.com",
    siteName: "Clutchly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clutchly - Your Daily Ranked Copilot",
    description:
      "Before you queue, know exactly what to play. Personalized League of Legends recommendations.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950`}
      >
        {children}
      </body>
    </html>
  );
}
