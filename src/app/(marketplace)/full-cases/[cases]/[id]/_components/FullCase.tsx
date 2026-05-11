import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import {
  ExampleExplanationSection,
  LearningPointsSection,
  ManagementSection,
  MarkingSchemeSection,
  PatientBriefSection,
  PatientDataSection,
  ResourcesSection,
} from "./sections";

export default function FullCase({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return (
    <div className="space-y-8">
      <PatientDataSection mockData={mockData} />
      <PatientBriefSection mockData={mockData} />
      <MarkingSchemeSection mockData={mockData} />
      <ManagementSection mockData={mockData} />
      <ExampleExplanationSection mockData={mockData} />
      <LearningPointsSection mockData={mockData} />
      <ResourcesSection mockData={mockData} />
    </div>
  );
}
