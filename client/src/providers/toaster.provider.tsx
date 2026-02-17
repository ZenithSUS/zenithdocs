import { Toaster } from "sonner";

const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        position="top-right"
        closeButton
        theme="system"
        toastOptions={{ duration: 5000, style: { fontSize: "0.8rem" } }}
        className="bg-background backdrop-blur-sm border border-white/6 rounded-md shadow-md shadow-black/10"
      />
      {children}
    </>
  );
};

export default ToasterProvider;
