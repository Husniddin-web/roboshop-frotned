import type { MetadataRoute } from "next";

const SITE_URL = "https://roboshop.uz";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Sitemap har 1 soatda yangilanadi
export const revalidate = 3600;

async function getAllProductIds(): Promise<string[]> {
  if (!API_URL) return [];
  const ids: string[] = [];
  try {
    let page = 1;
    let lastPage = 1;
    do {
      const res = await fetch(`${API_URL}/product?page=${page}&limit=100`, {
        headers: { lang: "uz" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const json = await res.json();
      const items = Array.isArray(json?.data) ? json.data : [];
      for (const p of items) if (p?.id) ids.push(String(p.id));
      lastPage = Number(json?.meta?.lastPage) || 1;
      page++;
    } while (page <= lastPage && page <= 50);
  } catch {
    // API ishlamasa ham sitemap asosiy sahifalar bilan chiqadi
  }
  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const ids = await getAllProductIds();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...ids.map((id) => ({
      url: `${SITE_URL}/products/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
