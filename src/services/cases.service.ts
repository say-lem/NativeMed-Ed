import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  CaseDetail,
  CasesPage,
  Specialty,
} from "@/types/api";

export async function getSpecialties(): Promise<ApiResponse<Specialty[]>> {
  const res = await api.get<ApiResponse<Specialty[]>>("/cases/specialties");
  return res.data;
}

export async function getAllCases(
  page = 1,
  limit = 12,
): Promise<ApiResponse<CasesPage>> {
  const res = await api.get<ApiResponse<CasesPage>>("/cases", {
    params: { page, limit },
  });
  return res.data;
}

export async function getCasesBySpecialty(
  specialty: string,
  page = 1,
  limit = 12,
): Promise<ApiResponse<CasesPage>> {
  const res = await api.get<ApiResponse<CasesPage>>(
    `/cases/specialty/${encodeURIComponent(specialty)}`,
    { params: { page, limit } },
  );
  return res.data;
}

export async function getCase(id: string): Promise<ApiResponse<CaseDetail>> {
  const res = await api.get<ApiResponse<CaseDetail>>(`/cases/${id}`);
  return res.data;
}
