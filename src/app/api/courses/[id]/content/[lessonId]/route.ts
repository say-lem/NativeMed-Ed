import { NextRequest } from "next/server";
import { getCourseContent } from "@/services/courses.service";
import { getCourseAccess } from "@/lib/access";
import { includesLectures } from "@/lib/tiers";

interface RouteParams {
  params: Promise<{ id: string; lessonId: string }>;
}

/**
 * Access-checked proxy for a course lesson file. Streams the file from
 * Cloudinary through our server so the real URL is never exposed to the client,
 * and enforces course access (+ tier) on every request. `inline` disposition so
 * it renders in our viewer rather than downloading.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id, lessonId } = await params;

  const access = await getCourseAccess(id);
  if (!access.hasAccess) {
    return new Response("Forbidden", { status: 403 });
  }

  let fileUrl: string | undefined;
  let type: string | undefined;
  try {
    const res = await getCourseContent(id);
    if (!res.success) return new Response("Not found", { status: 404 });
    const lesson = res.data.find((l) => l._id === lessonId);
    fileUrl = lesson?.fileUrl;
    type = lesson?.type;
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!fileUrl) return new Response("Not found", { status: 404 });

  // Video lessons (Google Drive) require the tier that includes lectures.
  // TODO(Phase 6): once course content carries a lecture/mock-session category, gate on
  // that instead of file type — `type` is format (pdf/video), not what the tier buys.
  if (type === "video" && !includesLectures(access.tier)) {
    return new Response("Forbidden", { status: 403 });
  }

  const upstream = await fetch(fileUrl);
  if (!upstream.ok || !upstream.body) {
    // e.g. Cloudinary returns 401 "deny or ACL failure" for private assets —
    // the file needs a signed URL / backend stream, which we can't generate here.
    console.error(
      "[content-proxy] upstream fetch failed:",
      upstream.status,
      upstream.headers.get("x-cld-error") ?? "",
      fileUrl,
    );
    return new Response("Upstream error", { status: 502 });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/pdf";

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
