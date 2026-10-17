import { fetchStoredPdf } from "@/lib/pdf-proxy";
import { NextRequest } from "next/server";
import { getLiveCourseContent } from "@/services/liveCourses.service";
import { getLiveCourseAccess } from "@/lib/access";

interface RouteParams {
  params: Promise<{ id: string; lessonId: string }>;
}

/**
 * Access-checked proxy for a live-course lesson file — mirrors
 * `api/courses/[id]/content/[lessonId]/route.ts`. PDF `fileUrl`s are freshly-signed on
 * every `getLiveCourseContent` call and short-lived — never cache this route's response
 * beyond the request. Video/audio lessons are Google-Drive links opened externally from
 * the lesson list, never routed through here.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id, lessonId } = await params;

  const access = await getLiveCourseAccess(id);
  if (!access.hasAccess) {
    return new Response("Forbidden", { status: 403 });
  }

  let fileUrl: string | undefined;
  try {
    const res = await getLiveCourseContent(id);
    if (!res.success) return new Response("Not found", { status: 404 });
    const lesson = res.data.find((l) => l._id === lessonId);
    fileUrl = lesson?.fileUrl;
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!fileUrl) return new Response("Not found", { status: 404 });

  let upstream: Response;
  try {
    upstream = await fetchStoredPdf(fileUrl, req.headers.get("range"));
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "sandbox; default-src 'none'",
    "Accept-Ranges": "bytes",
  });
  const contentLength = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");
  if (contentLength) headers.set("Content-Length", contentLength);
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, { status: upstream.status, headers });
}
