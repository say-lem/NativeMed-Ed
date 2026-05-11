import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import { PatientDataSection } from "./sections";

export default function Doctor({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return <PatientDataSection mockData={mockData} />;
}
