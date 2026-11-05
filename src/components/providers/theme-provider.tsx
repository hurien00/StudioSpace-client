"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** The user's choice. Defaults to "system" until they toggle. */
  theme: ThemeMode;
  /** The theme actually applied to the document. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  /** Flips between light and dark based on what is currently rendered. */
  toggleTheme: () => void;
  /** False during SSR and the hydration pass, true afterwards. */
  mounted: boolean;
}

const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const themeListeners = new Set<() => void>();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);

  // Keep multiple open tabs in sync.
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

const getThemeSnapshot = () => readStoredTheme();
const getThemeServerSnapshot = (): ThemeMode => "system";

function subscribeToSystemTheme(listener: () => void) {
  const media = window.matchMedia(MEDIA_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

const getSystemThemeSnapshot = (): ResolvedTheme =>
  window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
const getSystemThemeServerSnapshot = (): ResolvedTheme => "light";

const subscribeToMounted = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot
  );
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Sync the document with the resolved theme. The blocking script in the root
  // layout already did this before paint, so this only matters after toggles.
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    emitThemeChange();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, mounted }),
    [theme, resolvedTheme, setTheme, toggleTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
