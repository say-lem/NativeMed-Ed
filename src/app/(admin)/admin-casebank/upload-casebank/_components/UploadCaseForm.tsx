"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import Stepper from "./Stepper";
import DoctorStep from "./DoctorStep";
import PatientStep from "./PatientStep";
import ExaminerStep from "./ExaminerStep";
import ResourcesStep from "./ResourcesStep";

const STEPS = ["Doctor", "Patient", "Examiner", "Resources"];

const navBtn =
  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer";

export default function UploadCaseForm() {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-12">
      <Stepper current={step} steps={STEPS} onSelect={setStep} />

      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* All steps stay mounted so field values survive navigation. */}
        <div className={step === 0 ? "" : "hidden"}>
          <DoctorStep />
        </div>
        <div className={step === 1 ? "" : "hidden"}>
          <PatientStep />
        </div>
        <div className={step === 2 ? "" : "hidden"}>
          <ExaminerStep />
        </div>
        <div className={step === 3 ? "" : "hidden"}>
          <ResourcesStep />
        </div>

        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className={`${navBtn} border border-primary-100 text-primary-100`}
            >
              <ArrowLeft size={16} /> Previous
            </button>
          ) : (
            <span />
          )}

          {isLast ? (
            <button type="submit" className={`${navBtn} bg-primary-100 text-white`}>
              Upload <Upload size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className={`${navBtn} bg-primary-100 text-white`}
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
