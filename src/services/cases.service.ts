import "server-only";
import { api } from "@/lib/api";
import type {
  AdminCase,
  ApiResponse,
  CaseBankOverview,
  CaseDetail,
  CaseInput,
  CasesPage,
  Paginated,
  Specialty,
  UpdateCaseBankOverviewInput,
} from "@/types/api";

export async function getSpecialties(): Promise<ApiResponse<Specialty[]>> {
  const res = await api.get<ApiResponse<Specialty[]>>("/cases/specialties");
  return res.data;
}

/** GET /cases/overview — public. The case bank as a product (title/description/image). */
export async function getCaseBankOverview(): Promise<ApiResponse<CaseBankOverview>> {
  const res = await api.get<ApiResponse<CaseBankOverview>>("/cases/overview");
  return res.data;
}

/** GET /cases/admin/overview — admin. Same shape, for the admin editor to load current values. */
export async function getAdminCaseBankOverview(): Promise<ApiResponse<CaseBankOverview>> {
  const res = await api.get<ApiResponse<CaseBankOverview>>("/cases/admin/overview");
  return res.data;
}

/** PATCH /cases/admin/overview — admin. At least one of title/description required. */
export async function updateCaseBankOverview(
  input: UpdateCaseBankOverviewInput,
): Promise<ApiResponse<CaseBankOverview>> {
  const res = await api.patch<ApiResponse<CaseBankOverview>>(
    "/cases/admin/overview",
    input,
  );
  return res.data;
}

/** PATCH /cases/admin/overview/image — admin. Multipart field `image` (resized 800×450). */
export async function updateCaseBankOverviewImage(
  file: File,
): Promise<ApiResponse<{ imageUrl: string }>> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await api.patch<ApiResponse<{ imageUrl: string }>>(
    "/cases/admin/overview/image",
    fd,
    { headers: { "Content-Type": undefined } },
  );
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

/** GET /cases/admin/all — admin only. One page of all cases incl. drafts. `limit` caps at 50. */
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

/**
 * Fetch EVERY admin case. The backend caps `limit` at 50 and does NOT support
 * a publish-status filter (verified: `?isPublished=` is ignored, returns all),
 * so the admin list filters Published/Draft/specialty/search client-side — which
 * needs the full set. We grab page 1, then fetch the remaining pages **in
 * parallel** (≈6 requests at limit 50, not 21 sequential) so the load stays fast.
 */
export async function getAllAdminCases(): Promise<AdminCase[]> {
  const first = await getAdminCases(1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => getAdminCases(i + 2, 50)),
  );

  const all = [...items];
  for (const res of rest) if (res.success) all.push(...res.data.items);
  return all;
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

/** PATCH /cases/:id/image — admin. Multipart field `image`. Replaces the cover (resized 800×450). */
export async function updateCaseImage(
  id: string,
  file: File,
): Promise<ApiResponse<{ imageUrl: string }>> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await api.patch<ApiResponse<{ imageUrl: string }>>(
    `/cases/${id}/image`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** PATCH /cases/:id/station-image — admin. Multipart field `stationImage` (resized 800×600). */
export async function updateCaseStationImage(
  id: string,
  file: File,
): Promise<ApiResponse<{ stationImageUrl: string }>> {
  const fd = new FormData();
  fd.append("stationImage", file);
  const res = await api.patch<ApiResponse<{ stationImageUrl: string }>>(
    `/cases/${id}/station-image`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** POST /cases/:id/duplicate — admin only. Draft copy ("Copy of …"), next stationNumber, no images. */
export async function duplicateCase(
  id: string,
): Promise<ApiResponse<CaseDetail>> {
  const res = await api.post<ApiResponse<CaseDetail>>(`/cases/${id}/duplicate`);
  return res.data;
}

/** DELETE /cases/:id — admin only. Hard delete (+ Cloudinary images). `data: null`. */
export async function deleteCase(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/cases/${id}`);
  return res.data;
}
