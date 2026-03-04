// app/dashboard/layout.tsx
"use client";

import useDocumentStatus from "@/features/documents/useDocumentStatus";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardSocketProvider>{children}</DashboardSocketProvider>;
}

function DashboardSocketProvider({ children }: { children: React.ReactNode }) {
  useDocumentStatus();

  return <>{children}</>;
}
