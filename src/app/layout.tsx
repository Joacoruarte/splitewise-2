import { Toaster } from 'sonner';

import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { cookies } from 'next/headers';

import { Theme } from '@/lib/theme';

import './globals.css';
import Providers from './providers';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const defaultTheme = (cookiesStore.get('theme')?.value || 'system') as Theme;
  const effectiveTheme = defaultTheme === 'system' ? 'light' : defaultTheme;

  return (
    <html lang="en" className={effectiveTheme} suppressHydrationWarning>
      <head>
        {/* Script para evitar el flash de tema incorrecto */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var themeValue = document.cookie.match(/theme=([^;]+)/)?.[1] || 'system';
                  var root = document.documentElement;
                  
                  if (themeValue === 'system') {
                    themeValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  root.classList.remove('light', 'dark');
                  root.classList.add(themeValue);
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <Toaster position="top-right" />
        <Providers defaultTheme={defaultTheme}>{children}</Providers>
      </body>
    </html>
  );
}
