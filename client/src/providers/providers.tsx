import AuthProvider from "./auth.provider";
import QueryProvider from "./query.provider";
import ToasterProvider from "./toaster.provider";
import VercelAnalyticsProvider from "./vercel-analytics.provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <VercelAnalyticsProvider>
        <QueryProvider>
          <AuthProvider>
            <ToasterProvider>{children}</ToasterProvider>
          </AuthProvider>
        </QueryProvider>
      </VercelAnalyticsProvider>
    </>
  );
};

export default Providers;
