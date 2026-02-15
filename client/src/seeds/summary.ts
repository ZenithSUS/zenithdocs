import { Summary } from "@/types/summary";

const SUMMARIES: Summary[] = [
  {
    _id: "s1",
    document: "d1",
    type: "executive",
    content:
      "Service agreement between Party A and Party B covering 2026–2028. Auto-renewal clause present. Payment terms: Net-30. Liability capped at annual contract value.",
    tokensUsed: 420,
    createdAt: "2026-02-01",
  },
  {
    _id: "s2",
    document: "d2",
    type: "bullet",
    content:
      "• NLP transformers outperform RNNs on sequence tasks\n• BERT variants show 12% gain on NER benchmarks\n• Fine-tuning on domain data reduces hallucination\n• Retrieval-augmented generation improves factual accuracy",
    tokensUsed: 310,
    createdAt: "2026-02-03",
  },
  {
    _id: "s3",
    document: "d3",
    type: "short",
    content:
      "Q1 strategy focuses on expanding enterprise tier, reducing churn via onboarding improvements, and shipping document comparison feature by March.",
    tokensUsed: 180,
    createdAt: "2026-02-05",
  },
  {
    _id: "s4",
    document: "d5",
    type: "detailed",
    content:
      "This paper examines the ethical implications of large language models deployed in high-stakes domains including legal, medical, and financial services. Key findings indicate that bias amplification remains the primary risk vector, followed by hallucination in low-data regimes. The authors propose a tiered accountability framework.",
    tokensUsed: 680,
    createdAt: "2026-02-11",
  },
];

export default SUMMARIES;
