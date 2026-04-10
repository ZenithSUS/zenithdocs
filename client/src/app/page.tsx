"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Components
import CursorGlow from "@/components/CursorGlow";
import NavBar from "@/components/homepage/NavBar";
import Hero from "@/components/homepage/Hero";
import DocumentPreview from "@/components/homepage/DocumentPreview";
import HowItWorks from "@/components/homepage/HowItWorks";
import Features from "@/components/homepage/Features";
import UseCases from "@/components/homepage/UseCases";
import Pricing from "@/components/homepage/Pricing";
import CTA from "@/components/homepage/CTA";
import Footer from "@/components/homepage/Footer";
import MobileMenu from "@/components/homepage/MobileMenu";
import useMousePosition from "@/features/ui/useMousePostion";
import LineBackground from "@/components/homepage/LineBackground";
import LearningSetCreator from "@/components/homepage/LearningSetCreator";
import DocumentChat from "@/components/homepage/DocumentChat";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const mousePos = useMousePosition();

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  return (
    <div className="bg-background text-text font-serif overflow-x-hidden">
      <CursorGlow mousePos={mousePos} />

      {/* Line Background */}
      <LineBackground />

      {/* ─── NavBar ─── */}
      <NavBar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollTo={scrollTo}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        scrollY={scrollY}
      />

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <MobileMenu
          scrollTo={scrollTo}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      )}

      <Hero
        heroRef={heroRef}
        handleRegister={handleRegister}
        scrollTo={scrollTo}
      />
      <HowItWorks />
      <Features />
      <DocumentChat />
      <DocumentPreview />
      <LearningSetCreator />
      <UseCases />
      <Pricing />
      <CTA />

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
