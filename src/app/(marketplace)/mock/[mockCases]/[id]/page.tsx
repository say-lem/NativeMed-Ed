"use client";
import { use, useState } from "react";
import MockHeaderBg from "../_components/MockHeaderBg";
import BackIcon from "../_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function ViewMockCases({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeBtn, setActiveBtn] = useState("Full Case");

  const toggleActiveBtn = (value: string) => {
    setActiveBtn(value);
  };

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={id} />
      </MockHeaderBg>

      <section className="px-8 py-4 ">
        <div className="flex gap-2">
          {["Full Case", "Patient", "Doctor", "Examiner", "Resources"].map(
            (item) => (
              <button
                key={item}
                className={`text-subtle-text font-semibold leading-[120%] tracking-[-1%] px-4 pb-2.5 ${
                  activeBtn === item ? "border-b-2 border-subtle-text" : ""
                }`}
                onClick={() => toggleActiveBtn(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </section>
    </>
  );
}
