import { MockCasesPresentation } from "@/types/MockCasesPresentation";
import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText } from "./MockText";

export default function Examiner({
  mockData,
}: {
  mockData: MockCasesPresentation;
}) {
  console.log(mockData);
  return (
    <>
      <MockHeaderText text="Marking Scheme" />

      <MockCasesBorder>
        <div className="space-y-4">
          <h3 className="font-semibold leading-6 ">
            Data Gathering and Diagnosis
          </h3>
          <MockCasesPurpleBg>hh</MockCasesPurpleBg>
          <MockCasesPurpleBg>hh</MockCasesPurpleBg>
        </div>
      </MockCasesBorder>
    </>
  );
}
