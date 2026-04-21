import { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";
import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText, MockNormalText, MockTagText } from "./MockText";

function PurpleBgText({ title, desc }: { title: string; desc: string }) {
  return (
    <p>
      <span className="text-black-others font-medium text-sm leading-[150%] tracking-[-1%]">
        {title}
      </span>{" "}
      <span className="text-sm leading-[150%] tracking-[-1%]">{desc}</span>
    </p>
  );
}

export default function Doctor({
  mockData,
}: {
  mockData: TypeMockCasesPresentation;
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
          <MockCasesPurpleBg>
            {mockData.recentNotes.map((data) => (
              <div key={data.time} className="">
                <p className="font-semibold text-sm leading-[150%] tracking-[-1%] text-black-others">
                  {data.time} (seen by {data.doctor})
                </p>

                <PurpleBgText
                  title="Presenting Complaint:"
                  desc={data.complaint}
                />

                <PurpleBgText title="Exammination:" desc={data.examination} />

                <PurpleBgText title="Plan:" desc={data.Plan} />
              </div>
            ))}
          </MockCasesPurpleBg>
        </div>

        <div>
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-2">
            {/* Header */}
            <div className="grid grid-cols-3 bg-[#FFF4FB] border-b-[0.2px] border-gray-2 px-4 py-3">
              {["Test", "Result", "Reference Range"].map((heading) => (
                <span
                  key={heading}
                  className="text-sm font-semibold leading-[150%] tracking-[-1%] text-black-others"
                >
                  {heading}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="bg-white divide-y-[0.2px] divide-gray-2">
              {mockData.investigationResults.tableData.map((row) => (
                <div key={row.test} className="grid grid-cols-3 px-4 py-3">
                  <span className="text-sm leading-[150%] tracking-[-1%] text-subtle-2">
                    {row.test}
                  </span>
                  <span className="text-sm leading-[150%] tracking-[-1%] text-subtle-2">
                    {row.result}
                  </span>
                  <span className="text-sm leading-[150%] tracking-[-1%] text-subtle-2">
                    {row.referenceRange}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="bg-white border-t-[0.2px] border-gray-2 px-4 py-3">
              <span className="text-sm leading-[150%] tracking-[-1%] text-[#0A0A0A]">
                {mockData.investigationResults.normalResults}
              </span>
            </div>
          </div>
        </div>
      </MockCasesBorder>
    </>
  );
}
