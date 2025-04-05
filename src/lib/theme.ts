import { getCookie, setCookie } from './cookies';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    return (getCookie('theme') as Theme) || 'light';
  }
  return 'light'; // Default value on the server
}

export function toggleTheme(currentTheme: string): Theme {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // update the DOM
  document.documentElement.classList.remove(currentTheme);
  document.documentElement.classList.add(newTheme);

  // update the cookie
  setCookie('theme', newTheme);

  return newTheme;
}
