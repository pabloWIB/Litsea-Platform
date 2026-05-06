import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/vacantes", "/terapeutas"],
        disallow: ["/admin/", "/terapeuta/", "/empleador/", "/api/"],
      },
    ],
    sitemap: "https://empleos.litseacc.edu.mx/sitemap.xml",
  };
}
