/** Only retrieve PDFs from the storage provider. Never follow redirects to
 * arbitrary hosts, and never serve upstream HTML under our application origin. */
export async function fetchStoredPdf(fileUrl: string): Promise<Response> {
  const url = new URL(fileUrl);
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" ||
      url.port || url.username || url.password) {
    throw new Error("Invalid PDF storage URL");
  }
  const response = await fetch(url, {
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (!response.ok || !response.body ||
      !["application/pdf", "application/octet-stream"].includes(contentType ?? "")) {
    await response.body?.cancel();
    throw new Error("Invalid PDF storage response");
  }
  return response;
}
