import { Summary } from "@/types/summary";

const SUMMARIES: Summary[] = [
  {
    _id: "s1",
    document: "d1",
    type: "executive",
    content:
      "Service agreement between Party A and Party B covering 2026–2028. Auto-renewal clause present. Payment terms: Net-30. Liability capped at annual contract value.",
    tokensUsed: 420,
    user: "u1",
    createdAt: "2026-02-01",
    additionalDetails: {
      risk: "Auto-renewal clause, no opt-out window defined",
      action: "Review and sign before March 1, 2026",
      entity: ["Party A", "Party B"],
    },
  },
  {
    _id: "s2",
    document: "d2",
    type: "bullet",
    content:
      "• NLP transformers outperform RNNs on sequence tasks\n• BERT variants show 12% gain on NER benchmarks\n• Fine-tuning on domain data reduces hallucination\n• Retrieval-augmented generation improves factual accuracy",
    tokensUsed: 310,
    user: "u1",
    createdAt: "2026-02-03",
    additionalDetails: {
      risk: "Findings based on limited benchmark datasets only",
      action: "Validate results on domain-specific corpus",
      entity: ["BERT", "NLP", "RAG (Retrieval-Augmented Generation)"],
    },
  },
  {
    _id: "s3",
    document: "d3",
    type: "short",
    content:
      "Q1 strategy focuses on expanding enterprise tier, reducing churn via onboarding improvements, and shipping document comparison feature by March.",
    tokensUsed: 180,
    user: "u2",
    createdAt: "2026-02-05",
    additionalDetails: {
      risk: "Document comparison deadline at risk if dev delayed",
      action: "Confirm engineering timeline by end of February",
      entity: ["Enterprise Tier", "Q1 2026"],
    },
  },
  {
    _id: "s4",
    document: "d5",
    type: "detailed",
    content:
      "This paper examines the ethical implications of large language models deployed in high-stakes domains including legal, medical, and financial services. Key findings indicate that bias amplification remains the primary risk vector, followed by hallucination in low-data regimes. The authors propose a tiered accountability framework.",
    tokensUsed: 680,
    user: "u2",
    createdAt: "2026-02-11",
    additionalDetails: {
      risk: "Bias amplification in legal and medical deployments",
      action: "Adopt proposed tiered accountability framework",
      entity: [
        "LLMs",
        "Legal Services",
        "Medical Services",
        "Financial Services",
      ],
    },
  },
];

export default SUMMARIES;
