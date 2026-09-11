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

/** POST /admin/free-products/upload-pdf — admin, multipart. Creates a `pdf` product. */
export async function uploadPdfFreeProduct(
  formData: FormData,
): Promise<ApiResponse<FreeProduct>> {
  // Let axios derive the multipart boundary (override the JSON default).
  const res = await api.post<ApiResponse<FreeProduct>>(
    "/admin/free-products/upload-pdf",
    formData,
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
