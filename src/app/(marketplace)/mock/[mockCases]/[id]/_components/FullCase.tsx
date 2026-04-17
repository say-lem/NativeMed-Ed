import { MockCasesPresentation } from "@/types/MockCasesPresentation";
import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText, MockNormalText, MockTagText } from "./MockText";
import Resources from "./Resources";

export default function FullCase({
  mockData,
}: {
  mockData: MockCasesPresentation;
}) {
  return (
    <>
      <MockHeaderText text="Patient Data" />

      <MockCasesBorder>
        <div className="flex gap-20">
          <aside className="space-y-2">
            <MockTagText text="Patient Name" />
            <MockNormalText text={mockData.name} />
          </aside>
          <aside className="space-y-2">
            <MockTagText text="Patient Gender" />
            <MockNormalText text={mockData.gender} />
          </aside>
          <aside className="space-y-2">
            <MockTagText text="Patient Age" />
            <MockNormalText text={JSON.stringify(mockData.age)} />
          </aside>
        </div>

        <div className="space-y-2">
          <MockTagText text="Past Medical History" />
          {mockData.medicalHistory.map((history) => (
            <li key={history} className="px-4  list-disc list-inside">
              <MockNormalText text={history} />
            </li>
          ))}
        </div>

        <div>
          <MockTagText text="Drug and Allergy History" />
          {mockData.drugAndAllergyHistory.map((allergy) => (
            <li key={allergy} className="px-4  list-disc list-inside">
              <MockNormalText text={allergy} />
            </li>
          ))}
        </div>

        <div>
          <MockTagText text="Recent Notes/Consultation" />
          <MockCasesPurpleBg>dj</MockCasesPurpleBg>
        </div>
      </MockCasesBorder>

      <Resources mockData={mockData} />
    </>
  );
}
