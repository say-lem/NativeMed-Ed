import Link from "next/link";
import type { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText, MockNormalText, MockTagText } from "./MockText";
import { Markdown, MarkdownInline } from "@/components/shared/Markdown";

const PLACEHOLDER = "—";

function isPresent(value: string | undefined): boolean {
  return Boolean(value && value !== PLACEHOLDER);
}

function PlusIconSvg() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.81153 3.20013L7.97852 3.20013V4.93346H4.81153V9.5L3.14486 9.5V4.93346H0V3.20013H3.14486V0H4.81153V3.20013Z"
        fill="#6F6F6F"
      />
    </svg>
  );
}

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

export function PatientDataSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <>
      <MockHeaderText text="Patient Data" />
      <MockCasesBorder>
        <div className="flex flex-wrap gap-6 sm:gap-10 lg:gap-20">
          <aside className="space-y-2">
            <MockTagText text="Patient Name" />
            <MockNormalText text={mockData.name} />
          </aside>
          <aside className="space-y-2">
            <MockTagText text="Patient Gender" />
            <MockNormalText text={mockData.gender} />
          </aside>
          <aside className="space-y-2">
            <MockTagText text="Patient Age" />
            <MockNormalText text={String(mockData.age)} />
          </aside>
        </div>

        {mockData.medicalHistory.length > 0 && (
          <div className="space-y-2">
            <MockTagText text="Past Medical History" />
            <ul className="space-y-1">
              {mockData.medicalHistory.map((history) => (
                <li key={history} className="px-4 list-disc list-inside">
                  <MockNormalText text={history} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {mockData.drugAndAllergyHistory.length > 0 && (
          <div className="space-y-2">
            <MockTagText text="Drug and Allergy History" />
            <ul className="space-y-1">
              {mockData.drugAndAllergyHistory.map((entry) => (
                <li key={entry} className="px-4 list-disc list-inside">
                  <MockNormalText text={entry} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {mockData.recentNotes.length > 0 && (
          <div>
            <MockTagText text="Recent Notes/Consultation" />
            <MockCasesPurpleBg>
              {mockData.recentNotes.map((data, idx) => (
                <div key={idx} className="space-y-2">
                  {isPresent(data.doctor) && (
                    <p className="font-semibold text-xs sm:text-sm leading-[150%] tracking-[-1%] text-black-others">
                      {data.doctor}
                    </p>
                  )}
                  {isPresent(data.complaint) && (
                    <div className="text-xs sm:text-sm leading-[150%] tracking-[-1%] text-black-others">
                      <Markdown>{data.complaint}</Markdown>
                    </div>
                  )}
                  {isPresent(data.examination) && (
                    <p className="text-xs sm:text-sm leading-[150%] tracking-[-1%]">
                      <span className="text-black-others font-medium">
                        Examination:
                      </span>{" "}
                      <span>{data.examination}</span>
                    </p>
                  )}
                  {isPresent(data.Plan) && (
                    <p className="text-xs sm:text-sm leading-[150%] tracking-[-1%]">
                      <span className="text-black-others font-medium">
                        Plan:
                      </span>{" "}
                      <span>{data.Plan}</span>
                    </p>
                  )}
                </div>
              ))}
            </MockCasesPurpleBg>
          </div>
        )}

        {mockData.investigationResults.tableData.length > 0 && (
          <div>
            <MockTagText text="Blood Test Results" />
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-2">
              <div className="grid grid-cols-3 bg-[#FFF4FB] border-b-[0.2px] border-gray-2 px-2 sm:px-4 py-2 sm:py-3">
                {["Test", "Result", "Reference Range"].map((heading) => (
                  <span
                    key={heading}
                    className="text-xs sm:text-sm font-semibold leading-[150%] tracking-[-1%] text-black-others"
                  >
                    {heading}
                  </span>
                ))}
              </div>

              <div className="bg-white divide-y-[0.2px] divide-gray-2">
                {mockData.investigationResults.tableData.map((row) => (
                  <div
                    key={row.test}
                    className="grid grid-cols-3 px-2 sm:px-4 py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm leading-[150%] tracking-[-1%] text-subtle-2">
                      {row.test}
                    </span>
                    <span
                      className={`text-xs sm:text-sm leading-[150%] tracking-[-1%] ${
                        row.isAbnormal
                          ? "text-error-other font-semibold"
                          : "text-subtle-2"
                      }`}
                    >
                      {row.result}
                      {row.isAbnormal ? " ⚠" : ""}
                    </span>
                    <span className="text-xs sm:text-sm leading-[150%] tracking-[-1%] text-subtle-2">
                      {row.referenceRange}
                    </span>
                  </div>
                ))}
              </div>

              {isPresent(mockData.investigationResults.normalResults) && (
                <div className="bg-white border-t-[0.2px] border-gray-2 px-4 py-3">
                  <span className="text-xs sm:text-sm leading-[150%] tracking-[-1%] text-[#0A0A0A]">
                    {mockData.investigationResults.normalResults}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </MockCasesBorder>
    </>
  );
}

export function PatientBriefSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <>
      <MockHeaderText text="Patient Story (Role Player's Brief)" />
      <MockCasesBorder>
        <div
          style={{ backgroundColor: "#FFF6FC", borderColor: "#992E6C" }}
          className="border-[0.5px] p-4 rounded-[8px] text-black-others"
        >
          <Markdown className="text-sm sm:text-base leading-[150%] tracking-[-1%] text-black-others">
            {mockData.patientBrief}
          </Markdown>
        </div>
      </MockCasesBorder>
    </>
  );
}

export function MarkingSchemeSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  if (mockData.dataGatheringAndDiagnosis.length === 0) return null;

  return (
    <>
      <MockHeaderText text="Marking Scheme" />
      <MockCasesBorder>
        <div className="space-y-4">
          {mockData.dataGatheringAndDiagnosis.map((item) => (
            <MockCasesPurpleBg key={item.title}>
              <p className="text-sm sm:text-base leading-6 text-[#080A0D] font-semibold">
                {item.title}
              </p>
              <div className="space-y-2">
                {item.otherThings.map((point) => (
                  <p
                    className="flex items-start gap-2 text-sm sm:text-base leading-6 text-[#080A0D]"
                    key={point}
                  >
                    <span className="mt-1.5 shrink-0">
                      <PlusIconSvg />
                    </span>
                    <span>
                      <MarkdownInline>{point}</MarkdownInline>
                    </span>
                  </p>
                ))}
              </div>
            </MockCasesPurpleBg>
          ))}
        </div>
      </MockCasesBorder>
    </>
  );
}

export function ManagementSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  const hasSafetyNet =
    Boolean(mockData.safetyNet) && mockData.safetyNet !== "—";
  if (mockData.management.length === 0 && !hasSafetyNet) return null;

  return (
    <>
      <MockHeaderText text="Management" />
      <MockCasesBorder>
        <MockCasesPurpleBg>
          <ul className="space-y-3">
            {mockData.management.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm sm:text-base leading-6 text-[#080A0D]"
              >
                <span className="mt-2 size-2 rounded-full bg-[#992E6C] shrink-0" />
                <span className="flex-1">
                  <MarkdownInline>{item}</MarkdownInline>
                </span>
              </li>
            ))}
            {hasSafetyNet && (
              <li className="flex items-start gap-3 text-sm sm:text-base leading-6 text-[#080A0D]">
                <span className="mt-2 size-2 rounded-full bg-[#992E6C] shrink-0" />
                <span className="flex-1">
                  <MarkdownInline>
                    {`**Safety net:** ${mockData.safetyNet}`}
                  </MarkdownInline>
                </span>
              </li>
            )}
          </ul>
        </MockCasesPurpleBg>
      </MockCasesBorder>
    </>
  );
}

export function ExampleExplanationSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  if (!mockData.patientExplanation || mockData.patientExplanation === "—") {
    return null;
  }

  return (
    <>
      <MockHeaderText text="Example of Explanation to Patient" />
      <MockCasesBorder>
        <MockCasesPurpleBg>
          <Markdown className="text-sm sm:text-base leading-[150%]">
            {mockData.patientExplanation}
          </Markdown>
        </MockCasesPurpleBg>
      </MockCasesBorder>
    </>
  );
}

export function LearningPointsSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  if (!mockData.learningPoints || mockData.learningPoints === "—") return null;

  return (
    <>
      <MockHeaderText text="Learning Points From This Station" />
      <MockCasesBorder>
        <MockCasesPurpleBg>
          <Markdown className="text-sm sm:text-base leading-[150%]">
            {mockData.learningPoints}
          </Markdown>
        </MockCasesPurpleBg>
      </MockCasesBorder>
    </>
  );
}

export function ResourcesSection({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  if (mockData.furtherReading.length === 0) return null;

  return (
    <>
      <MockHeaderText text="Resources" />
      <MockCasesBorder>
        <div className="bg-[#FFF6FC] border-[0.5px] p-4 border-[#992E6C] rounded-[10px] space-y-2">
          <p className="text-subtle-2 text-xs sm:text-sm font-semibold leading-5">
            Further Reading:
          </p>
          {mockData.furtherReading.map((data) => (
            <Link
              key={data.url}
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="flex gap-1 items-center text-xs sm:text-sm text-[#992E6C] hover:underline wrap-break-word"
            >
              <LinkSvg />
              <span>{data.title}</span>
            </Link>
          ))}
        </div>
      </MockCasesBorder>
    </>
  );
}
