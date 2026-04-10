import SourceDocumentList from "./SourceDocumentList";
import LearningSetConfig from "./LearningSetConfig";

export default function LearningSetCreator() {
  return (
    <section className="w-full px-5 sm:px-8 md:px-12 py-16 md:py-24 bg-background text-text">
      <div className="text-center mb-10">
        <p className="text-[11px] tracking-widest text-primary/60 uppercase font-sans mb-3">
          Learning sets
        </p>
        <h2 className="text-[clamp(26px,4vw,44px)] font-normal tracking-[-0.02em] font-serif mb-4">
          Turn documents into
          <br />
          <span className="text-text/35">knowledge that sticks.</span>
        </h2>
        <p className="text-[14px] text-text/40 font-sans max-w-sm mx-auto leading-relaxed">
          Generate quizzes, flashcards, and reviewers from any uploaded file in
          one click.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <SourceDocumentList />
        <LearningSetConfig />
      </div>
    </section>
  );
}
