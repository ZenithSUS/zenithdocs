const PLAN_LIMITS = {
  free: {
    tokenLimit: 15000,
    documentLimit: 10,
    storageLimitMB: 50,
  },
  premium: {
    tokenLimit: 150000,
    documentLimit: 100,
    storageLimitMB: 1000,
  },
  enterprise: {
    tokenLimit: 1000000,
    documentLimit: 1000,
    storageLimitMB: 10000,
  },
};

export type Plan = keyof typeof PLAN_LIMITS;

export default PLAN_LIMITS;
