export const dashboardKeys = {
  all: ["dashboard"] as const,
  list: () => [...dashboardKeys.all, "list"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
};

export type DashboardKeys = typeof dashboardKeys;
