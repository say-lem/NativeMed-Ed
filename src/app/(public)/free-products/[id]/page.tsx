import axios from "axios";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getFreeProduct } from "@/services/freeProducts.service";
import FreeProductCard from "../_components/FreeProductCard";

/** Resolve event attachments without storing expiring file URLs in events. */
export default async function FreeProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getFreeProduct(id).then((res) => res.success ? res.data : null).catch((err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  });
  if (!product || !product.isPublished) notFound();
  if (product.type === "blog") redirect(`/free-products/blog/${product._id}`);

  return (
    <section className="px-4 sm:px-8 lg:px-15 py-12 space-y-6 max-w-3xl mx-auto">
      <Link href="/free-products" className="text-primary-100 font-semibold hover:underline">Back to free products</Link>
      <h1 className="text-2xl font-semibold text-black-others">{product.title}</h1>
      <FreeProductCard product={product} />
    </section>
  );
}
