import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BatchMind | Academic OS",
  description: "The ultimate academic OS to manage notes, summaries, and attendance.",
};

import { CampusProvider } from "@/components/CampusContext";
import { AuthProvider } from "@/components/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <AuthProvider>
          <CampusProvider>
            <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
              <Sidebar />
              <div style={{ flex: 1, marginLeft: '260px', width: 'calc(100% - 260px)', display: 'flex', flexDirection: 'column' }}>
                {children}
              </div>
            </div>
          </CampusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
