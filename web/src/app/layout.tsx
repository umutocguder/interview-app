import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Master — Çok Platformlu Mülakat Hazırlık",
  description: "iOS, Android ve Web için modern mülakat simülatörü ve teknik soru platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
