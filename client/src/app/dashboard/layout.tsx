"use client";

import useDocumentStatus from "@/features/documents/useDocumentStatus";
import useAuthHydration from "@/features/auth/useAuthHydration";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProviders>{children}</DashboardProviders>;
}

function DashboardProviders({ children }: { children: React.ReactNode }) {
  useAuthHydration();
  useDocumentStatus();

  return <>{children}</>;
}
