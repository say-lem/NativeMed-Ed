import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FreeProduct } from "@/types/api";

/** Plain-text excerpt — strips light markdown so the card blurb doesn't show raw `**`/`#`. */
function excerpt(text: string, max = 160): string {
  const plain = text.replace(/[#*_`>-]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

export default function BlogCard({ product }: { product: FreeProduct }) {
  const blurb = product.description || excerpt(product.content ?? "");

  return (
    <Link
      href={`/free-products/blog/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-[16px] bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)] hover:border-primary-100 transition-colors"
    >
      <div className="relative w-full aspect-video bg-gray-100">
        {product.coverImageUrl && (
          <Image
            src={product.coverImageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 p-5 sm:p-6">
        <p className="font-semibold text-sm sm:text-base leading-[120%] tracking-[-2%] text-black-others">
          {product.title}
        </p>
        {blurb && (
          <p className="text-xs sm:text-sm leading-[150%] text-secondary-100 line-clamp-3">
            {blurb}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-100">
          Read more
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
