import "server-only";
import { api } from "@/lib/api";
import type {
  AdminCase,
  ApiResponse,
  CaseDetail,
  CaseInput,
  CasesPage,
  Paginated,
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

/** GET /cases/admin/all — admin only. All cases incl. drafts, `createdBy` populated. */
export async function getAdminCases(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<AdminCase>>> {
  const res = await api.get<ApiResponse<Paginated<AdminCase>>>(
    "/cases/admin/all",
    { params: { page, limit } },
  );
  return res.data;
}

/** GET /cases/admin/:id — admin only. Full case incl. drafts. */
export async function getAdminCase(
  id: string,
): Promise<ApiResponse<CaseDetail>> {
  const res = await api.get<ApiResponse<CaseDetail>>(`/cases/admin/${id}`);
  return res.data;
}

/** POST /cases — admin only. Create a case (draft unless isPublished:true). */
export async function createCase(
  payload: CaseInput,
): Promise<ApiResponse<CaseDetail>> {
  const res = await api.post<ApiResponse<CaseDetail>>("/cases", payload);
  return res.data;
}

/** PATCH /cases/:id — admin only. Partial update (arrays replace). */
export async function updateCase(
  id: string,
  payload: Partial<CaseInput>,
): Promise<ApiResponse<CaseDetail>> {
  const res = await api.patch<ApiResponse<CaseDetail>>(`/cases/${id}`, payload);
  return res.data;
}
