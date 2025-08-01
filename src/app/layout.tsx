"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Login from "@/app/components/Login";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Inner content so we can access context after AppProvider
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { showLogin } = useAppContext();

  const isOwnerPath = pathname?.startsWith("/owner");

  return (
    <>
      {!isOwnerPath && <Navbar />}
      {showLogin && <Login />}
      {children}
      {!isOwnerPath && <Footer />}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}
