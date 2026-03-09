import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import useDashboard from "@/features/dashboard/useDashboard";
import useMousePosition from "@/features/ui/useMousePostion";
import usageKeys from "@/features/usage/usage.key";
import { Summary, SummaryType } from "@/types/summary";
import { AxiosError } from "@/types/api";

const useSummarizePage = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const docId = searchParams?.get("doc") ?? "";

  // ─── UI state ─────────────────────────────────────────────────────────────
  const mousePos = useMousePosition();
  const [selectedType, setSelectedType] = useState<SummaryType>("short");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState<
    Summary["additionalDetails"] | null
  >(null);
  const [tokenUsed, setTokenUsed] = useState(0);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  // ─── Document ─────────────────────────────────────────────────────────────
  const { documentById } = useDocument(user?._id ?? "", docId);
  const { data: document, isLoading: docLoading } = documentById;

  // ─── Summary mutation ─────────────────────────────────────────────────────
  const { createSummaryMutation } = useSummary(user?._id ?? "", docId);
  const {
    mutateAsync: createSummary,
    isPending: isCreating,
    error: createError,
    isError: isCreateError,
  } = createSummaryMutation;

  // ─── Dashboard refetch ────────────────────────────────────────────────────
  const { dashboardOverview } = useDashboard(user?._id ?? "");
  const { refetch: refetchDashboard } = dashboardOverview;

  const refetchUsage = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: usageKeys.byUserSixMonths(user?._id ?? ""),
    });
  }, [queryClient, user?._id]);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const createErrorMessage = useMemo(
    () => createError?.response?.data?.message ?? "Something went wrong.",
    [createError],
  );

  const hasResult = Boolean(generatedSummary);

  // ─── Handlers ─────────────────────────────────────────────────────────────
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
      await Promise.all([refetchUsage(), refetchDashboard()]);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response?.data?.message ?? "Something went wrong.");
    }
  }, [
    document,
    user,
    selectedType,
    createSummary,
    refetchUsage,
    refetchDashboard,
  ]);

  const handleRegenerate = useCallback(() => {
    setGeneratedSummary("");
    setAdditionalDetails(null);
    setTokenUsed(0);
  }, []);

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Document
    document,
    docLoading,

    // Summary state
    selectedType,
    setSelectedType,
    generatedSummary,
    additionalDetails,
    tokenUsed,
    hasResult,

    // Mutation state
    isCreating,
    isCreateError,
    createErrorMessage,

    // UI
    mousePos,

    // Handlers
    handleGenerate,
    handleRegenerate,
  };
};

export default useSummarizePage;
