import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText } from "./MockText";

export function PlusIconSvg() {
  return (
    <svg
      width="8"
      height="10"
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

export default function Examiner({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  console.log(mockData);
  return (
    <>
      <MockHeaderText text="Marking Scheme" />

      <MockCasesBorder>
        <div className="space-y-4">
          <h3 className="font-semibold text-sm sm:text-base leading-6 ">
            Data Gathering and Diagnosis
          </h3>

          {mockData.dataGatheringAndDiagnosis.map((item) => (
            <MockCasesPurpleBg key={item.title}>
              <p className="text-xs sm:text-sm leading-5 text-[#080A0D] font-semibold">
                {item.title}
              </p>

              <div className="space-y-2">
                {item.otherThings.map((item) => (
                  <p className="flex items-center gap-2 text-xs sm:text-sm" key={item}>
                    <PlusIconSvg /> <span>{item}</span>
                  </p>
                ))}
              </div>
            </MockCasesPurpleBg>
          ))}
        </div>
      </MockCasesBorder>

      <div className="mt-8">
        <MockHeaderText text="Example of Explanation to Patient" />
      </div>
      <MockCasesBorder>
        <MockCasesPurpleBg>
          {mockData.patientExplanation
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => (
              <p
                key={index}
                className="text-sm sm:text-base leading-[150%] "
                style={{ marginBottom: 12 }}
              >
                {line}
              </p>
            ))}
        </MockCasesPurpleBg>
      </MockCasesBorder>

      <div className="mt-8">
        <MockHeaderText text="Management" />
      </div>
      <MockCasesBorder>
        {mockData.management.map((item, index) => (
          <MockCasesPurpleBg key={index}>
            <p className="flex gap-2 align-baseline">
              <span className="size-5 sm:size-6 p-3 sm:p-4 rounded-full bg-[#992E6C] text-white flex items-center justify-center font-semibold text-xs sm:text-sm leading-5">
                {index + 1}
              </span>

              <span className="leading-6 text-xs sm:text-sm lg:text-[15px] text-[#080A0D]">
                {item}
              </span>
            </p>
          </MockCasesPurpleBg>
        ))}

        <div className="bg-[#FFF6FC] text-[#C11616] border-[0.5px] p-4 border-[#992E6C] rounded-[10px] space-y-2">
          <p className="font-semibold text-xs sm:text-sm leading-5"> Safety Net:</p>
          <p className="text-xs sm:text-sm leading-5">{mockData.safetyNet}</p>
        </div>
      </MockCasesBorder>

      <div className="mt-8">
        <MockHeaderText text="Learning Points From This Station" />
      </div>
      <MockCasesBorder>
        <MockCasesPurpleBg>
          {mockData.learningPoints
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => (
              <p
                key={index}
                className="text-sm sm:text-base leading-[150%] "
                style={{ marginBottom: 12 }}
              >
                {line}
              </p>
            ))}
        </MockCasesPurpleBg>
      </MockCasesBorder>
    </>
  );
}
