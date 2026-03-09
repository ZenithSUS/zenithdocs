const SummaryEmptyState = () => (
  <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
    <div className="text-[48px] text-text/10 mb-4">◎</div>
    <h3 className="text-[18px] font-serif text-text/60 mb-2">
      No summaries yet
    </h3>
    <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto">
      Upload a document to generate AI-powered summaries in multiple formats.
    </p>
  </div>
);

export default SummaryEmptyState;
