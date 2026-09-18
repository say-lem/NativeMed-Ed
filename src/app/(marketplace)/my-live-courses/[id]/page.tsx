import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Mail,
  MessageCircle,
  Music,
  Send,
  Video,
} from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { getLiveCourse, getLiveCourseContent } from "@/services/liveCourses.service";
import { getLiveCourseAccess } from "@/lib/access";
import type { Lesson, LiveCourse } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadCourse(id: string): Promise<LiveCourse | null> {
  try {
    const res = await getLiveCourse(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-live-course] fetch error:", err.code, err.message);
    return null;
  }
}

async function loadContent(id: string): Promise<Lesson[]> {
  try {
    const res = await getLiveCourseContent(id);
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-live-course/content] fetch error:", err.code, err.message);
    return [];
  }
}

const KIND_ICON = { pdf: FileText, video: Video, audio: Music } as const;

export default async function LiveCourseAccessPage({ params }: PageProps) {
  const { id } = await params;
  const [course, access] = await Promise.all([loadCourse(id), getLiveCourseAccess(id)]);

  if (!access.hasAccess) redirect(`/live-courses/${id}`);

  const lessons = (await loadContent(id)).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={course?.title ?? "Live course content"} />
        <p className="text-white/80 text-sm sm:text-base">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </p>
      </BannerBg>

      <section className="px-4 sm:px-8 lg:px-15 py-6 sm:py-8 space-y-6">
        <Link
          href="/my-live-courses"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to My Live Courses
        </Link>

        {/* Beyond the itemized lessons below, the course also shares a Google Drive
            folder on purchase — the backend grants Viewer access directly and never
            exposes the folder URL to the client. */}
        <div className="flex items-start gap-3 rounded-[16px] border border-primary-20 bg-primary-10 p-5">
          <Mail size={20} className="text-primary-100 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-black-others">
              Also check your email for extra materials
            </p>
            <p className="text-sm leading-[150%] text-subtle-text">
              You&apos;ve been given Viewer access to this live course&apos;s Google
              Drive folder — look for an invite from Google Drive at the email address on
              your account, or find it under &quot;Shared with me&quot; in Drive.
            </p>
          </div>
        </div>

        {(course?.telegramChannel || course?.whatsappChannel) && (
          <div className="flex flex-wrap gap-3">
            {course?.telegramChannel && (
              <a
                href={course.telegramChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#229ED9] text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                <Send size={16} /> Telegram
              </a>
            )}
            {course?.whatsappChannel && (
              <a
                href={course.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        )}

        {lessons.length === 0 ? (
          <p className="text-center text-subtle-text py-16">
            No lessons have been added to this live course yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {lessons.map((lesson) => {
              const kind = lesson.type === "video" || lesson.type === "audio" ? lesson.type : "pdf";
              const external = kind !== "pdf";
              const Icon = KIND_ICON[kind];

              const inner = (
                <>
                  <span className="grid place-items-center size-10 rounded-full bg-primary-10 text-primary-100 shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black-others truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-subtle-text capitalize">
                      {lesson.type}
                      {lesson.duration != null
                        ? ` · ${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, "0")}`
                        : ""}
                    </p>
                  </div>
                  {external ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-subtle-text shrink-0">
                      <ExternalLink size={14} /> Open in Drive
                    </span>
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-subtle-text shrink-0"
                    />
                  )}
                </>
              );

              const rowClass =
                "flex items-center gap-4 rounded-[12px] border border-gray-1 bg-white p-4 hover:border-black-others transition-colors";

              return (
                <li key={lesson._id}>
                  {external ? (
                    lesson.fileUrl ? (
                      <a
                        href={lesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div
                        className={`${rowClass} opacity-70 pointer-events-none`}
                      >
                        {inner}
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/my-live-courses/${id}/${lesson._id}`}
                      className={rowClass}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
