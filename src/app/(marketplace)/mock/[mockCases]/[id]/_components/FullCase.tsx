import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import Resources from "./Resources";
import Doctor from "./Doctor";
import Examiner from "./Examiner";
import Patient from "./Patient";

export default function FullCase({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <div className="space-y-8">
      <Doctor mockData={mockData} />
      <Patient mockData={mockData} />
      <Examiner mockData={mockData} />
      <Resources mockData={mockData} />
    </div>
  );
}
