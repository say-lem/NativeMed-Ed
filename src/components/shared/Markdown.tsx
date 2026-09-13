import ReactMarkdown from "react-markdown";

const blockStyles =
  "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_a]:underline [&_a]:text-primary-100 " +
  "[&_h1]:font-semibold [&_h1]:text-black-others [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-xl sm:[&_h1]:text-2xl " +
  "[&_h2]:font-semibold [&_h2]:text-black-others [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg sm:[&_h2]:text-xl lg:[&_h2]:text-2xl " +
  "[&_h3]:font-semibold [&_h3]:text-black-others [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm sm:[&_h3]:text-base lg:[&_h3]:text-lg";

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
