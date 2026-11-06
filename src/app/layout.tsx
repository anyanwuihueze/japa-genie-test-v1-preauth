import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';

import './globals.css';
import AppProviders from '@/components/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Japa Genie',
  description: 'Your AI-Powered Visa Guide',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover' as const,
  interactiveWidget: 'resizes-content' as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="3X8uXaB2HH3mHTyTPpMSJ51Chmt7xBBaboH9mdLWeAc"
        />

        <meta
          name="theme-color"
          content="#0F172A"
          media="(prefers-color-scheme: light)"
        />

        <meta
          name="theme-color"
          content="#0F172A"
          media="(prefers-color-scheme: dark)"
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x8iqcuthg5");
          `}
        </Script>
      </head>

      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
