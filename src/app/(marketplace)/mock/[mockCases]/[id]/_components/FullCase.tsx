import { MockCasesPresentation } from "@/types/MockCasesPresentation";
import Resources from "./Resources";
import Doctor from "./Doctor";
import Examiner from "./Examiner";

export default function FullCase({
  mockData,
}: {
  mockData: MockCasesPresentation;
}) {
  return (
    <div className="space-y-8">
      <Doctor mockData={mockData} />
      <Examiner mockData={mockData} />
      <Resources mockData={mockData} />
    </div>
  );
}
