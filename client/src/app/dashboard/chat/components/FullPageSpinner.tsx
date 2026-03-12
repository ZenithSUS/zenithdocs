const FullPageSpinner = ({
  label = "Loading conversation...",
}: {
  label?: string;
}) => (
  <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[13px] text-text/50 font-sans">{label}</p>
    </div>
  </div>
);

export default FullPageSpinner;
