import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mervi | MD Portal",
  description: "Managing Director Operations Dashboard — Mervi Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
