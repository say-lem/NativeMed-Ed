import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import { PatientBriefSection } from "./sections";

export default function Patient({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return <PatientBriefSection mockData={mockData} />;
}
