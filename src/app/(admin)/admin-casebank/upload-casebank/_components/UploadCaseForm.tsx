"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  type FieldErrors,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import Stepper from "./Stepper";
import DoctorStep from "./DoctorStep";
import PatientStep from "./PatientStep";
import ExaminerStep from "./ExaminerStep";
import ResourcesStep from "./ResourcesStep";
import MediaStep from "./MediaStep";
import {
  caseSchema,
  emptyCaseValues,
  type CaseFormValues,
} from "@/lib/schemas/case";
import { buildCasePayload } from "@/lib/case-form";
import { LogoLoaderOverlay } from "@/components/shared/LogoLoader";
import { saveCaseAction, uploadCaseImagesAction } from "../actions";
import type { CaseDetail } from "@/types/api";

const STEPS = ["Doctor", "Patient", "Examiner", "Resources", "Media"];

const STEP_FIELDS: Path<CaseFormValues>[][] = [
  [
    "title",
    "specialty",
    "consultationType",
    "difficulty",
    "stationNumber",
    "patientName",
    "gender",
    "age",
    "pastMedicalHistory",
    "drugHistory",
    "seenBy",
    "recentRole",
    "recentDate",
    "recentNotes",
    "bloodTestSummary",
    "bloodTests",
  ],
  [
    "patientStory",
    "socialHistory",
    "ifAsked",
    "idea",
    "concern",
    "expectation",
    "importantNote",
    "questionsForDoctor",
  ],
  [
    "dataGathering",
    "expectedDiagnosis",
    "exampleExplanation",
    "management",
    "learningPoints",
  ],
  ["resources"],
  [], // Media — image files live outside RHF, nothing to validate.
];

const navBtn =
  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-60";

export default function UploadCaseForm({
  caseId,
  initialValues,
  initialCase,
}: {
  caseId?: string;
  initialValues?: CaseFormValues;
  initialCase?: CaseDetail;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const isLast = step === STEPS.length - 1;

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(
    initialCase?.imageUrl,
  );
  const [stationFile, setStationFile] = useState<File | null>(null);
  const [stationPreview, setStationPreview] = useState<string | undefined>(
    initialCase?.stationImageUrl,
  );

  const onCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };
  const onStation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setStationFile(f);
      setStationPreview(URL.createObjectURL(f));
    }
  };

  const methods = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: initialValues ?? emptyCaseValues,
    mode: "onTouched",
  });

  // On validation failure, jump to the first step that has an error.
  const onError = (errs: FieldErrors<CaseFormValues>) => {
    const idx = STEP_FIELDS.findIndex((fields) =>
      fields.some((f) => f in errs),
    );
    if (idx >= 0) setStep(idx);
    toast.error("Please fix the highlighted fields.");
  };

  const save = (publish: boolean) =>
    methods.handleSubmit(async (values: CaseFormValues) => {
      const payload = {
        ...buildCasePayload(values, initialCase),
        isPublished: publish,
      };
      setSaving(true);
      const result = await saveCaseAction({ id: caseId, payload });
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong");
        setSaving(false);
        return;
      }
      const id = caseId ?? result.caseId;
      if (id && (coverFile || stationFile)) {
        const fd = new FormData();
        if (coverFile) fd.append("image", coverFile);
        if (stationFile) fd.append("stationImage", stationFile);
        const up = await uploadCaseImagesAction(id, fd);
        if (!up.ok) toast.warning(up.message ?? "Image upload failed");
      }
      toast.success(result.message ?? "Saved");
      // Navigate + refresh so the list refetches (Router Cache is per-client;
      // revalidatePath alone won't refetch a cached RSC on push). The overlay
      // is driven by `saving`, not the router, so refresh no longer hangs it —
      // navigation unmounts the form and clears it.
      router.push("/admin-casebank");
      router.refresh();
    }, onError);

  const goNext = async () => {
    const valid = await methods.trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  return (
    <FormProvider {...methods}>
      {saving && (
        <LogoLoaderOverlay
          fixed
          label={caseId ? "Saving changes…" : "Creating case…"}
        />
      )}
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
          <div className={step === 4 ? "" : "hidden"}>
            <MediaStep
              coverPreview={coverPreview}
              stationPreview={stationPreview}
              onCover={onCover}
              onStation={onStation}
            />
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
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={save(false)}
                  className={`${navBtn} border border-primary-100 text-primary-100`}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={save(true)}
                  className={`${navBtn} bg-primary-100 text-white`}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Publish Now
                  {!saving && <Upload size={16} />}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className={`${navBtn} bg-primary-100 text-white`}
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </form>
      </section>
    </FormProvider>
  );
}
