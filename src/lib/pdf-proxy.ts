/**
 * Only retrieve PDFs from the storage provider. Never follow redirects to
 * arbitrary hosts, and never serve upstream HTML under our application origin.
 *
 * Forwards an incoming `Range` header to Cloudinary (verified to return real
 * `206 Partial Content` + `Content-Range` on signed raw/download URLs) so pdf.js
 * can stream pages instead of blocking on the whole file.
 */
export async function fetchStoredPdf(fileUrl: string, range?: string | null): Promise<Response> {
  const url = new URL(fileUrl);
  // Signed raw downloads use the API host, not the delivery CDN host.
  const allowedStorageEndpoint = url.hostname === "res.cloudinary.com" ||
    (url.hostname === "api.cloudinary.com" &&
      /^\/v1_1\/[a-zA-Z0-9_-]+\/raw\/download$/.test(url.pathname));
  if (url.protocol !== "https:" || !allowedStorageEndpoint ||
      url.port || url.username || url.password) {
    throw new Error("Invalid PDF storage URL");
  }
  const response = await fetch(url, {
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
    headers: range ? { Range: range } : undefined,
  });
  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (!response.ok || !response.body ||
      !["application/pdf", "application/octet-stream"].includes(contentType ?? "")) {
    await response.body?.cancel();
    throw new Error("Invalid PDF storage response");
  }
  return response;
}
