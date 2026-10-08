import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
