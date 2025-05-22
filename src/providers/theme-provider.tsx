'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { setCookie } from '@/lib/cookies';
import { Theme, ThemeContextType, getEffectiveTheme, getSystemTheme } from '@/lib/theme';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme(theme);
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme(theme);

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    setCookie('theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      const effectiveTheme = getSystemTheme();
      root.classList.remove('light', 'dark');
      root.classList.add(effectiveTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
