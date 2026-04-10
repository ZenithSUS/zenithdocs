import Link from "next/link";

function RegisterFormHeader() {
  return (
    <div className="mb-9">
      <div className="text-[10px] tracking-[0.2em] text-primary mb-3 font-sans">
        CREATE ACCOUNT
      </div>
      <h1 className="text-[clamp(28px,4vw,40px)] font-normal tracking-[-0.025em] leading-[1.1] font-serif mb-3">
        Start for free.
        <br />
        <span className="text-primary italic">No card needed.</span>
      </h1>
      <p className="text-[14px] text-text/40 font-sans leading-[1.6]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary no-underline border-b border-primary/30 pb-px transition-colors duration-200 hover:border-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterFormHeader;
