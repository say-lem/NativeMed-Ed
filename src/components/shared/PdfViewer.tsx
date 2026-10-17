"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

// Bundle the worker locally (no external CDN) so it works offline / under CSP.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Pages within this many slots of an intersecting page also mount, so scrolling
// never shows a placeholder before the real page has had a chance to render.
const BUFFER = 2;

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);
  // height/width ratio, refined once the first page actually loads; A4 default
  // keeps placeholders close to correct size before that so layout barely shifts.
  const [aspectRatio, setAspectRatio] = useState(1.414);
  const [activePages, setActivePages] = useState<Set<number>>(() => new Set([1]));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageRefs = useRef(new Map<number, HTMLDivElement>());

  // Only render pages near the viewport; everything else stays a sized
  // placeholder until it's scrolled close, so a 100-page PDF doesn't have to
  // mount 100 canvases before anything appears.
  useEffect(() => {
    if (!numPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number(entry.target.getAttribute("data-page")));
        if (newlyVisible.length === 0) return;
        setActivePages((prev) => {
          const next = new Set(prev);
          for (const page of newlyVisible) {
            for (let p = Math.max(1, page - BUFFER); p <= Math.min(numPages, page + BUFFER); p++) {
              next.add(p);
            }
          }
          return next;
        });
      },
      { rootMargin: "800px 0px" },
    );
    observerRef.current = observer;
    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [numPages]);

  const registerPageRef = useCallback((page: number, el: HTMLDivElement | null) => {
    const prev = pageRefs.current.get(page);
    if (prev && observerRef.current) observerRef.current.unobserve(prev);
    if (el) {
      pageRefs.current.set(page, el);
      observerRef.current?.observe(el);
    } else {
      pageRefs.current.delete(page);
    }
  }, []);

  const pageWidth = Math.min(width, 900);
  const placeholderHeight = Math.round(pageWidth * aspectRatio);

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
            Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;
              const isActive = activePages.has(pageNumber);
              return (
                <div
                  key={pageNumber}
                  data-page={pageNumber}
                  ref={(el) => registerPageRef(pageNumber, el)}
                  style={{ minHeight: placeholderHeight }}
                  className="w-full flex items-center justify-center"
                >
                  {isActive ? (
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-md rounded-[4px] overflow-hidden"
                      onLoadSuccess={(page) => {
                        if (pageNumber === 1) {
                          setAspectRatio(page.originalHeight / page.originalWidth);
                        }
                      }}
                    />
                  ) : (
                    <div
                      style={{ width: pageWidth, height: placeholderHeight }}
                      className="bg-black/5 rounded-[4px] animate-pulse"
                    />
                  )}
                </div>
              );
            })}
        </Document>
      )}
    </div>
  );
}
