// src/app/page.tsx (or .jsx)
"use client";

import Hero from "@/app/components/Hero";

import FeatureSection from "@/app/components/FeatureSection";
import Banner from "@/app/components/Banner";
import Footer from "@/app/components/Footer";
export default function Home() {
  return (
    <>
     
      {/* Your other components or content */}
      <main>
        <Hero />
        <FeatureSection/>
        <Banner/>
        <Footer/>
      </main>
    </>
  );
}
