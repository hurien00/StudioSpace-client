"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AUTH_CHANGE_EVENT, type AuthUser } from "@/lib/auth-session";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem("user");
}

function getServerSnapshot() {
  return null;
}

/**
 * Reads the user saved in localStorage as an external store, so components
 * don't need to copy it into state inside an effect.
 */
export function useAuthUser(): AuthUser | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }, [raw]);
}

const subscribeToNothing = () => () => {};

/** False during SSR and hydration, true once running on the client. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}
