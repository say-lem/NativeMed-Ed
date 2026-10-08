import type { Activity, ActivityProduct } from "@/types/api";

export interface ActivityProductOption {
  value: string;
  title: string;
  isPublished: boolean;
}

export function activityProduct(event: Activity): ActivityProduct | null {
  // An explicit null clears the attachment; only older records need the fallback.
  if (event.product !== undefined) return event.product;
  return event.courseId ? { type: "course", id: event.courseId } : null;
}

export function activityProductValue(product: ActivityProduct | null): string {
  if (!product) return "";
  return product.type === "case_bank" ? "case_bank" : `${product.type}:${product.id}`;
}

export function activityProductHref(product: ActivityProduct): string {
  switch (product.type) {
    case "course":
    case "live_course":
      return `/products/${product.id}`;
    case "one_on_one":
      return `/one-on-one/${product.id}`;
    case "case_bank":
      return "/products/case-bank";
    case "free_product":
      return `/free-products/${product.id}`;
  }
}
