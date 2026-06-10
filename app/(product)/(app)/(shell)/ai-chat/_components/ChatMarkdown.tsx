import ReactMarkdown from "react-markdown";

/**
 * Assistant replies may contain light markdown (lists, bold, links). Render it
 * with the dash palette — mirrors ScriptMarkdown but tuned for chat density.
 */
export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-dash-ink">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-1.5 list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-dash-ink">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => (
            <h3 className="mb-1.5 mt-3 text-sm font-bold first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="mb-1.5 mt-3 text-sm font-bold first:mt-0">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="mb-1 mt-3 text-sm font-semibold first:mt-0">
              {children}
            </h5>
          ),
          code: ({ children }) => (
            <code className="rounded bg-dash-bg px-1.5 py-0.5 font-geist-mono text-xs text-dash-ink">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-dash-brand underline hover:text-dash-brand-dark"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-dash-brand/40 pl-3 italic text-dash-muted">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-dash-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
