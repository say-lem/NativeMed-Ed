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

interface CasesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

function buildCasesParams({ page = 1, limit = 12, search }: CasesQuery) {
  const params: Record<string, string | number> = { page, limit };
  if (search && search.trim()) params.search = search.trim();
  return params;
}

export async function getAllCases(
  page = 1,
  limit = 12,
  search?: string,
): Promise<ApiResponse<CasesPage>> {
  const res = await api.get<ApiResponse<CasesPage>>("/cases", {
    params: buildCasesParams({ page, limit, search }),
  });
  return res.data;
}

export async function getCasesBySpecialty(
  specialty: string,
  page = 1,
  limit = 12,
  search?: string,
): Promise<ApiResponse<CasesPage>> {
  const res = await api.get<ApiResponse<CasesPage>>(
    `/cases/specialty/${encodeURIComponent(specialty)}`,
    { params: buildCasesParams({ page, limit, search }) },
  );
  return res.data;
}

export async function getCase(id: string): Promise<ApiResponse<CaseDetail>> {
  const res = await api.get<ApiResponse<CaseDetail>>(`/cases/${id}`);
  return res.data;
}
