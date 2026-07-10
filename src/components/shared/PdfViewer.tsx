"use client";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

// Bundle the worker locally (no external CDN) so it works offline / under CSP.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full select-none"
    >
      {error ? (
        <p className="text-center text-subtle-text py-16">
          We couldn&apos;t load this document. Please try again in a moment.
        </p>
      ) : (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => setError(true)}
          loading={
            <div className="flex justify-center py-16 text-subtle-text">
              <Loader2 className="size-6 animate-spin" />
            </div>
          }
          className="flex flex-col items-center gap-4"
        >
          {width > 0 &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={Math.min(width, 900)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md rounded-[4px] overflow-hidden"
              />
            ))}
        </Document>
      )}
    </div>
  );
}
