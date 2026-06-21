import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Hariventure Digital Production',
    template: '%s | Hariventure Digital Production',
  },
  description:
    'Enterprise digital services platform — Website Development, SaaS Products, AI Solutions, Mobile Applications, UI/UX Design, and Digital Marketing.',
  keywords: [
    'Hariventure', 'Digital Production', 'Web Development', 'SaaS',
    'AI Solutions', 'Mobile Apps', 'UI/UX Design', 'Digital Marketing',
  ],
  authors: [{ name: 'Hariventure Digital Production' }],
  creator: 'Hariventure Digital Production',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hariventure.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Hariventure Digital Production',
    title: 'Hariventure Digital Production — Enterprise Digital Services',
    description: 'Your enterprise partner for digital transformation.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hariventure Digital Production',
    description: 'Enterprise digital services platform.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            classNames: {
              success: 'border-l-4 border-l-green-500',
              error: 'border-l-4 border-l-red-500',
              warning: 'border-l-4 border-l-yellow-500',
              info: 'border-l-4 border-l-blue-500',
            },
          }}
        />
      </body>
    </html>
  );
}
