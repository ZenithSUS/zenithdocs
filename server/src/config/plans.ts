const PLAN_LIMITS = {
  free: {
    tokenLimit: 10000,
  },
  premium: {
    tokenLimit: 100000,
  },
};

export type Plan = keyof typeof PLAN_LIMITS;

export default PLAN_LIMITS;
