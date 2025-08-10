// src/app/page.tsx (or .jsx)
"use client";

import Hero from "@/app/components/Hero";
import FeatureSection from "@/app/components/FeatureSection";
import Banner from "@/app/components/Banner";
import Testimonail from "@/app/components/Testimonial";
import NewsLetter from "@/app/components/NewsLetter";
export default function Home() {
  return (
    <>
    
      <main>
        <Hero />
        <FeatureSection />
        <Banner />
        <Testimonail />
        <NewsLetter />
      </main>
    </>
  );
}
