import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Using Monaco font per user request for Mervi design system
const monaco = localFont({
  src: [
    {
      path: './fonts/Monaco.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: "--font-monaco",
  display: 'swap',
});

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
      <body className={`${monaco.variable} antialiased bg-white text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
