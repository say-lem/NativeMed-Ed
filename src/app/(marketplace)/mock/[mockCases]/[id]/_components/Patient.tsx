import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import MockCasesBorder from "./MockCasesBorder";
import { MockHeaderText } from "./MockText";

function MockPatientBorder({
  bgColor,
  borderColor,
  children,
}: {
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
      className="border-[0.5px] p-4 rounded-[8px] text-black-others space-y-4"
    >
      {children}
    </div>
  );
}

export default function Patient({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <>
      <MockHeaderText text="Patient Story (Role Player's Brief)" />

      <MockCasesBorder>
        <div className="grid grid-cols-3 gap-4">
          <aside className="col-span-2">
            <MockPatientBorder bgColor="#FFF6FC" borderColor="#992E6C">
              {mockData.patientBrief
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => (
                  <p
                    key={index}
                    className="leading-[150%] tracking-[-1%] text-black-others "
                    style={{ marginBottom: 12 }}
                  >
                    {line}
                  </p>
                ))}
            </MockPatientBorder>
          </aside>

          <aside className="">
            <MockPatientBorder bgColor="white" borderColor="#D6D6D6">
              <h2 className="text-[#6F6F6F] leading-5 font-semibold text-xs mb-3">
                Social History:
              </h2>
              <p className="text-sm leading-6">{mockData.socialHistory}</p>
            </MockPatientBorder>
          </aside>
        </div>

        <MockPatientBorder bgColor="#F4F5F7" borderColor="null">
          <div className="text-black-others text-sm leading-[150%] space-y-4">
            <aside>
              <h2 className="font-semibold">If asked about periods:</h2>
              <p className="font-medium ">Your menstrual cycles are regular</p>
            </aside>
            <aside>
              <h2 className="font-semibold">If asked about supplements:</h2>
              <p className="font-medium ">
                You have ben taking some over-the-counter multivitamins
                recently, thinking you might be low on something like B12 or
                iron.
              </p>
            </aside>
          </div>
        </MockPatientBorder>

        <div className="space-y-4">
          <h2 className="font-semibold leading-[150%] tracking-[-1%] text-black-others space-y-4">
            Patient&apos;s Ideas, Concerns, Expectations:
          </h2>

          {mockData.patientsIdeaConcernExpectation.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <h3 className="uppercase font-bold text-xs leading-5 text-black-others bg-[#FFF4FB] py-1 px-2 rounded-xs">
                {item.tag}:
              </h3>
              <p className="text-subtle-2 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>

        <MockPatientBorder bgColor="#FBE5E7" borderColor="#D70117">
          <h2 className="font-semibold leading-5 text-error-other">
            Important Note:
          </h2>
          <p className="text-sm leading-5 text-[#C11616]">
            {mockData.importantNote}
          </p>
        </MockPatientBorder>

        <MockPatientBorder bgColor="#F4F5F7" borderColor="#5925B3">
          <h2 className="leading-5 font-semibold text-black-others">
            Questions for the Doctor
          </h2>
          {mockData.questionsForDoctor.map((item, index) => (
            <ul className="space-y-4" key={index}>
              <li className="text-sm leading-5 list-disc list-inside text-black-others">
                {item}
              </li>
            </ul>
          ))}
        </MockPatientBorder>
      </MockCasesBorder>
    </>
  );
}
