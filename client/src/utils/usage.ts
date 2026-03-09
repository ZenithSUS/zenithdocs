export const calcPct = (used = 0, limit?: number) =>
  limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
