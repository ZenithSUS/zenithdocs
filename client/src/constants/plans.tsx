import formatTokenLimit from "@/helpers/format-token-limit";
import { Building2, Sparkles, Zap } from "lucide-react";

export const PLAN_LIMITS = {
  free: { tokenLimit: 10000, documentLimit: 10 },
  premium: { tokenLimit: 100000, documentLimit: 100 },
  enterprise: { tokenLimit: 1000000, documentLimit: 1000 },
};

const plans = [
  {
    key: "free",
    name: "Free",
    icon: <Sparkles size={18} />,
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: "Perfect for getting started",
    highlight: false,
    cta: "GET STARTED FREE",
    features: [
      `${formatTokenLimit(PLAN_LIMITS.free.tokenLimit)} tokens / month`,
      `${PLAN_LIMITS.free.documentLimit} documents`,
      "Brief & bullet summaries",
      "Basic insight extraction",
      "Standard processing speed",
      "Community support",
    ],
    missing: [
      "Document comparison",
      "Priority processing",
      "API access",
      "Custom export formats",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    icon: <Zap size={18} />,
    monthlyPrice: 19,
    annualPrice: 15,
    tagline: "For power users & professionals",
    highlight: true,
    cta: "START PREMIUM →",
    features: [
      `${formatTokenLimit(PLAN_LIMITS.premium.tokenLimit)} tokens / month`,
      `${PLAN_LIMITS.premium.documentLimit} documents`,
      "All summary modes",
      "Advanced insight extraction",
      "Priority processing speed",
      "Document comparison",
      "CSV / Markdown export",
      "Email support",
    ],
    missing: ["Dedicated account manager", "Custom integrations"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    icon: <Building2 size={18} />,
    monthlyPrice: null,
    annualPrice: null,
    tagline: "For teams at scale",
    highlight: false,
    cta: "CONTACT SALES",
    features: [
      `${formatTokenLimit(PLAN_LIMITS.enterprise.tokenLimit)} tokens / month`,
      `${PLAN_LIMITS.enterprise.documentLimit} documents`,
      "All Premium features",
      "Unlimited summary types",
      "Dedicated processing cluster",
      "Full API access",
      "SSO & RBAC",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    missing: [],
  },
];

export default plans;
