import { NextRequest } from "next/server";
import { getFreeProduct } from "@/services/freeProducts.service";
import { slugify } from "@/lib/slug";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Proxy for a free PDF download. The backend's signed Cloudinary URL has no filename
 * extension (`Content-Disposition: attachment; filename="<publicId>"` — no `.pdf`), which
 * many OSes/browsers can't open without a file association. This route streams the same
 * bytes through our server with a proper `<title>.pdf` filename instead.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let fileUrl: string | undefined;
  let title = "download";
  try {
    const res = await getFreeProduct(id);
    if (!res.success || res.data.type !== "pdf") {
      return new Response("Not found", { status: 404 });
    }
    fileUrl = res.data.fileUrl;
    title = res.data.title;
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!fileUrl) return new Response("Not found", { status: 404 });

  const upstream = await fetch(fileUrl);
  if (!upstream.ok || !upstream.body) {
    console.error(
      "[free-product-download] upstream fetch failed:",
      upstream.status,
      fileUrl,
    );
    return new Response("Upstream error", { status: 502 });
  }

  const filename = `${slugify(title) || "download"}.pdf`;

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
