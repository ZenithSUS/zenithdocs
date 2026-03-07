"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import { Summary, SummaryType } from "@/types/summary";
import { toast } from "sonner";
import { AxiosError } from "@/types/api";
import useDashboard from "@/features/dashboard/useDashboard";
import {
  AlertTriangle,
  Building2,
  Coins,
  FileText,
  RotateCcw,
  Sparkles,
  XCircle,
  Zap,
  List,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import usageKeys from "@/features/usage/usage.key";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import ErrorScreen from "@/components/dashboard/ErrorScreen";

const SUMMARY_TYPES = [
  {
    type: "short" as SummaryType,
    icon: <Zap size={16} />,
    label: "Short",
    desc: "Concise overview of the key points",
  },
  {
    type: "bullet" as SummaryType,
    icon: <List size={16} />,
    label: "Bullet Points",
    desc: "Key takeaways in scannable list format",
  },
  {
    type: "detailed" as SummaryType,
    icon: <FileText size={16} />,
    label: "Detailed",
    desc: "In-depth analysis with full context",
  },
  {
    type: "executive" as SummaryType,
    icon: <Briefcase size={16} />,
    label: "Executive",
    desc: "High-level overview for decision makers",
  },
];

function SummarizePageContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams?.get("doc");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedType, setSelectedType] = useState<SummaryType>("short");
  const [generatedSummary, setGeneratedSummary] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<
    Summary["additionalDetails"] | null
  >(null);
  const [tokenUsed, setTokenUsed] = useState(0);

  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  const { documentById } = useDocument(user?._id || "", docId || "");
  const { data: document, isLoading: docLoading } = documentById;

  const { createSummaryMutation } = useSummary(user?._id || "", docId || "");
  const {
    mutateAsync: createSummary,
    isPending: isCreating,
    error: createError,
    isError: isCreateError,
  } = createSummaryMutation;

  const { dashboardOverview } = useDashboard(user?._id || "");
  const { refetch: refetchDashboard } = dashboardOverview;

  const refetchLastSixMonthsUsage = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: usageKeys.byUserSixMonths(user?._id || ""),
    });
  }, [queryClient]);

  const createErrorMessage = useMemo(
    () => createError?.response?.data?.message || "Something went wrong.",
    [createError],
  );

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!document || !user) return;
    try {
      const summary = await createSummary({
        user: user._id,
        document: document._id,
        type: selectedType,
      });

      setGeneratedSummary(summary.content);
      setAdditionalDetails(summary.additionalDetails ?? null);
      setTokenUsed(summary.tokensUsed);
      toast.success("Summary generated successfully!");
      await Promise.all([refetchLastSixMonthsUsage(), refetchDashboard()]);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  }, [document, user, selectedType]);

  const handleRegenerate = useCallback(() => {
    setGeneratedSummary("");
    setAdditionalDetails(null);
    setTokenUsed(0);
  }, []);

  if (userError)
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  if (userLoading || docLoading) return <LoadingScreen />;

  if (!document) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">404</div>
          <h2 className="text-xl font-normal mb-2 font-serif">
            Document not found
          </h2>
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

  const hasRisk =
    additionalDetails?.risk &&
    additionalDetails.risk !== "No significant risk identified";

  const hasAction =
    additionalDetails?.action &&
    additionalDetails.action !== "No immediate action required";

  const hasEntities =
    additionalDetails?.entity && additionalDetails.entity.length > 0;

  const hasAnyDetails = hasRisk || hasAction || hasEntities;

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#F5F5F5]/50 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-1.5 text-[11px] tracking-widest font-sans"
          >
            ← BACK
          </button>
          <div className="h-4 w-px bg-[#F5F5F5]/10" />
          <h1 className="text-[15px] font-bold tracking-[0.08em] font-serif">
            AI <span className="text-[#C9A227]">SUMMARIZE</span>
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-16 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Document Info */}
        <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/15 rounded-lg p-4 mb-8 flex items-center gap-4">
          <FileIcon type={document.fileType} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-sans text-text/80 truncate">
              {document.title}
            </div>
            <div className="text-[11px] text-text/30 font-sans mt-0.5">
              {sizefmt.bytes(document.fileSize)} ·{" "}
              {sizefmt.date(document.createdAt)}
            </div>
          </div>
        </div>

        {/* Pre-generate: type selector + button */}
        {!generatedSummary && (
          <>
            <div className="mb-8">
              <label className="text-[10px] tracking-[0.18em] text-[#C9A227]/70 mb-4 block font-sans">
                SELECT SUMMARY TYPE
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SUMMARY_TYPES.map(({ type, icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    disabled={isCreating}
                    className={`p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group ${
                      selectedType === type
                        ? "border-[#C9A227] bg-[#C9A227]/8"
                        : "border-white/8 bg-[rgba(31,41,55,0.3)] hover:border-white/18"
                    }`}
                  >
                    <div
                      className={`mb-3 transition-colors ${
                        selectedType === type
                          ? "text-[#C9A227]"
                          : "text-text/30 group-hover:text-text/50"
                      }`}
                    >
                      {icon}
                    </div>
                    <div className="text-[13px] font-sans text-text/80 mb-1">
                      {label}
                    </div>
                    <div className="text-[11px] text-text/35 font-sans leading-[1.6]">
                      {desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={handleGenerate}
                disabled={isCreating}
                className={`inline-flex items-center gap-2.5 px-10 py-3.5 rounded-sm text-[12px] font-bold tracking-[0.14em] font-sans transition-all duration-200 ${
                  isCreating
                    ? "bg-[#C9A227]/40 text-[#111111]/50 cursor-not-allowed"
                    : "bg-[#C9A227] text-[#111111] hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.3)]"
                }`}
              >
                {isCreating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    GENERATE SUMMARY
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Post-generate: result */}
        {generatedSummary && (
          <div className="space-y-3">
            {/* Summary card */}
            <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/15 rounded-lg overflow-hidden">
              {/* Header strip */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-[#C9A227]" />
                  <span className="text-[10px] tracking-[0.16em] text-[#C9A227] font-sans">
                    {selectedType.toUpperCase()} SUMMARY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-text/25 font-sans">
                  <Coins size={10} />
                  {tokenUsed.toLocaleString()} tokens
                </div>
              </div>

              {/* Summary text */}
              <div className="px-6 py-5">
                <p className="text-[14px] text-text/70 font-sans leading-[1.9] whitespace-pre-line">
                  {generatedSummary}
                </p>
              </div>

              {/* Additional Details inline */}
              {hasAnyDetails && (
                <div className="mx-5 mb-5 rounded-md border border-white/6 bg-white/[0.018] overflow-hidden">
                  {hasRisk && (
                    <div className="flex items-start gap-4 px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-1.5 w-17 shrink-0 pt-px">
                        <AlertTriangle
                          size={10}
                          className="text-amber-400/70 shrink-0"
                        />
                        <span className="text-[9px] tracking-widest font-bold text-amber-400/70 font-sans uppercase">
                          Risk
                        </span>
                      </div>
                      <p className="text-[12.5px] text-text/55 font-sans leading-relaxed">
                        {additionalDetails!.risk}
                      </p>
                    </div>
                  )}

                  {hasAction && (
                    <div
                      className={`flex items-start gap-4 px-4 py-3 ${hasEntities ? "border-b border-white/5" : ""}`}
                    >
                      <div className="flex items-center gap-1.5 w-17 shrink-0 pt-px">
                        <ChevronRight
                          size={10}
                          className="text-emerald-400/70 shrink-0"
                        />
                        <span className="text-[9px] tracking-widest font-bold text-emerald-400/70 font-sans uppercase">
                          Action
                        </span>
                      </div>
                      <p className="text-[12.5px] text-text/55 font-sans leading-relaxed">
                        {additionalDetails!.action}
                      </p>
                    </div>
                  )}

                  {hasEntities && (
                    <div className="flex items-start gap-4 px-4 py-3">
                      <div className="flex items-center gap-1.5 w-17 shrink-0 pt-0.75">
                        <Building2
                          size={10}
                          className="text-sky-400/70 shrink-0"
                        />
                        <span className="text-[9px] tracking-widest font-bold text-sky-400/70 font-sans uppercase">
                          Entity
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {additionalDetails!.entity.map((e, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] text-text/50 font-sans bg-white/[4 border border-white/8"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Regenerate */}
            <button
              onClick={handleRegenerate}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-[11.5px] font-bold tracking-[0.14em] font-sans border border-white/8 text-text/40 bg-transparent hover:border-white/18 hover:text-text/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={12} />
              REGENERATE
            </button>
          </div>
        )}

        {/* Error */}
        {isCreateError && (
          <div className="mt-6 p-4 bg-red-500/5 border border-red-500/25 rounded-lg flex gap-3">
            <XCircle size={15} className="text-red-500/60 shrink-0 mt-px" />
            <p className="text-[12px] text-text/50 font-sans leading-[1.7]">
              <span className="text-text/70 font-semibold">Error: </span>
              {createErrorMessage}
            </p>
          </div>
        )}

        {/* Tip */}
        <div className="mt-8 p-4 bg-[#C9A227]/4 border border-[#C9A227]/12 rounded-lg flex gap-3">
          <span className="text-[#C9A227]/50 shrink-0">💡</span>
          <p className="text-[11.5px] text-text/40 font-sans leading-[1.75]">
            <span className="text-text/60 font-semibold">Tip: </span>
            Different summary types are optimized for different audiences. Short
            gives a quick overview, bullet points are great for scanning,
            detailed provides full context, and executive focuses on business
            impact.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function SummarizePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SummarizePageContent />
    </Suspense>
  );
}
