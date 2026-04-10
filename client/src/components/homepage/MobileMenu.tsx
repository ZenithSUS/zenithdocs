interface Props {
  scrollTo: (id: string) => void;
  handleLogin: () => void;
  handleRegister: () => void;
}

function MobileMenu({ scrollTo, handleLogin, handleRegister }: Props) {
  return (
    <div className="fixed top-14.25 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-primary/12 px-5 py-6 flex flex-col gap-4 sm:hidden">
      {[
        { label: "Features", id: "features" },
        { label: "Use Cases", id: "use-cases" },
        { label: "Pricing", id: "pricing" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="text-[13px] tracking-widest text-text/55 font-sans bg-transparent border-none cursor-pointer text-left transition-colors duration-200 hover:text-primary py-1"
        >
          {item.label.toUpperCase()}
        </button>
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
          className="flex-1 py-2.5 bg-primary border-none text-black rounded-sm cursor-pointer text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530]"
          onClick={handleRegister}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}

export default MobileMenu;
