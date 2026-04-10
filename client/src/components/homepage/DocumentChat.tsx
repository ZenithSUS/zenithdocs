"use client";

import {
  Sparkles,
  Send,
  FileText,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

const USER_INITIAL = "J";

const messages = [
  {
    role: "user",
    text: "What are the key obligations in this contract?",
    time: "02:10 PM",
  },
  {
    role: "ai",
    text: "The contract outlines three core obligations for both parties:",
    table: {
      headers: ["Party", "Obligation", "Deadline"],
      rows: [
        ["Vendor", "Deliver SaaS platform access", "March 1, 2025"],
        ["Client", "Net-60 payment on invoices", "Rolling monthly"],
        ["Both", "Maintain data confidentiality", "Ongoing"],
      ],
    },
    confidence: {
      label: "High confidence",
      value: 94,
      color: "text-green-400 bg-green-400/10 border-green-400/20",
    },
    time: "02:10 PM",
  },
  {
    role: "user",
    text: "What happens if the client terminates early?",
    time: "02:11 PM",
  },
  {
    role: "ai",
    text: "Early termination by the client triggers a penalty fee equivalent to 20% of the remaining contract value, as outlined in §9.3. Written notice must be provided at least 30 days in advance.",
    confidence: {
      label: "Moderate confidence",
      value: 81,
      color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    },
    time: "02:11 PM",
  },
];

export default function DocumentChat() {
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-widest text-primary/60 uppercase font-sans mb-3">
            Document chat
          </p>
          <h2 className="text-[clamp(26px,4vw,44px)] font-normal tracking-[-0.02em] font-serif mb-4">
            Ask anything about
            <br />
            <span className="text-text/35">your documents.</span>
          </h2>
          <p className="text-[14px] text-text/40 font-sans max-w-sm mx-auto leading-relaxed">
            Get instant answers, tables, and insights directly from your
            uploaded files.
          </p>
        </div>

        {/* Chat window */}
        <div className="max-w-3xl mx-auto border border-white/10 rounded-lg bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Top bar */}
          <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
              <ArrowLeft size={14} className="text-white/30" />
              <span className="text-[11px] tracking-widest text-white/30 uppercase font-sans">
                Back
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/20 flex items-center justify-center">
                <FileText size={13} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-[13px] text-white/80 font-sans leading-none mb-0.5">
                  enterprise_contract_2025.pdf
                </p>
                <p className="text-[10px] tracking-widest text-white/30 uppercase font-sans">
                  Document chat
                </p>
              </div>
            </div>
            <MoreHorizontal size={16} className="text-white/30" />
          </div>

          {/* Messages */}
          <div className="p-5 flex flex-col gap-5 min-h-80">
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex items-start gap-3 justify-end">
                  <div className="max-w-sm">
                    <div className="px-4 py-3 bg-white/8 border border-white/10 rounded-lg rounded-tr-sm">
                      <p className="text-[13px] text-white/80 font-sans leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                    <p className="text-[10px] text-white/25 font-sans mt-1.5 text-right">
                      {msg.time}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[12px] text-white/60 font-sans font-medium">
                      {USER_INITIAL}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles size={13} className="text-primary" />
                  </div>
                  <div className="flex-1 max-w-xl">
                    <div className="px-4 py-3.5 bg-white/5 border border-white/8 rounded-lg rounded-tl-sm">
                      <p className="text-[13px] text-white/70 font-sans leading-relaxed mb-3">
                        {msg.text}
                      </p>

                      {msg.table && (
                        <div className="border border-white/8 rounded-md overflow-hidden mb-3">
                          <table className="w-full text-[11px] font-sans">
                            <thead>
                              <tr className="bg-white/5 border-b border-white/8">
                                {msg.table.headers.map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left text-white/40 tracking-widest uppercase font-medium"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/6">
                              {msg.table.rows.map((row, ri) => (
                                <tr key={ri}>
                                  {row.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`px-3 py-2.5 ${ci === 0 ? "text-white/70 font-medium" : "text-white/45"}`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {msg.confidence && (
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border font-sans ${msg.confidence.color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {msg.confidence.label}
                          <span className="opacity-60">
                            {msg.confidence.value}%
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/25 font-sans mt-1.5">
                      {msg.time}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Input bar */}
          <div className="px-4 py-3.5 border-t border-white/8 bg-black/10">
            <div className="flex items-center gap-3 px-4 py-3 border border-white/10 rounded-lg bg-white/3">
              <p className="flex-1 text-[13px] text-white/25 font-sans">
                Ask a question about this document...
              </p>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Send size={13} className="text-background" />
              </div>
            </div>
            <p className="text-center text-[10px] text-white/20 font-sans mt-2.5">
              AI responses may contain errors. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
