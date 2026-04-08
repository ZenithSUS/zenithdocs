import { Usage } from "@/types/usage";

const formattedAIRequests = (usageHistory: Usage[]) => {
  return usageHistory.map((item) => {
    const date = new Date(item.month + "-01");

    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      aiRequests: item.aiRequests,
      totalMessages: item.totalMessages,
    };
  });
};

export default formattedAIRequests;
