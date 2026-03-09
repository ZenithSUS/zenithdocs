import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="text-text/70">{children}</li>,
  code: ({ children }) => (
    <code className="bg-black/30 px-1.5 py-0.5 rounded text-[13px] text-primary/90">
      {children}
    </code>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text/95">{children}</strong>
  ),
};
