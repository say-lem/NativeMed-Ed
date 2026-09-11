import { Download, ExternalLink, FileText, Link2 } from "lucide-react";
import type { FreeProduct } from "@/types/api";

export default function FreeProductCard({ product }: { product: FreeProduct }) {
  const isPdf = product.type === "pdf";

  return (
    <div className="flex flex-col gap-3 py-5 px-5 sm:py-6 sm:px-6 rounded-[16px] bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)]">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-9 rounded-full bg-primary-100 text-white shrink-0">
          {isPdf ? <FileText size={16} /> : <Link2 size={16} />}
        </span>
        <p className="font-semibold text-sm sm:text-base leading-[120%] tracking-[-2%] text-black-others">
          {product.title}
        </p>
      </div>

      {product.description && (
        <p className="text-xs sm:text-sm leading-[150%] text-secondary-100 line-clamp-4">
          {product.description}
        </p>
      )}

      {product.fileUrl && (
        <a
          href={product.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 hover:bg-primary-100/90 transition-colors"
        >
          {isPdf ? <Download size={16} /> : <ExternalLink size={16} />}
          {isPdf ? "Download" : "View"}
        </a>
      )}
    </div>
  );
}
