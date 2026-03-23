"use client";

import useAuthHydration from "@/features/auth/useAuthHydration";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocumentProviders>{children}</DocumentProviders>;
}

function DocumentProviders({ children }: { children: React.ReactNode }) {
  useAuthHydration();

  return <>{children}</>;
}
