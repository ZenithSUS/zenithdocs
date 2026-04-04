"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, Sparkles, FileText } from "lucide-react";
import type { LearningSetInput } from "@/types/learning-set";
import type Doc from "@/types/doc";
import type { UseMutationResult } from "@tanstack/react-query";
import type { LearningSet } from "@/types/learning-set";
import type { AxiosError } from "@/types/api";
import DocumentLearningCard from "./DocumentLearningCard";
import ConfigBlock from "./ConfigBlock";
import DIFFICULTIES from "../constants/difficulties";
import SET_TYPES from "../constants/set-types";
import ITEM_TYPES from "../constants/item-types";
import SectionLabel from "./SectionLabel";
import { ThreeDot } from "react-loading-indicators";

type SetType = LearningSetInput["type"];
type ItemType = LearningSetInput["itemType"];
type Difficulty = LearningSetInput["difficulty"];

interface LearningSetConfigProps {
  userId: string;
  documents: Doc[];
  documentsHasNextPage?: boolean;
  fetchNextDocumentsPage?: () => void;
  createLearningSetMutation: UseMutationResult<
    LearningSet,
    AxiosError,
    LearningSetInput
  >;
  setGeneratedSet: React.Dispatch<React.SetStateAction<LearningSet | null>>;
}

function LearningSetConfig({
  userId,
  documents,
  documentsHasNextPage,
  fetchNextDocumentsPage,
  createLearningSetMutation,
  setGeneratedSet,
}: LearningSetConfigProps) {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [setType, setSetType] = useState<SetType>("quiz");
  const [itemType, setItemType] = useState<ItemType>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [title, setTitle] = useState("");
  const [docSearch, setDocSearch] = useState("");

  const filteredDocs = useMemo(
    () =>
      documents.filter((d) =>
        d.title.toLowerCase().includes(docSearch.toLowerCase()),
      ),
    [documents, docSearch],
  );

  const canGenerate = !!selectedDoc && !createLearningSetMutation.isPending;

  const handleGenerate = async () => {
    if (!selectedDoc) return;

    const input: LearningSetInput = {
      ownerId: userId,
      documentId: selectedDoc._id,
      type: setType,
      itemType: setType === "flashcard" ? "flashcard" : itemType,
      difficulty,
      title: title.trim() || undefined,
    };
    const result = await createLearningSetMutation.mutateAsync(input);
    setGeneratedSet(result);
  };

  const difficultyDescription = () => {
    switch (difficulty) {
      case "easy":
        return "Great for quick reviews and memorization.";
      case "medium":
        return "Suitable for learning and retention.";
      case "hard":
        return "Challenging for advanced learners.";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* ── Left: Document Selector ── */}
      <section className="flex flex-col gap-3">
        <SectionLabel icon={<FileText className="w-3.5 h-3.5" />}>
          Source Document
        </SectionLabel>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text/35 pointer-events-none" />
          <input
            type="text"
            disabled={createLearningSetMutation.isPending}
            placeholder="Search documents…"
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-text/80 placeholder:text-text/30 focus:outline-none focus:border-amber-500/40 focus:bg-white/7 transition-all duration-150"
          />
        </div>

        <div className="flex flex-col gap-1.5 max-h-72 md:max-h-105 overflow-y-auto pr-0.5">
          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center gap-2">
              <FileText className="w-8 h-8 text-text/15" />
              <p className="text-sm text-text/35">
                {docSearch
                  ? "No documents match your search."
                  : "No documents found. Upload one to get started."}
              </p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <DocumentLearningCard
                key={doc._id}
                document={doc}
                selected={selectedDoc?._id === doc._id}
                onClick={() =>
                  setSelectedDoc((prev) => (prev?._id === doc._id ? null : doc))
                }
                disabled={createLearningSetMutation.isPending}
              />
            ))
          )}
        </div>

        {documentsHasNextPage && (
          <button
            onClick={fetchNextDocumentsPage}
            disabled={createLearningSetMutation.isPending}
            className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1 mx-auto mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Load more
          </button>
        )}
      </section>

      {/* ── Right: Configuration ── */}
      <section className="flex flex-col gap-5">
        <SectionLabel icon={<Sparkles className="w-3.5 h-3.5" />}>
          Configuration
        </SectionLabel>

        <ConfigBlock
          label="Title"
          hint="Optional — AI will generate one if left blank"
        >
          <input
            type="text"
            placeholder="e.g. Midterms Reviewer — Chapter 4"
            value={title}
            disabled={createLearningSetMutation.isPending}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-text/85 placeholder:text-text/28 focus:outline-none focus:border-amber-500/40 transition-all duration-150 opacity-50"
          />
        </ConfigBlock>

        <ConfigBlock label="Set Type">
          <div className="flex flex-col gap-1.5">
            {SET_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSetType(t.value)}
                disabled={createLearningSetMutation.isPending}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    setType === t.value
                      ? "bg-amber-500/10 border-amber-500/45 text-amber-300"
                      : "bg-white/4 border-white/8 text-text/60 hover:bg-white/7 hover:text-text/80 hover:border-white/15"
                  }
                `}
              >
                <span
                  className={`shrink-0 ${setType === t.value ? "text-amber-400" : "text-text/40"}`}
                >
                  {t.icon}
                </span>
                <div>
                  <p className="text-sm font-medium leading-none mb-0.5">
                    {t.label}
                  </p>
                  <p className="text-[11px] text-text/38 leading-tight">
                    {t.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ConfigBlock>

        {setType !== "flashcard" && (
          <ConfigBlock label="Question Type">
            <div className="flex flex-wrap gap-1.5">
              {ITEM_TYPES.filter((i) => i.value !== "flashcard").map((t) => (
                <button
                  key={t.value}
                  onClick={() => setItemType(t.value)}
                  disabled={createLearningSetMutation.isPending}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      itemType === t.value
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : "bg-white/5 border-white/10 text-text/50 hover:bg-white/8 hover:text-text/75"
                    }
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </ConfigBlock>
        )}

        <ConfigBlock label="Difficulty" hint={difficultyDescription()}>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                data-active={difficulty === d.value}
                disabled={createLearningSetMutation.isPending}
                className={`
                  flex-1 flex items-center justify-center gap-1.5
                  py-2 rounded-lg border text-xs font-medium
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${d.color}
                `}
              >
                {d.icon}
                {d.label}
              </button>
            ))}
          </div>
        </ConfigBlock>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`
            mt-1 w-full py-3 rounded-xl text-sm font-semibold
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              canGenerate
                ? "bg-amber-500 hover:bg-amber-400 text-stone-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
                : "bg-white/6 text-text/25 cursor-not-allowed border border-white/8"
            }
          `}
        >
          <Sparkles className="w-4 h-4" />
          {createLearningSetMutation.isPending ? (
            <>
              <span>Generating</span>
              <ThreeDot size="small" color="white" />
            </>
          ) : canGenerate ? (
            `Generate ${SET_TYPES.find((t) => t.value === setType)?.label}`
          ) : (
            "Select a document to continue"
          )}
        </button>

        {selectedDoc && (
          <p className="text-center text-[11px] text-text/35 -mt-2">
            Using&nbsp;
            <span className="text-amber-400/70 font-medium">
              {selectedDoc.title}
            </span>
          </p>
        )}
      </section>
    </div>
  );
}

export default LearningSetConfig;
