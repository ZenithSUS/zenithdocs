function Footer() {
  return (
    <footer className="border-t border-white/8 px-5 sm:px-8 md:px-12 py-8 md:py-10 flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between items-center text-center sm:text-left">
      <div className="flex items-center gap-2.5">
        <span className="text-[18px] text-primary">◈</span>
        <span className="text-[14px] font-bold tracking-[0.08em] font-serif">
          ZENITH<span className="text-primary">DOCS</span>
        </span>
      </div>
      <div className="text-[11px] sm:text-[12px] text-text/25 font-sans tracking-[0.05em] order-last sm:order-0">
        © {new Date().getFullYear()} ZENITHDOCS · AI DOCUMENT SUMMARIZATION
      </div>
    </footer>
  );
}

export default Footer;
