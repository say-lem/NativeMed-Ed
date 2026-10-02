import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  CreateLinkFreeProductInput,
  FreeProduct,
  Paginated,
  UpdateFreeProductInput,
} from "@/types/api";

/** GET /free-products — public, paginated, published-only. */
export async function getFreeProducts(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<FreeProduct>>> {
  const res = await api.get<ApiResponse<Paginated<FreeProduct>>>("/free-products", {
    params: { page, limit },
  });
  return res.data;
}

/** GET /free-products/:id — public, published-only. */
export async function getFreeProduct(id: string): Promise<ApiResponse<FreeProduct>> {
  const res = await api.get<ApiResponse<FreeProduct>>(`/free-products/${id}`);
  return res.data;
}

/**
 * Fetches every published page in parallel (mirrors `getAllAdminCases`). There's no
 * `type` filter on the backend — it returns every type mixed together — so splitting
 * blogs from link/pdf resources for the public toggle has to happen after fetching
 * the full set.
 */
export async function getAllFreeProducts(): Promise<FreeProduct[]> {
  const first = await getFreeProducts(1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => getFreeProducts(i + 2, 50)),
  );

  const all = [...items];
  for (const res of rest) if (res.success) all.push(...res.data.items);
  return all;
}

/** GET /admin/free-products — admin, paginated, every product incl. drafts. */
export async function getAdminFreeProducts(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<FreeProduct>>> {
  const res = await api.get<ApiResponse<Paginated<FreeProduct>>>("/admin/free-products", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /admin/free-products — admin. Creates a `link` product (external URL). */
export async function createLinkFreeProduct(
  input: CreateLinkFreeProductInput,
): Promise<ApiResponse<FreeProduct>> {
  const res = await api.post<ApiResponse<FreeProduct>>("/admin/free-products", input);
  return res.data;
}

/** POST /admin/free-products/pdf-link — admin, JSON. Creates a `pdf` product from a file
 *  already uploaded directly to Cloudinary by the browser (see uploads.service.ts). */
export async function registerPdfFreeProduct(payload: {
  title: string;
  description: string;
  fileUrl: string;
  publicId: string;
  order?: number;
}): Promise<ApiResponse<FreeProduct>> {
  const res = await api.post<ApiResponse<FreeProduct>>("/admin/free-products/pdf-link", payload);
  return res.data;
}

/** POST /admin/free-products/upload-blog — admin, multipart. Creates a `blog` product. */
export async function uploadBlogFreeProduct(
  formData: FormData,
): Promise<ApiResponse<FreeProduct>> {
  const res = await api.post<ApiResponse<FreeProduct>>(
    "/admin/free-products/upload-blog",
    formData,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** PATCH /admin/free-products/:id/cover-image — admin, multipart. Replaces a `blog`
 *  product's cover image; 400 if the product isn't a `blog`. */
export async function replaceFreeProductCoverImage(
  id: string,
  file: File,
): Promise<ApiResponse<FreeProduct>> {
  const fd = new FormData();
  fd.append("coverImage", file);
  const res = await api.patch<ApiResponse<FreeProduct>>(
    `/admin/free-products/${id}/cover-image`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** PATCH /admin/free-products/:id — admin. Partial; `fileUrl` rejected for `pdf` products. */
export async function updateFreeProduct(
  id: string,
  input: UpdateFreeProductInput,
): Promise<ApiResponse<FreeProduct>> {
  const res = await api.patch<ApiResponse<FreeProduct>>(`/admin/free-products/${id}`, input);
  return res.data;
}

/** PATCH /admin/free-products/:id/publish|unpublish — admin. */
export async function setFreeProductPublished(
  id: string,
  isPublished: boolean,
): Promise<ApiResponse<FreeProduct>> {
  const res = await api.patch<ApiResponse<FreeProduct>>(
    `/admin/free-products/${id}/${isPublished ? "publish" : "unpublish"}`,
  );
  return res.data;
}

/** DELETE /admin/free-products/:id — admin. Permanent; also removes the Cloudinary asset. */
export async function deleteFreeProduct(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/free-products/${id}`);
  return res.data;
}
