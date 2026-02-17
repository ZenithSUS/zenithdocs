import QueryProvider from "./query.provider";
import ToasterProvider from "./toaster.provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>
        <ToasterProvider>{children}</ToasterProvider>
      </QueryProvider>
    </>
  );
};

export default Providers;
