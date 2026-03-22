import { FourSquare } from "react-loading-indicators";

const FullPageSpinner = ({
  label = "Loading conversation...",
}: {
  label?: string;
}) => (
  <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <FourSquare color="#C9A227" size="large" />
      <p className="text-sm mt-4 text-primary font-semibold tracking-wide">
        {label}
      </p>
    </div>
  </div>
);

export default FullPageSpinner;
