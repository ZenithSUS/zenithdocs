import { Usage } from "@/types/usage";

const formattedStorageTrend = (usageHistory: Usage[]) => {
  return usageHistory
    .map((item) => {
      const date = new Date(item.month + "-01");

      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        storage: item.storageUsed,
      };
    })
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

export default formattedStorageTrend;
