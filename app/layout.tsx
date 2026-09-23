import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENADE CC | Laboratório de Estudos",
  description: "Orientações, simulados e trilhas de revisão para o ENADE de Bacharelado em Ciência da Computação.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://enade-cc-laboratorio.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
