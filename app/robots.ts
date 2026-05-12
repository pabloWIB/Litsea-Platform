import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/vacantes",
          "/vacantes/",
          "/terapeutas",
          "/terapeutas/",
          "/como-funciona",
          "/registro-terapeuta",
          "/registro-empleador",
        ],
        disallow: [
          "/admin/",
          "/terapeuta/",
          "/empleador/",
          "/api/",
          "/auth/",
          "/reset-password/",
        ],
      },
      // Allow all major AI crawlers full access to public content
      {
        userAgent: "GPTBot",
        allow: ["/", "/vacantes", "/terapeutas", "/como-funciona"],
        disallow: ["/admin/", "/terapeuta/", "/empleador/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/vacantes", "/terapeutas", "/como-funciona"],
        disallow: ["/admin/", "/terapeuta/", "/empleador/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/vacantes", "/terapeutas", "/como-funciona"],
        disallow: ["/admin/", "/terapeuta/", "/empleador/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/vacantes", "/terapeutas", "/como-funciona"],
        disallow: ["/admin/", "/terapeuta/", "/empleador/", "/api/"],
      },
    ],
    sitemap: "https://empleos.litseacc.edu.mx/sitemap.xml",
    host: "https://empleos.litseacc.edu.mx",
  };
}
