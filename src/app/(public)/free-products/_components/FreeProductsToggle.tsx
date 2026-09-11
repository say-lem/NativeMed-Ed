"use client";
import { useState } from "react";
import BlogCard from "./BlogCard";
import FreeProductCard from "./FreeProductCard";
import type { FreeProduct } from "@/types/api";

type View = "blogs" | "resources";

export default function FreeProductsToggle({
  blogs,
  resources,
}: {
  blogs: FreeProduct[];
  resources: FreeProduct[];
}) {
  const [view, setView] = useState<View>(blogs.length > 0 ? "blogs" : "resources");
  const items = view === "blogs" ? blogs : resources;

  return (
    <>
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex rounded-full border border-primary-20 p-1 bg-[rgba(245,239,255,0.5)]">
          {(
            [
              { id: "blogs" as View, label: `Blogs (${blogs.length})` },
              { id: "resources" as View, label: `Free Resources (${resources.length})` },
            ]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                view === t.id
                  ? "bg-primary-100 text-white"
                  : "text-secondary-100 hover:text-primary-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-subtle-text py-10">
          {view === "blogs" ? "No blog posts yet — check back soon." : "No free resources yet — check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {items.map((product) =>
            product.type === "blog" ? (
              <BlogCard key={product._id} product={product} />
            ) : (
              <FreeProductCard key={product._id} product={product} />
            ),
          )}
        </div>
      )}
    </>
  );
}
