import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ThemeMode = 'day' | 'night';

interface ThemeContextType {
  theme: ThemeMode;
  isDayMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('night');

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'night' ? 'day' : 'night'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const isDayMode = theme === 'day';

  return (
    <ThemeContext.Provider value={{ theme, isDayMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
}

