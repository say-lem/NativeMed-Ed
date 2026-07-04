import axios from "axios";
import UploadCaseHero from "./_components/UploadCaseHero";
import UploadCaseForm from "./_components/UploadCaseForm";
import { getAdminCase } from "@/services/cases.service";
import { caseToFormValues } from "@/lib/case-form";
import type { CaseDetail } from "@/types/api";

async function loadCase(id: string): Promise<CaseDetail | undefined> {
  try {
    const res = await getAdminCase(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

export default async function UploadCaseBankPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const initialCase = id ? await loadCase(id) : undefined;
  const initialValues = initialCase ? caseToFormValues(initialCase) : undefined;

  return (
    <>
      <UploadCaseHero mode={initialCase ? "edit" : "add"} />
      <UploadCaseForm
        caseId={initialCase?._id}
        initialValues={initialValues}
        initialCase={initialCase}
      />
    </>
  );
}
