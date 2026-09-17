import axios from "axios";
import Image from "next/image";
import TitleCase from "@/components/shared/TitleCase";
import { Markdown } from "@/components/shared/Markdown";
import { DEFAULT_FOUNDER_BIO, DEFAULT_FOUNDER_TITLE } from "@/lib/legal-content";
import { getFounderBio } from "@/services/homepage.service";

/** Same shape as `FounderBioContent`, but `title`/`content` are always resolved (never
 *  the API's `null`/`""` "unset" state) — the fallback is applied once, here. */
interface ResolvedFounderBio {
  content: string;
  title: string;
  imageUrl: string | null;
  updatedAt: string | null;
}

async function loadFounderBio(): Promise<ResolvedFounderBio> {
  try {
    const res = await getFounderBio();
    if (res.success) {
      return {
        content: res.data.content || DEFAULT_FOUNDER_BIO,
        title: res.data.title || DEFAULT_FOUNDER_TITLE,
        imageUrl: res.data.imageUrl,
        updatedAt: res.data.updatedAt,
      };
    }
    return { content: DEFAULT_FOUNDER_BIO, title: DEFAULT_FOUNDER_TITLE, imageUrl: null, updatedAt: null };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return { content: DEFAULT_FOUNDER_BIO, title: DEFAULT_FOUNDER_TITLE, imageUrl: null, updatedAt: null };
  }
}

async function Founder() {
  const { content, title, imageUrl } = await loadFounderBio();

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-10">
        <aside className="w-full md:basis-2/5">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={imageUrl || "/Images/founder page.png"}
              alt="Founder"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Admin-authored as blank-line-separated groups (name / qualifications /
              "FOUNDER" label) — the first and last groups get distinct styling here,
              same trick as the last-child rule below. */}
          <Markdown
            className={
              "mt-2.5 text-center text-sm sm:text-base lg:text-lg leading-[130%] tracking-[-2%] text-black-others " +
              "[&_p]:mb-1 [&_p:last-child]:mb-0 " +
              "[&_p:first-child]:font-semibold [&_p:first-child]:text-lg sm:[&_p:first-child]:text-xl lg:[&_p:first-child]:text-2xl [&_p:first-child]:mb-2 " +
              "[&_p:last-child]:font-semibold [&_p:last-child]:text-secondary-100 [&_p:last-child]:mt-2"
            }
          >
            {title}
          </Markdown>
        </aside>
        <aside className="w-full md:basis-3/5">
          <TitleCase text="About The Founder" />
          <Markdown className="text-subtle-2 text-sm sm:text-base lg:text-lg leading-[150%] mt-2 sm:mt-3 lg:mt-5">
            {content}
          </Markdown>
        </aside>
      </div>
    </section>
  );
}

export default Founder;
