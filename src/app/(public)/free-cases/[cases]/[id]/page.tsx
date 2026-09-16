import axios from "axios";
import { Suspense } from "react";
import MockHeaderBg from "@/app/(marketplace)/full-cases/[cases]/_components/MockHeaderBg";
import BackIcon from "@/app/(marketplace)/full-cases/[cases]/_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import MocKCasesNavState from "@/app/(marketplace)/full-cases/[cases]/[id]/_components/MockCasesNavState";
import CaseNav from "@/app/(marketplace)/full-cases/[cases]/[id]/_components/CaseNav";
import { adaptCase } from "@/app/(marketplace)/full-cases/[cases]/[id]/_components/adaptCase";
import { getCase } from "@/services/cases.service";
import type { CaseDetail } from "@/types/api";

const ROOT_PATH = "/free-cases";

interface PageProps {
  params: Promise<{ cases: string; id: string }>;
}

async function loadCase(id: string): Promise<CaseDetail | null> {
  try {
    const res = await getCase(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-case-detail] fetch error:", err.code, err.message);
    } else {
      console.error("[free-case-detail] unexpected error:", err);
    }
    return null;
  }
}

function Badge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] sm:text-xs font-semibold leading-none ${className}`}
    >
      {label}
    </span>
  );
}

export default async function PublicViewMockCases({ params }: PageProps) {
  const { cases: slug, id } = await params;
  const detail = await loadCase(id);
  const color = "#2D135C";

  // Same access rule as the member Case Bank: the backend decides who can see which
  // case (free preview vs. subscriber/admin) — this page never paywalls on its own.
  // A case outside what this visitor may view simply comes back as "not found".
  if (!detail) {
    return (
      <>
        <MockHeaderBg>
          <div className="self-start">
            <BackIcon />
          </div>
          <BannerTitleCase text="Case not available" />
        </MockHeaderBg>
        <section className="px-4 sm:px-6 lg:px-8 py-12 text-center text-subtle-text">
          We couldn&apos;t load this case. It may have been removed, or it&apos;s part of
          the full Case Bank — subscribe from the Case Bank page to unlock every case.
        </section>
      </>
    );
  }

  const mockData = adaptCase(detail);

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={detail.title} />

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
          <Badge
            label={`Station ${detail.stationNumber}`}
            className="bg-white/15 text-white border-white/30"
          />
          <Badge
            label={detail.specialty}
            className="bg-white/15 text-white border-white/30"
          />
          {detail.consultationType && (
            <Badge
              label={detail.consultationType}
              className="bg-white/15 text-white border-white/30"
            />
          )}
        </div>
      </MockHeaderBg>

      <section className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <MocKCasesNavState color={color} mockData={mockData} />
      </section>

      <Suspense fallback={null}>
        <CaseNav slug={slug} currentId={id} specialty={detail.specialty} rootPath={ROOT_PATH} />
      </Suspense>
    </>
  );
}
