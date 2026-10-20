import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://interview-master-ai-umutocgdrs-projects.vercel.app"),
  title: "11 Interview — Yapay Zeka Destekli Teknik & Davranışsal Mülakat Simülatörü",
  description:
    "Yazılım geliştiriciler, mühendisler ve profesyoneller için AI destekli interaktif mülakat simülatörü. Swift, Python, React ve Sistem Mimarisi sorularıyla kendinizi test edin.",
  keywords: ["11 interview", "ai interview", "mülakat hazırlık", "teknik mülakat simülatörü", "swift mülakat soruları", "yazılım mülakatı"],
  authors: [{ name: "11Hopem", url: "https://11hopem-software.vercel.app" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "11 Interview",
    title: "11 Interview — Mülakat Hazırlık ve Simülasyon",
    description: "Yapay zeka ile interaktif teknik mülakat hazırlığı yapın.",
    url: "https://interview-master-ai-umutocgdrs-projects.vercel.app",
    images: [{ url: "/og-image.png", width: 512, height: 512, alt: "11 Interview Logo" }],
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "11 Interview — Mülakat Simülatörü",
    description: "AI destekli teknik ve davranışsal mülakat simülatörü.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "11 Interview",
    "applicationCategory": "EducationalApplication",
    "description": "Yapay zeka destekli interaktif teknik mülakat simülatörü ve kariyer hazırlık platformu.",
    "url": "https://interview-master-ai-umutocgdrs-projects.vercel.app",
    "logo": "https://interview-master-ai-umutocgdrs-projects.vercel.app/favicon.svg",
    "image": "https://interview-master-ai-umutocgdrs-projects.vercel.app/og-image.png",
  };

  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
