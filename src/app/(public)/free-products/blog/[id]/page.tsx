import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/shared/Markdown";
import { formatDate } from "@/lib/date";
import { getFreeProduct } from "@/services/freeProducts.service";
import type { FreeProduct } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadBlog(id: string): Promise<FreeProduct | null> {
  try {
    const res = await getFreeProduct(id);
    if (!res.success) return null;
    return res.data.type === "blog" ? res.data : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[free-products/blog] fetch error:", err.code, err.message);
    return null;
  }
}

export default async function FreeProductBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await loadBlog(id);

  if (!blog) {
    return (
      <section className="px-4 sm:px-8 lg:px-15 py-24 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-black-others">Post not found</h1>
        <p className="text-subtle-text">
          This blog post may have been removed or is no longer available.
        </p>
        <Link
          href="/free-products"
          className="inline-block text-primary-100 font-semibold hover:underline"
        >
          Back to free products
        </Link>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/free-products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-100 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to free products
        </Link>

        <h1 className="mt-4 font-semibold text-2xl sm:text-3xl md:text-4xl tracking-[-2%] leading-[1.3] text-black-others">
          {blog.title}
        </h1>
        <p className="mt-2 text-sm text-subtle-text">{formatDate(blog.createdAt)}</p>

        {blog.coverImageUrl && (
          <div className="relative w-full aspect-video mt-6 rounded-[16px] overflow-hidden">
            <Image
              src={blog.coverImageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="mt-8 text-sm sm:text-base leading-[170%] text-secondary-100">
          <Markdown>{blog.content ?? ""}</Markdown>
        </div>
      </div>
    </section>
  );
}
