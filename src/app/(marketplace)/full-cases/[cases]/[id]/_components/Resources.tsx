import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import { ResourcesSection } from "./sections";

export default function Resources({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
}) {
  return <ResourcesSection mockData={mockData} />;
}
