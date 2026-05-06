import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const APP_URL = "https://empleos.litseacc.edu.mx";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Litsea Empleos — Bolsa de trabajo para terapeutas certificados",
    template: "%s | Litsea Empleos",
  },
  description:
    "Conectamos terapeutas egresados de Litsea Centro de Capacitación con hoteles y spas de lujo en la Riviera Maya. Talento verificado, oportunidades reales.",
  keywords: [
    "bolsa de trabajo terapeutas",
    "empleo spa Riviera Maya",
    "terapeutas certificados Cancún",
    "hoteles spa Playa del Carmen",
    "Litsea Centro de Capacitación",
    "empleo wellness México",
    "masajista trabajo Riviera Maya",
    "terapeuta spa Tulum",
    "egresados Litsea empleo",
    "spa therapist jobs Mexico",
  ],
  authors: [{ name: "Litsea Centro de Capacitación", url: "https://litseacc.edu.mx" }],
  creator: "Litsea Centro de Capacitación",
  publisher: "Litsea Centro de Capacitación",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: APP_URL,
    siteName: "Litsea Empleos",
    title: "Litsea Empleos — Bolsa de trabajo para terapeutas certificados",
    description:
      "Conectamos terapeutas egresados de Litsea con hoteles y spas de lujo en la Riviera Maya.",
    images: [
      {
        url: "/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png",
        width: 1280,
        height: 960,
        alt: "Terapeuta certificada Litsea preparando espacio de spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Litsea Empleos — Bolsa de trabajo para terapeutas certificados",
    description:
      "Conectamos terapeutas egresados de Litsea con hoteles y spas de lujo en la Riviera Maya.",
    images: ["/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.ico",
  },
  manifest: "/favicon/site.webmanifest",
  category: "employment",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Litsea Centro de Capacitación",
      url: "https://litseacc.edu.mx",
      sameAs: [APP_URL],
      contactPoint: {
        "@type": "ContactPoint",
        email: "empleos@litseacc.edu.mx",
        contactType: "customer support",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "Litsea Empleos",
      description:
        "Bolsa de trabajo especializada en terapeutas certificados para hoteles y spas de lujo en la Riviera Maya",
      publisher: { "@id": `${APP_URL}/#organization` },
      inLanguage: "es-MX",
    },
    {
      "@type": ["JobBoard", "WebApplication"],
      "@id": `${APP_URL}/#app`,
      name: "Litsea Empleos",
      url: APP_URL,
      description:
        "Plataforma que conecta terapeutas egresados de Litsea Centro de Capacitación con empleadores de la industria wellness y spa en la Riviera Maya, México",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      provider: { "@id": `${APP_URL}/#organization` },
      areaServed: {
        "@type": "Place",
        name: "Riviera Maya, Quintana Roo, México",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "20.6296",
          longitude: "-87.0739",
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
