import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mervi | Client Portal",
  description: "Secure Client Access Dashboard — Mervi Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
