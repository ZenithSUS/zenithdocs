interface Props {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollTo: (id: string) => void;
  handleLogin: () => void;
  handleRegister: () => void;
  scrollY: number;
}

function NavBar({
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollTo,
  handleLogin,
  handleRegister,
  scrollY,
}: Props) {
  return (
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
        {[
          { label: "FEATURES", id: "features" },
          { label: "USE CASES", id: "use-cases" },
          { label: "PRICING", id: "pricing" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="bg-transparent border-none p-0 cursor-pointer text-[13px] tracking-widest text-text/55 font-sans transition-colors duration-200 hover:text-primary"
          >
            {item.label}
          </button>
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
          className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>
    </nav>
  );
}

export default NavBar;
