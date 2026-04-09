export const calcPct = (used = 0, limit?: number) =>
  limit ? Math.min(100, (used / limit) * 100) : 0;
