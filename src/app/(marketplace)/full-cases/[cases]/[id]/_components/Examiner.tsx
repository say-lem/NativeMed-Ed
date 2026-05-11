import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import {
  ExampleExplanationSection,
  LearningPointsSection,
  ManagementSection,
  MarkingSchemeSection,
} from "./sections";

export default function Examiner({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <div className="space-y-8">
      <MarkingSchemeSection mockData={mockData} />
      <ExampleExplanationSection mockData={mockData} />
      <ManagementSection mockData={mockData} />
      <LearningPointsSection mockData={mockData} />
    </div>
  );
}
