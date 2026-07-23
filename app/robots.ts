import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://fasturl.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/settings/",
          "/notification/",
          "/expired",
          "/verify/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
