// src/app/page.tsx (or .jsx)
"use client";

import Navbar from "./components/Navbar/page";
import Hero from "./components/Hero/page";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Your other components or content */}
      <main>
        <Hero />
      </main>
    </>
  );
}
