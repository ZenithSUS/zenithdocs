"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import { SummaryType } from "@/types/summary";
import { toast } from "sonner";
import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import useDashboard from "@/features/dashboard/useDashboard";
import { LightbulbIcon } from "lucide-react";

export default function SummarizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams?.get("doc");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedType, setSelectedType] = useState<SummaryType>("short");
  const [generatedSummary, setGeneratedSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenUsed, setTokenUsed] = useState(0);

  const { me } = useAuth();
  const { data: user } = me;

  const { documentById, updateDocumentMutation } = useDocument(
    user?._id || "",
    docId || "",
  );
  const { data: document, isLoading: docLoading } = documentById;
  const { mutateAsync: updateDocument } = updateDocumentMutation;

  const { createSummaryMutation } = useSummary(user?._id || "", docId || "");
  const { mutateAsync: createSummary, isPending: isCreating } =
    createSummaryMutation;

  const { dashboardOverview } = useDashboard(user?._id || "");
  const { refetch: refetchDashboard } = dashboardOverview;

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!document || !user) return;

    setIsGenerating(true);

    try {
      const sumary = await createSummary({
        user: user._id,
        document: document._id,
        content: document.rawText,
        type: selectedType,
      });

      const documentId = document._id;
      const updatedDocument: Partial<Doc> = {
        user: user._id,
        status: "completed",
      };

      await updateDocument({ id: documentId, data: updatedDocument });

      await refetchDashboard();
      setGeneratedSummary(sumary.content);
      setTokenUsed(sumary.tokensUsed);
      toast.success("Summary generated successfully!");
    } catch (error) {
      const err = error as AxiosError;

      await updateDocument({
        id: document._id,
        data: { status: "failed" },
      }).catch(() => {
        // Ignore
      });

      toast.error(err.response.data.message);
    } finally {
      setIsGenerating(false);
    }
  }, [document, user, selectedType]);

  if (docLoading) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif">
        <CursorGlow mousePos={mousePos} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">✨</div>
            <p className="text-[14px] text-text/50 font-sans">
              Loading document...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-xl font-normal mb-2">Document not found</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-2.5 bg-primary text-background text-[12px] font-bold tracking-widest font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
            >
              ← BACK
            </button>
            <div className="h-5 w-px bg-[#F5F5F5]/10" />
            <h1 className="text-lg font-bold tracking-[0.08em] font-serif">
              AI <span className="text-[#C9A227]">SUMMARIZE</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Document Info Card */}
        <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded-lg p-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-2xl">
              <FileIcon type={document.fileType} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-sans text-text/80 truncate">
                {document.title}
              </div>
              <div className="text-[11px] text-text/30 font-sans mt-1">
                {sizefmt.bytes(document.fileSize)} •{" "}
                {sizefmt.date(document.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Type Selection */}
        <div className="mb-8">
          <label className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-4 block font-sans">
            SELECT SUMMARY TYPE
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: "short" as SummaryType,
                icon: "⚡",
                label: "Short",
                desc: "Concise overview of the key points",
              },
              {
                type: "bullet" as SummaryType,
                icon: "📋",
                label: "Bullet Points",
                desc: "Key takeaways in scannable list format",
              },
              {
                type: "detailed" as SummaryType,
                icon: "📖",
                label: "Detailed",
                desc: "In-depth analysis with full context",
              },
              {
                type: "executive" as SummaryType,
                icon: "💼",
                label: "Executive",
                desc: "High-level overview for decision makers",
              },
            ].map(({ type, icon, label, desc }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-5 rounded-lg border-2 transition-all text-left ${
                  selectedType === type
                    ? "border-[#C9A227] bg-[#C9A227]/10"
                    : "border-white/10 bg-[rgba(31,41,55,0.3)] hover:border-white/20"
                }`}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-[14px] font-sans text-text/80 mb-1">
                  {label}
                </div>
                <div className="text-[11px] text-text/40 font-sans leading-[1.6]">
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        {!generatedSummary && (
          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-10 py-4 rounded-sm text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 ${
                isGenerating
                  ? "bg-[#C9A227]/50 text-[#111111]/50 cursor-not-allowed"
                  : "bg-[#C9A227] text-[#111111] hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin" />
                  GENERATING SUMMARY...
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <p>GENERATE SUMMARY</p>
                  <LightbulbIcon className="w-4 h-4" fill="#C9A227" />
                </div>
              )}
            </button>
          </div>
        )}

        {/* Generated Summary */}
        {generatedSummary && (
          <div className="space-y-4">
            <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C9A227]/10">
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A227] text-xl">✨</span>
                  <span className="text-[11px] tracking-[0.12em] text-[#C9A227] font-sans">
                    {selectedType.toUpperCase()} SUMMARY
                  </span>
                </div>
                <span className="text-[11px] text-text/30 font-sans tracking-[0.12em]">
                  ~{tokenUsed} tokens used
                </span>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="text-[14px] text-text/70 font-sans leading-[1.8] whitespace-pre-line">
                  {generatedSummary}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => {
                setGeneratedSummary("");
              }}
              className="flex-1 sm:flex-initial bg-[#C9A227] px-8 py-4 font-bold tracking-widest border border-[#F5F5F5]/15 text-[#F5F5F5] rounded-sm text-[13px] w-full  font-sans transition-all duration-200 hover:border-[#F5F5F5]/40"
            >
              REGENERATE
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-5 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-lg">
          <div className="flex gap-3">
            <span className="text-[#C9A227] text-lg shrink-0">💡</span>
            <div className="text-[12px] text-text/60 font-sans leading-[1.7]">
              <strong className="text-text/80">Tip:</strong> Different summary
              types are optimized for different audiences. Short summaries give
              a quick overview, bullet points are great for scanning, detailed
              summaries provide full context, and executive summaries focus on
              business impact.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
