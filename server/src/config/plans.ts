const PLAN_LIMITS = {
  free: {
    tokenLimit: 10000,
    documentLimit: 10,
  },
  premium: {
    tokenLimit: 100000,
    documentLimit: 100,
  },
  enterprise: {
    tokenLimit: 1000000,
    documentLimit: 1000,
  },
};

export type Plan = keyof typeof PLAN_LIMITS;

export default PLAN_LIMITS;
