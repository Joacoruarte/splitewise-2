import { getCookie, setCookie } from './cookies';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    return (getCookie('theme') as Theme) || 'system';
  }
  return 'system';
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

export function toggleTheme(currentTheme: Theme): Theme {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setCookie('theme', newTheme);
  return newTheme;
}
