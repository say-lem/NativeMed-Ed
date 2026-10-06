import type { PdfUploadSignature } from "@/types/api";

/** Uploads a PDF straight from the browser to Cloudinary using a signature minted by
 *  `getPdfUploadSignatureAction` — the file never passes through our Next.js server, so
 *  it isn't subject to Vercel's 4.5MB function body-size cap. The fields sent here must
 *  match exactly what the backend signed (`timestamp`, `folder`, `public_id`, `type`). */
export async function uploadPdfDirect(
  file: File,
  sig: PdfUploadSignature,
): Promise<{ secure_url: string; public_id: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  fd.append("public_id", sig.publicId);
  fd.append("type", sig.type);

  const res = await fetch(sig.uploadUrl, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Upload to Cloudinary failed");
  }
  return { secure_url: json.secure_url, public_id: json.public_id };
}
