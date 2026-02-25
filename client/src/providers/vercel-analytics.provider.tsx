import { Analytics } from "@vercel/analytics/next";

const VercelAnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
};

export default VercelAnalyticsProvider;
