import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cart", "/profile"],
      },
    ],
    sitemap: "https://roboshop.uz/sitemap.xml",
  };
}
