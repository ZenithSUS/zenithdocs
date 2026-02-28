import plans from "@/constants/plans";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Pricing() {
  const router = useRouter();

  const [billingAnnual, setBillingAnnual] = useState(false);
  const handleRegister = () => router.push("/register");

  return (
    <section
      id="pricing"
      className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto scroll-mt-20"
    >
      <div className="mb-12 md:mb-16 text-center">
        <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
          PRICING
        </div>
        <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif mb-4">
          Simple, transparent
          <br />
          <span className="text-text/35">pricing that scales.</span>
        </h2>
        <p className="text-[14px] text-text/40 font-sans mb-8 max-w-md mx-auto">
          Start free. Upgrade when you need more power. No hidden fees, no
          surprises.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 p-1 bg-white/4 border border-white/8 rounded-sm">
          <button
            onClick={() => setBillingAnnual(false)}
            className={`px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${!billingAnnual ? "bg-primary text-background font-bold" : "text-text/50 hover:text-text/70"}`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingAnnual(true)}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${billingAnnual ? "bg-primary text-background font-bold" : "text-text/50 hover:text-text/70"}`}
          >
            ANNUAL
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${billingAnnual ? "bg-background/20 text-background" : "bg-primary/15 text-primary"}`}
            >
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/6 border border-white/6">
        {plans.map((plan) => {
          const price =
            plan.monthlyPrice === null
              ? null
              : billingAnnual
                ? plan.annualPrice
                : plan.monthlyPrice;

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col px-7 sm:px-8 py-8 sm:py-10 bg-background transition-all duration-300 ${
                plan.highlight ? "bg-primary/4" : "hover:bg-white/2"
              }`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-background text-[10px] font-bold tracking-[0.15em] font-sans rounded-full whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div
                  className={`flex items-center gap-2 mb-3 ${plan.highlight ? "text-primary" : "text-text/50"}`}
                >
                  {plan.icon}
                  <span className="text-[11px] tracking-[0.15em] font-sans font-bold">
                    {plan.name.toUpperCase()}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  {price === null ? (
                    <div className="text-[32px] sm:text-[38px] font-light font-serif tracking-tight text-text">
                      Custom
                    </div>
                  ) : price === 0 ? (
                    <div className="text-[32px] sm:text-[38px] font-light font-serif tracking-tight text-text">
                      Free
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-[13px] text-text/40 font-sans mb-2">
                        $
                      </span>
                      <span className="text-[32px] sm:text-[38px] font-light font-serif tracking-tight text-text">
                        {price}
                      </span>
                      <span className="text-[12px] text-text/40 font-sans mb-2">
                        /mo
                      </span>
                    </div>
                  )}
                  {billingAnnual && price !== null && price > 0 && (
                    <div className="text-[11px] text-primary font-sans">
                      Billed annually · saves $
                      {(plan.monthlyPrice! - plan.annualPrice!) * 12}/yr
                    </div>
                  )}
                </div>

                <p className="text-[12px] text-text/35 font-sans">
                  {plan.tagline}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/8 mb-6" />

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-text/65 font-sans"
                  >
                    <Check size={13} className="text-primary mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
                {plan.missing.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-text/20 font-sans line-through"
                  >
                    <span className="w-3 h-3 mt-0.5 shrink-0 rounded-full border border-white/10 inline-block" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={plan.key === "enterprise" ? undefined : handleRegister}
                className={`w-full py-3 rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 ${
                  plan.highlight
                    ? "bg-primary text-background hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,0.3)]"
                    : "bg-white/5 border border-white/10 text-text/60 hover:bg-white/10 hover:text-text/80"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Plan comparison callout */}
      <p className="text-center text-[11px] text-text/25 font-sans tracking-widest mt-8">
        ALL PLANS INCLUDE SSL ENCRYPTION · GDPR COMPLIANT · CANCEL ANYTIME
      </p>
    </section>
  );
}

export default Pricing;
