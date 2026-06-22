import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mervi Platform | Super Admin",
  description: "Enterprise Multi-Tenant SaaS Platform Administration",
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
