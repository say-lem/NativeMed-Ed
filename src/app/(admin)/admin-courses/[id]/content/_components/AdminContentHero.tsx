import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function AdminContentHero({ title }: { title: string }) {
  return (
    <section>
      <BannerBg color="#2D135C">
        <Link
          href="/admin-courses"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-2"
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <BannerTitleCase text={`Manage Content — ${title}`} />
      </BannerBg>
    </section>
  );
}
