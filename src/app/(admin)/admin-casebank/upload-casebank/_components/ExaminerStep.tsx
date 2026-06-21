"use client";
import { FormCard, SectionHeading, TextArea } from "./fields";
import ManagementSteps from "./ManagementSteps";

export default function ExaminerStep() {
  return (
    <div className="space-y-4">
      <SectionHeading text="Marking Scheme" />
      <FormCard>
        <TextArea
          label="Data Gathering and Diagnosis"
          name="dataGathering"
          placeholder="Data Gathering and Diagnosis"
        />
        <TextArea
          label="Expected Diagnosis:"
          name="expectedDiagnosis"
          placeholder="Expected Diagnosis:"
        />
      </FormCard>

      <FormCard>
        <TextArea
          label="Explanation to Patient"
          name="exampleExplanation"
          placeholder="Explanation to Patient"
        />
      </FormCard>

      <SectionHeading text="Management" />
      <FormCard>
        <ManagementSteps />
      </FormCard>

      <FormCard>
        <TextArea
          label="Learning Points from this Station"
          name="learningPoints"
          placeholder="Learning Points"
        />
      </FormCard>
    </div>
  );
}
