import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  HomepageData,
  HomepageSettings,
  UpdateHomepageStatsInput,
  YoutubeLinkInput,
} from "@/types/api";

/** GET /homepage — public. Backs the home page stats + featured videos. */
export async function getHomepageData(): Promise<ApiResponse<HomepageData>> {
  const res = await api.get<ApiResponse<HomepageData>>("/homepage");
  return res.data;
}

/** PATCH /admin/homepage — admin. testimonialsCount/registrarsCount only; caseNumber is derived. */
export async function updateHomepageStats(
  input: UpdateHomepageStatsInput,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.patch<ApiResponse<HomepageSettings>>("/admin/homepage", input);
  return res.data;
}

/** POST /admin/homepage/youtube-links — admin. */
export async function addYoutubeLink(
  input: YoutubeLinkInput,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.post<ApiResponse<HomepageSettings>>(
    "/admin/homepage/youtube-links",
    input,
  );
  return res.data;
}

/** PATCH /admin/homepage/youtube-links/:linkId — admin. Partial; at least one field. */
export async function updateYoutubeLink(
  linkId: string,
  input: Partial<YoutubeLinkInput>,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.patch<ApiResponse<HomepageSettings>>(
    `/admin/homepage/youtube-links/${linkId}`,
    input,
  );
  return res.data;
}

/** DELETE /admin/homepage/youtube-links/:linkId — admin. */
export async function deleteYoutubeLink(
  linkId: string,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.delete<ApiResponse<HomepageSettings>>(
    `/admin/homepage/youtube-links/${linkId}`,
  );
  return res.data;
}
