"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Login from "@/app/components/Login";
import { useAppContext } from "@/context/appContext";
import { Toaster } from "react-hot-toast";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showLogin } = useAppContext();
  const isOwnerPath = pathname?.startsWith("/owner");

  return (
    <>
      {!isOwnerPath && <Navbar />}
      {showLogin && <Login />}
      {children}
      {!isOwnerPath && <Footer />}
      <Toaster />
    </>
  );
}
