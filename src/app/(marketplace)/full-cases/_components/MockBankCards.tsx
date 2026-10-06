import Image from "next/image";
import Link from "next/link";
import { FaStethoscope } from "react-icons/fa";
import { MdApps } from "react-icons/md";
import { slugify } from "@/lib/slug";
import type { Specialty } from "@/types/api";

const DEFAULT_FALLBACK_BG = "#F4F5F7";

// Keyed by the exact specialty string the backend returns (lowercased).
// Source of truth is the live GET /cases/specialties (16 specialties as of 2026-06-20),
// which is broader than the backend doc's list. See CLAUDE.md §4.
const SPECIALTY_IMAGES: Record<string, string> = {
  cardiology: "/Images/Cardiology.jpeg",
  "dermatology/allergy/immunology": "/Images/Dermatology.jpeg",
  "elderly medicine/ palliative": "/Images/Elderly Medicine.jpeg",
  "endocrine and nephrology": "/Images/Endocrine and Nephrology.jpeg",
  "ent & eye": "/Images/Ent & Eye.jpeg",
  ethics: "/Images/medical ethics.jpeg",
  "gastroenterology/ haematology": "/Images/Gastroenterology and haematology.jpeg",
  genetics: "/Images/Genetics.jpeg",
  "gynaecology/ women's health": "/Images/Gynaecology.jpeg",
  "men's health": "/Images/men's health.jpeg",
  "mental health": "/Images/mental Health.jpeg",
  neurology: "/Images/Neurology.jpeg",
  paediatrics: "/Images/Paediatrics.jpeg",
  respiratory: "/Images/Respiratory.jpeg",
  "rheumatology/ musculoskeletal": "/Images/Rheumatology & Musculoskeletal.jpeg",
  "travel health/ infectious disease": "/Images/Infectious Disease.jpeg",
};

function getSpecialtyImage(name: string): string | undefined {
  return SPECIALTY_IMAGES[name.toLowerCase()];
}

const cardClass =
  "border-[0.2px] p-3 sm:p-4 rounded-[16px] gap-3 sm:gap-4 bg-white border-gray-2 questionBankShadow flex items-center hover:scale-105";

export default function MockCasesCards({
  specialties,
  totalCases,
  emptyMessage,
  rootPath = "/full-cases",
}: {
  specialties: Specialty[];
  totalCases: number;
  emptyMessage?: string;
  /** Lets the public case-bank preview reuse this exact grid with its own base path. */
  rootPath?: string;
}) {
  return (
    <>
      <Link href={`${rootPath}/all`} className={cardClass}>
        <aside
          style={{ backgroundColor: "#EEE9F7" }}
          className="flex rounded-full p-4 shrink-0"
        >
          <MdApps className="size-7 text-primary-100" />
        </aside>
        <aside className="space-y-0.5 min-w-0">
          <p className="font-semibold text-base sm:text-lg leading-[120%] tracking-[-2%] text-black-others">
            All Cases
          </p>
          <p className="text-sm text-subtle-text leading-[150%]">
            {totalCases} {totalCases === 1 ? "Case" : "Cases"}
          </p>
        </aside>
      </Link>

      {specialties.length === 0 && (
        <p className="col-span-full sm:col-span-1 md:col-span-2 text-center text-subtle-text py-8">
          {emptyMessage ?? "No specialties available right now."}
        </p>
      )}

      {specialties.map((item) => {
        const imagePath = getSpecialtyImage(item.specialty);
        const slug = slugify(item.specialty);

        return (
          <Link
            href={`${rootPath}/${slug}`}
            key={item.specialty}
            className={cardClass}
          >
            {imagePath ? (
              <aside className="relative size-15 rounded-full overflow-hidden shrink-0">
                <Image
                  src={imagePath}
                  alt={item.specialty}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              </aside>
            ) : (
              <aside
                style={{ backgroundColor: DEFAULT_FALLBACK_BG }}
                className="flex rounded-full p-4 shrink-0"
                aria-hidden
              >
                <FaStethoscope className="size-7 text-[#5E5E5E]" />
              </aside>
            )}
            <aside className="space-y-0.5 min-w-0">
              <p className="font-semibold text-base sm:text-lg leading-[120%] tracking-[-2%] text-black-others wrap-break-word">
                {item.specialty}
              </p>
              <p className="text-sm text-subtle-text leading-[150%]">
                {item.count} {item.count === 1 ? "Case" : "Cases"}
              </p>
            </aside>
          </Link>
        );
      })}
    </>
  );
}
