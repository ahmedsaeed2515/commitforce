import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreHydration } from "@/components/StoreHydration";
import { ToastProvider } from "@/components/ToastProvider";
import Navbar from '@/components/Navbar';
import BadgeNotificationListener from '@/components/BadgeNotificationListener';
import ScrollToTop from '@/components/ui/ScrollToTop';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CommitForce - Put Your Money Where Your Goals Are",
  description: "Professional Challenge Commitment Platform with AI Verification",
  keywords: ["accountability", "goals", "challenges", "habits", "streak"],
  authors: [{ name: "CommitForce Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a1a] text-white`}
        suppressHydrationWarning
      >
        <StoreHydration />
        <ToastProvider />
        <BadgeNotificationListener />
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
        <ScrollToTop />
      </body>
    </html>
  );
}
