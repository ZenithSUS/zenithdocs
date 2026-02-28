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

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  return (
    <div className="bg-background text-text font-serif overflow-x-hidden">
      <CursorGlow mousePos={mousePos} />

      {/* ─── NAVBAR ─── */}
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
      <DocumentPreview />
      <HowItWorks />
      <Features />
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
