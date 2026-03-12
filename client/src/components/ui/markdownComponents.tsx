import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export { remarkGfm };

export const markdownComponents: Components = {
  // ── Headings ───────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="text-[18px] font-bold font-serif text-white/90 mt-5 mb-3 leading-snug">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="text-[15px] font-bold font-serif text-white/85 mt-5 mb-2.5 pb-1.5 leading-snug"
      style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-[13px] font-semibold font-serif mt-4 mb-2 leading-snug"
      style={{ color: "#C9A227" }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[12px] font-semibold text-white/70 mt-3 mb-1.5 uppercase tracking-wider">
      {children}
    </h4>
  ),

  // ── Body text ──────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 text-white/70 leading-relaxed">{children}</p>
  ),

  // ── Line breaks ────────────────────────────────────────────────────────────
  br: () => <br />,

  // ── Lists ──────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-white/60 leading-relaxed">{children}</li>
  ),

  // ── Inline ─────────────────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="font-semibold text-white/90">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-white/60">{children}</em>,
  code: ({ children }) => (
    <code
      className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono"
      style={{ color: "#C9A227" }}
    >
      {children}
    </code>
  ),

  // ── Block elements ─────────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <blockquote
      className="my-3 pl-3 py-0.5 text-white/50 italic text-[12px] leading-relaxed"
      style={{ borderLeft: "2px solid rgba(201,162,39,0.4)" }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      className="my-4 border-none h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)",
      }}
    />
  ),
  pre: ({ children }) => (
    <pre
      className="rounded-xl px-4 py-3 mb-3 overflow-x-auto text-[11px] font-mono text-white/60"
      style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {children}
    </pre>
  ),

  // ── Table ──────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div
      className="overflow-x-auto mb-4 rounded-xl"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <table className="w-full text-[12px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "rgba(201,162,39,0.08)" }}>{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody
      className="divide-y"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr
      className="transition-colors duration-100"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.03)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
    >
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th
      className="px-4 py-2.5 text-left font-semibold tracking-wide text-[11px] uppercase"
      style={{
        color: "#C9A227",
        borderBottom: "1px solid rgba(201,162,39,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="px-4 py-2.5 text-white/60 leading-relaxed align-top"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      {children}
    </td>
  ),
};
