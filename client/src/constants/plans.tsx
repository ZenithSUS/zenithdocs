import { Building2, Sparkles, Zap } from "lucide-react";

export const PLAN_LIMITS = {
  free: {
    documentLimit: 10,
    storageLimitMB: 50,
    messagesPerDay: 100,
  },
  premium: {
    documentLimit: 100,
    storageLimitMB: 1000,
    messagesPerDay: 1000,
  },
  enterprise: {
    documentLimit: 1000,
    storageLimitMB: 10000,
    messagesPerDay: 10000,
  },
};

const plans = [
  {
    key: "free",
    name: "Free",
    icon: <Sparkles size={18} />,
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: "Explore document intelligence basics",
    highlight: false,
    cta: "GET STARTED FREE",

    features: [
      `${PLAN_LIMITS.free.messagesPerDay} AI messages / day`,
      `${PLAN_LIMITS.free.documentLimit} documents uploads`,
      `${PLAN_LIMITS.free.storageLimitMB} MB storage`,
      "Basic document summaries (short & bullet)",
      "Limited document chat access",
      "Document Chats",
      "Basic insight extraction",
      "Basic AI learning sets",
      "Standard processing speed",
    ],

    missing: [
      "Priority processing",
      "Export formats (PDF, Markdown, CSV)",
      "API access",
    ],
  },

  {
    key: "premium",
    name: "Premium",
    icon: <Zap size={18} />,
    monthlyPrice: 19,
    annualPrice: 15,
    tagline: "Full document intelligence experience",
    highlight: true,
    cta: "START PREMIUM →",

    features: [
      `${PLAN_LIMITS.premium.messagesPerDay} AI messages / day`,
      `${PLAN_LIMITS.premium.documentLimit} documents uploads`,
      `${PLAN_LIMITS.premium.storageLimitMB} MB storage`,
      "Advanced insight extraction",
      "Advanced Document Chats (Reasoning Increase)",
      "Priority processing speed",
      "Email support",
    ],

    missing: ["API access", "Dedicated account manager"],
  },

  {
    key: "enterprise",
    name: "Enterprise",
    icon: <Building2 size={18} />,
    monthlyPrice: null,
    annualPrice: null,
    tagline: "Scale document intelligence across teams",
    highlight: false,
    cta: "CONTACT SALES",

    features: [
      `${PLAN_LIMITS.enterprise.messagesPerDay} AI messages / day`,
      `${PLAN_LIMITS.enterprise.documentLimit} documents uploads`,
      `${PLAN_LIMITS.enterprise.storageLimitMB} MB storage`,
      "Everything in Premium",
      "Unlimited AI summary generation",
      "Full document reasoning & chat system",
      "Advanced AI learning set automation",
      "Dedicated processing cluster",
      "Full API access",
      "SSO & RBAC authentication",
      "Custom integrations",
      "Dedicated account manager",
      "SLA uptime guarantee",
    ],

    missing: [],
  },
];

export default plans;
