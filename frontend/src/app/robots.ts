import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/bantuan", "/bantuan/*", "/privacy"],
        disallow: [
          "/home",
          "/catat",
          "/nabung",
          "/monitor",
          "/receipt-scanner",
          "/settings",
          "/pembukuan",
          "/template",
          "/help",
          "/ai",
          "/api/*",
          "/auth/callback",
          "/auth/reset-password",
        ],
      },
    ],
    sitemap: "https://finusa.web.id/sitemap.xml",
  };
}
