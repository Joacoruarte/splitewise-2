'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/lib/get-query-client';
import { Theme } from '@/lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
  defaultTheme: Theme;
}

function Providers({ children, defaultTheme }: ProvidersProps) {
  const queryClient = getQueryClient();
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme={defaultTheme}>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Providers;
