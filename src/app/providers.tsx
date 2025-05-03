import { ThemeProvider } from '@/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

import React from 'react';

import { Theme } from '@/lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
  defaultTheme: Theme;
}

async function Providers({ children, defaultTheme }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
    </ClerkProvider>
  );
}

export default Providers;
