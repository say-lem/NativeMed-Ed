import ReactMarkdown from "react-markdown";

const blockStyles =
  "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_a]:underline [&_a]:text-primary-100";

// Backend content often separates lines with a single "\n", which markdown would
// collapse into one run-on paragraph. Turn those into hard breaks (trailing two
// spaces) so the text renders the way it was authored. Blank-line-separated
// paragraphs are untouched.
function preserveLineBreaks(md: string): string {
  return md.replace(/([^\n])\n(?!\n)/g, "$1  \n");
}

export function Markdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={`${blockStyles} ${className}`}>
      <ReactMarkdown>{preserveLineBreaks(children)}</ReactMarkdown>
    </div>
  );
}

export function MarkdownInline({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <>{children}</>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
