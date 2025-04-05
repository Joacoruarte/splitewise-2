'use client';
import { setCookie } from '@/lib/cookies';
import {
  Theme,
  ThemeContextType,
  toggleTheme,
} from '@/lib/theme';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme }: { children: React.ReactNode, defaultTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    document.documentElement.classList.add(theme);
    setCookie('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme: () => setTheme(toggleTheme(theme)) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
