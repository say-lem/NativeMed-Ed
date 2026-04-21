import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import MockCasesBorder from "./MockCasesBorder";
import { MockHeaderText } from "./MockText";
import Link from "next/link";

function LinkSvg() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.834 9.16634L17.6673 2.33301"
        stroke="#992E6C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.334 5.66699V1.66699H14.334"
        stroke="#992E6C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16602 1.66699H7.49935C3.33268 1.66699 1.66602 3.33366 1.66602 7.50033V12.5003C1.66602 16.667 3.33268 18.3337 7.49935 18.3337H12.4993C16.666 18.3337 18.3327 16.667 18.3327 12.5003V10.8337"
        stroke="#992E6C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Resources({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <>
      <MockHeaderText text="Resources" />

      <MockCasesBorder>
        <div className="bg-[#FFF6FC] border-[0.5px] p-4 border-[#992E6C] rounded-[10px] space-y-2">
          <p className="text-subtle-2 text-sm font-semibold leading-5 ">
            Further Reading:
          </p>
          {mockData.furtherReading.map((data) => (
            <Link
              key={data}
              href="#"
              className="flex gap-1 items-center text-[#992E6C] hover:underline"
            >
              <LinkSvg />
              <span>{data}</span>
            </Link>
          ))}
        </div>
      </MockCasesBorder>
    </>
  );
}
