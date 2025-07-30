// src/app/page.tsx (or .jsx)
"use client";

import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import FeatureSection from "@/app/components/FeatureSection";
export default function Home() {
  return (
    <>
      <Navbar />
      {/* Your other components or content */}
      <main>
        <Hero />
        <FeatureSection/>
      </main>
    </>
  );
}
