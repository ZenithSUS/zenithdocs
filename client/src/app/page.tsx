"use client";

import CursorGlow from "@/components/CursorGlow";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  const features = [
    {
      icon: "◈",
      title: "Multi-Mode Summaries",
      desc: "Technical, executive, or casual — get the right summary for your audience instantly.",
      tag: "AI-Powered",
    },
    {
      icon: "◉",
      title: "Smart Insight Extraction",
      desc: "Surface key arguments, action items, risks, and important entities automatically.",
      tag: "NLP Engine",
    },
    {
      icon: "◎",
      title: "Document Memory",
      desc: "Chat directly with your documents. Ask questions, get precise answers.",
      tag: "RAG System",
    },
    {
      icon: "⬡",
      title: "Document Comparison",
      desc: "Compare multiple documents side by side and highlight meaningful differences.",
      tag: "Pro Feature",
    },
    {
      icon: "◆",
      title: "Usage Analytics",
      desc: "Track token consumption, summary count, and document complexity metrics.",
      tag: "Dashboard",
    },
    {
      icon: "▣",
      title: "Secure Auth & Storage",
      desc: "JWT authentication, refresh token rotation, and role-based access control.",
      tag: "Enterprise",
    },
  ];

  const personas = [
    {
      role: "Legal Professionals",
      icon: "⚖",
      color: "gold",
      items: [
        "Review contracts in seconds",
        "Extract key clauses automatically",
        "Flag legal risks instantly",
      ],
    },
    {
      role: "Students & Researchers",
      icon: "◎",
      color: "blue",
      items: [
        "Summarize research papers",
        "Break down complex textbooks",
        "Extract exam-relevant points",
      ],
    },
    {
      role: "Founders & Teams",
      icon: "⬡",
      color: "gold",
      items: [
        "Review pitch decks fast",
        "Summarize meeting transcripts",
        "Parse product documentation",
      ],
    },
  ];

  const steps = [
    { num: "01", title: "Upload", desc: "Drop in any PDF, DOCX, or TXT file" },
    {
      num: "02",
      title: "Analyze",
      desc: "AI processes and structures your content",
    },
    {
      num: "03",
      title: "Extract",
      desc: "Get summaries, insights, and key data",
    },
    {
      num: "04",
      title: "Act",
      desc: "Use structured knowledge to make decisions",
    },
  ];

  return (
    <div className="bg-background text-text font-serif overflow-x-hidden">
      {/* Ambient cursor glow */}
      <CursorGlow mousePos={mousePos} />

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-4 md:py-5 flex items-center justify-between transition-all duration-400 ${
          scrollY > 40
            ? "bg-background/92 backdrop-blur-xl border-b border-primary/12"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[22px] text-primary tracking-[-0.5px]">◈</span>
          <span className="text-[18px] font-bold tracking-[0.08em] text-text font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex gap-9 text-[13px] tracking-widest text-text/55 font-sans">
          {["Features", "Use Cases", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="no-underline transition-colors duration-200 hover:text-primary"
            >
              {item.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-3">
          <button
            type="button"
            className="px-4 md:px-5 py-2 bg-transparent border border-primary/40 text-primary rounded-sm cursor-pointer text-[11px] md:text-[12px] tracking-widest font-sans transition-all duration-200 hover:bg-primary/10"
            onClick={handleLogin}
          >
            SIGN IN
          </button>
          <button
            type="button"
            className="px-4 md:px-5 py-2 bg-primary border-none text-background rounded-sm cursor-pointer text-[11px] md:text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530]"
            onClick={handleRegister}
          >
            GET STARTED
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-text/70 transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text/70 transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text/70 transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-14.25 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-primary/12 px-5 py-6 flex flex-col gap-4 sm:hidden">
          {["Features", "Use Cases", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[13px] tracking-widest text-text/55 font-sans no-underline transition-colors duration-200 hover:text-primary py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.toUpperCase()}
            </a>
          ))}
          <div className="flex gap-3 mt-2 pt-4 border-t border-white/8">
            <button
              type="button"
              className="flex-1 py-2.5 bg-transparent border border-primary/40 text-primary rounded-sm cursor-pointer text-[12px] tracking-widest font-sans transition-all duration-200 hover:bg-primary/10"
              onClick={handleLogin}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530]"
              onClick={handleRegister}
            >
              GET STARTED
            </button>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-16 md:pb-20 relative text-center"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        {/* Glow orb */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 md:w-125 h-64 sm:h-96 md:h-125 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-1 w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 border border-primary/30 rounded-full text-[10px] sm:text-[11px] tracking-[0.15em] text-primary mb-8 md:mb-10 font-sans bg-primary/6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="hidden sm:inline">
              AI DOCUMENT INTELLIGENCE PLATFORM
            </span>
            <span className="sm:hidden">AI DOCUMENT PLATFORM</span>
          </div>

          <h1 className="text-[clamp(40px,8vw,96px)] font-normal leading-[1.05] tracking-[-0.03em] mb-5 md:mb-6 font-serif">
            Your AI Brain
            <br />
            <span className="text-primary italic">for Documents.</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] md:text-[18px] text-text/55 max-w-xs sm:max-w-sm md:max-w-130 mx-auto mb-10 md:mb-12 leading-[1.7] font-sans font-light tracking-[0.01em]">
            Stop wasting hours reading. ZenithDocs transforms any document into
            smart summaries, actionable insights, and structured knowledge —
            instantly.
          </p>

          <div className="flex gap-3 sm:gap-4 justify-center items-center flex-wrap">
            <button
              onClick={handleRegister}
              className="px-7 sm:px-9 py-3.5 sm:py-4 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] sm:text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
            >
              START FOR FREE →
            </button>
            <button className="px-7 sm:px-9 py-3.5 sm:py-4 bg-transparent border border-text/15 text-text rounded-sm cursor-pointer text-[12px] sm:text-[13px] tracking-[0.12em] font-sans transition-all duration-200 hover:border-text/40">
              WATCH DEMO ▶
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row gap-0 justify-center mt-16 md:mt-20 border-t border-text/8 pt-8 md:pt-10">
            {[
              { val: "10×", label: "Faster than manual reading" },
              { val: "99%", label: "Accuracy on structured docs" },
              { val: "5 sec", label: "Average processing time" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`px-8 sm:px-10 md:px-12 py-4 sm:py-0 text-center ${
                  i < 2
                    ? "sm:border-r border-b sm:border-b-0 border-text/8"
                    : ""
                }`}
              >
                <div className="text-[28px] sm:text-[32px] md:text-[36px] font-light text-primary tracking-[-0.02em] font-serif">
                  {stat.val}
                </div>
                <div className="text-[11px] md:text-[12px] text-text/40 tracking-[0.08em] font-sans mt-1">
                  {stat.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCUMENT PREVIEW / VISUAL ─── */}
      <section className="px-5 sm:px-8 md:px-12 pb-20 md:pb-30 pt-10 flex justify-center">
        <div className="w-full max-w-215 border border-primary/18 rounded-md bg-[rgba(31,41,55,0.4)] backdrop-blur-xl overflow-hidden">
          {/* Window chrome */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/6 flex items-center gap-2 bg-black/30">
            {["#ff5f57", "#ffbd2e", "#28ca41"].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: c }}
              />
            ))}
            <span className="ml-2 sm:ml-3 text-[10px] sm:text-[12px] text-white/30 font-mono truncate">
              contract_review_2024.pdf — ZenithDocs
            </span>
          </div>

          <div className="flex flex-col md:flex-row min-h-80">
            {/* Left: document viewer mock */}
            <div className="flex-1 p-5 sm:p-7 border-b md:border-b-0 md:border-r border-white/6">
              <div className="text-[11px] tracking-widest text-white/25 mb-4 font-sans">
                DOCUMENT
              </div>
              {[100, 85, 95, 60, 80, 70, 90].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded mb-2.5 animate-pulse"
                  style={{
                    background: `rgba(255,255,255,${i % 3 === 0 ? 0.12 : 0.06})`,
                    width: `${w}%`,
                    animationDuration: `${1.5 + i * 0.2}s`,
                  }}
                />
              ))}
              <div className="mt-5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-blue-600/12 border border-blue-600/25 rounded text-[11px] text-blue-300 font-sans">
                ◈ Key clause detected on page 3
              </div>
            </div>

            {/* Right: AI output mock */}
            <div className="flex-[1.2] p-5 sm:p-7">
              <div className="text-[11px] tracking-widest text-primary mb-4 font-sans">
                AI ANALYSIS
              </div>

              <div className="mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary/6 border border-primary/15 rounded">
                <div className="text-[11px] text-primary tracking-[0.08em] mb-1.5 font-sans">
                  EXECUTIVE SUMMARY
                </div>
                <div className="text-[12px] sm:text-[13px] text-text/70 leading-[1.6] font-sans">
                  Service agreement between Party A and Party B covering
                  2024–2026. Auto-renewal clause present. Payment terms: Net-30.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "⚠ Risk",
                    text: "Auto-renewal clause (§4.2)",
                    color: "text-red-400",
                  },
                  {
                    label: "✓ Action",
                    text: "Sign before March 1, 2024",
                    color: "text-green-400",
                  },
                  {
                    label: "◆ Entity",
                    text: "Acme Corp, John Doe (CEO)",
                    color: "text-blue-300",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 sm:gap-2.5 text-[12px] font-sans"
                  >
                    <span
                      className={`${item.color} min-w-12 sm:min-w-14 text-[11px] tracking-[0.05em]`}
                    >
                      {item.label}
                    </span>
                    <span className="text-text/55">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-5 sm:px-8 md:px-12 py-20 md:py-75 max-w-275 mx-auto">
        <div className="mb-12 md:mb-18 text-center">
          <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
            WORKFLOW
          </div>
          <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif">
            From upload to insight
            <br />
            <span className="text-text/35">in under 10 seconds.</span>
          </h2>
        </div>

        {/* Mobile: vertical stack; sm: 2×2 grid; lg: 4-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6 border border-white/6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="px-6 sm:px-8 py-8 sm:py-10 bg-background relative transition-colors duration-300 hover:bg-primary/4 group"
            >
              <div className="text-[11px] text-primary tracking-[0.15em] mb-4 sm:mb-5 font-sans">
                {step.num}
              </div>
              <div className="text-[20px] sm:text-[22px] font-normal mb-2 sm:mb-3 font-serif">
                {step.title}
              </div>
              <div className="text-[13px] sm:text-[14px] text-text/45 leading-[1.6] font-sans">
                {step.desc}
              </div>
              {/* Arrow: right on lg, down on sm (only between rows, hidden on last) */}
              {i < 3 && (
                <>
                  <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 text-primary text-[18px] z-2">
                    →
                  </div>
                  <div className="lg:hidden absolute bottom-3.25 left-1/2 -translate-x-1/2 text-primary text-[16px] z-2 sm:hidden">
                    ↓
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto">
        <div className="mb-12 md:mb-18 text-center">
          <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
            CAPABILITIES
          </div>
          <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif">
            Not just summaries.
            <br />
            <span className="text-text/35">Document intelligence.</span>
          </h2>
        </div>

        {/* Mobile: 1-col, sm: 2-col, lg: 3-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="px-6 sm:px-9 py-8 sm:py-10 bg-background transition-all duration-300 cursor-default relative overflow-hidden hover:bg-[rgba(31,41,55,0.6)]"
            >
              <div className="flex justify-between items-start mb-5 sm:mb-7">
                <span className="text-[22px] sm:text-[24px] text-primary">
                  {feat.icon}
                </span>
                <span className="text-[10px] tracking-[0.12em] text-text/30 border border-text/10 px-2 py-0.75 rounded-sm font-sans">
                  {feat.tag}
                </span>
              </div>
              <h3 className="text-[16px] sm:text-[18px] font-normal mb-2 sm:mb-3 font-serif">
                {feat.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-text/45 leading-[1.7] font-sans">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── USE CASES ─── */}
      <section className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto">
        <div className="mb-12 md:mb-18">
          <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
            USE CASES
          </div>
          <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif max-w-140">
            Built for everyone
            <br />
            <span className="text-text/35">who reads for work.</span>
          </h2>
        </div>

        {/* Mobile: 1-col, md: 3-col */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {personas.map((p, i) => {
            const isGold = p.color === "gold";
            return (
              <div
                key={i}
                className={`px-6 sm:px-9 py-8 sm:py-10 rounded transition-all duration-300 cursor-default hover:-translate-y-1 ${
                  isGold
                    ? "border border-primary/20 bg-primary/3 hover:shadow-[0_20px_60px_rgba(201,162,39,0.15)]"
                    : "border border-blue-600/20 bg-blue-600/3 hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]"
                }`}
              >
                <div className="text-[26px] sm:text-[28px] mb-3 sm:mb-4">
                  {p.icon}
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-normal mb-5 sm:mb-6 font-serif">
                  {p.role}
                </h3>
                <ul className="list-none p-0 m-0">
                  {p.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-[13px] sm:text-[14px] text-text/55 py-2 border-b border-white/6 font-sans flex items-center gap-2 sm:gap-2.5"
                    >
                      <span
                        className={`text-[10px] ${isGold ? "text-primary" : "text-blue-400"}`}
                      >
                        ◆
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-5 sm:px-8 md:px-12 py-20 md:py-30 text-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,162,39,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201,162,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.06) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        <div className="relative z-1">
          <div className="text-[11px] tracking-[0.2em] text-primary mb-5 sm:mb-6 font-sans">
            GET STARTED TODAY
          </div>
          <h2 className="text-[clamp(34px,7vw,80px)] font-normal tracking-[-0.03em] mb-5 sm:mb-6 font-serif leading-[1.1]">
            Stop reading.
            <br />
            <span className="italic text-primary">Start knowing.</span>
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-text/45 max-w-xs sm:max-w-sm md:max-w-110 mx-auto mb-10 md:mb-12 leading-[1.7] font-sans">
            Join teams and professionals who trust ZenithDocs to extract
            intelligence from every document.
          </p>
          <div className="flex gap-4 justify-center items-center">
            <button
              type="button"
              className="px-8 sm:px-11 py-4 sm:py-4.5 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] sm:text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:-translate-y-0.75 hover:shadow-[0_16px_50px_rgba(201,162,39,0.4)]"
              onClick={handleLogin}
            >
              CREATE FREE ACCOUNT →
            </button>
          </div>
          <p className="mt-4 sm:mt-5 text-[11px] sm:text-[12px] text-text/25 font-sans tracking-[0.05em]">
            No credit card required · 50 free pages per month
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/8 px-5 sm:px-8 md:px-12 py-8 md:py-10 flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between items-center text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-[18px] text-primary">◈</span>
          <span className="text-[14px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>
        <div className="text-[11px] sm:text-[12px] text-text/25 font-sans tracking-[0.05em] order-last sm:order-0">
          © 2024 ZENITHDOCS · AI DOCUMENT INTELLIGENCE
        </div>
        <div className="flex gap-4 sm:gap-6 text-[12px] text-text/30 font-sans tracking-[0.08em]">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-inherit no-underline transition-colors duration-200 hover:text-primary"
            >
              {item.toUpperCase()}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
