import { Usage } from "@/types/usage";

const formatDailyMessages = (dailyMessages: Usage["dailyMessages"]) => {
  return Object.entries(dailyMessages)
    .slice(-7)
    .reverse()
    .map(([date, count]) => {
      const d = new Date(date);

      return {
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export default formatDailyMessages;
