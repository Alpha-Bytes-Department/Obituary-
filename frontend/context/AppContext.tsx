"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AppRole = "guest" | "user" | "admin";

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userImage: string;
  role: Exclude<AppRole, "guest">;
}

interface AppContextValue {
  user: AppUser | null;
  accessToken: string | null;
  role: AppRole;
  isAuthenticated: boolean;
  setSession: (user: AppUser, accessToken: string) => void;
  setUser: (user: AppUser | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Provides global application state for the current session.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested application content.
 * @returns {JSX.Element} The context provider.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = useMemo<AppContextValue>(() => {
    const role = user?.role ?? "guest";

    return {
      user,
      accessToken,
      role,
      isAuthenticated: Boolean(user && accessToken),
      setSession: (nextUser, nextAccessToken) => {
        setUser(nextUser);
        setAccessToken(nextAccessToken);
      },
      setUser,
      setAccessToken,
      logout: () => {
        setUser(null);
        setAccessToken(null);
      },
    };
  }, [accessToken, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Accesses the global application context.
 *
 * @returns {AppContextValue} The application session state.
 * @throws {Error} Throws when used outside of AppProvider.
 */
export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
