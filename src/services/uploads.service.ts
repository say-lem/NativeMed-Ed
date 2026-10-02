import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, PdfUploadSignature, PdfUploadTarget } from "@/types/api";

/** POST /admin/uploads/pdf-signature — admin. Issues a signed Cloudinary upload request
 *  for one of the whitelisted PDF destinations, so the browser can send the file bytes
 *  straight to Cloudinary instead of through this server. */
export async function getPdfUploadSignature(
  target: PdfUploadTarget,
): Promise<ApiResponse<PdfUploadSignature>> {
  const res = await api.post<ApiResponse<PdfUploadSignature>>("/admin/uploads/pdf-signature", {
    target,
  });
  return res.data;
}
