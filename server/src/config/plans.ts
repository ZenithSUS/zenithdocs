const PLAN_LIMITS = {
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

export type Plan = keyof typeof PLAN_LIMITS;

export default PLAN_LIMITS;
