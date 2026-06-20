import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kasion Life | Personal Life-Tracking Dashboard",
  description: "A modern, minimalist personal dashboard to track life metrics, logs, goals, and daily progress. Ready for deployment to kasionlife.com.",
  metadataBase: new URL("https://kasionlife.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kasion Life Dashboard",
    description: "Track your personal life metrics, habit data, and daily journals in one elegant place.",
    url: "https://kasionlife.com",
    siteName: "Kasion Life",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
