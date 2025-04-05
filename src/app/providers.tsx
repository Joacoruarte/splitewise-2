import { Theme } from '@/lib/theme';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/theme-provider';
import React from 'react';

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
