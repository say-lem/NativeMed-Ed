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
export async function GET(_req: NextRequest, { params }: RouteParams) {
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

  const upstream = await fetch(fileUrl);
  if (!upstream.ok || !upstream.body) {
    console.error(
      "[live-course-content-proxy] upstream fetch failed:",
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
