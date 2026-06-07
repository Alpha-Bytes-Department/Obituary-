"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AppRole = "guest" | "user" | "admin";

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userImage: string;
  role: Exclude<AppRole, "guest">;
  tokenApplied?: boolean;
  tokenApproveStatus?: boolean;
  token?: string | null;
  funeralHome?: any;
}

interface AppContextValue {
  user: AppUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  role: AppRole;
  isAuthenticated: boolean;
  setSession: (user: AppUser, accessToken: string, refreshToken: string) => void;
  setUser: (user: AppUser | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("obituary.user");
      const storedToken = localStorage.getItem("obituary.accessToken");
      const storedRefreshToken = localStorage.getItem("obituary.refreshToken");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setAccessToken(storedToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    } catch (error) {
      console.error("Failed to parse local storage user session", error);
    }
  }, []);

  const value = useMemo<AppContextValue>(() => {
    const role = user?.role ?? "guest";

    return {
      user,
      accessToken,
      refreshToken,
      role,
      isAuthenticated: Boolean(user && accessToken),
      setSession: (nextUser, nextAccessToken, nextRefreshToken) => {
        setUser(nextUser);
        setAccessToken(nextAccessToken);
        setRefreshToken(nextRefreshToken);
        try {
          localStorage.setItem("obituary.user", JSON.stringify(nextUser));
          localStorage.setItem("obituary.accessToken", nextAccessToken);
          localStorage.setItem("obituary.refreshToken", nextRefreshToken);
        } catch (error) {
          console.error("Failed to save session to local storage", error);
        }
      },
      setUser: (nextUser) => {
        setUser(nextUser);
        try {
          if (nextUser) {
            localStorage.setItem("obituary.user", JSON.stringify(nextUser));
          } else {
            localStorage.removeItem("obituary.user");
          }
        } catch (error) {
          // Ignore
        }
      },
      setAccessToken: (nextAccessToken) => {
        setAccessToken(nextAccessToken);
        try {
          if (nextAccessToken) {
            localStorage.setItem("obituary.accessToken", nextAccessToken);
          } else {
            localStorage.removeItem("obituary.accessToken");
          }
        } catch (error) {
          // Ignore
        }
      },
      setRefreshToken: (nextRefreshToken) => {
        setRefreshToken(nextRefreshToken);
        try {
          if (nextRefreshToken) {
            localStorage.setItem("obituary.refreshToken", nextRefreshToken);
          } else {
            localStorage.removeItem("obituary.refreshToken");
          }
        } catch (error) {
          // Ignore
        }
      },
      logout: () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        try {
          localStorage.removeItem("obituary.user");
          localStorage.removeItem("obituary.accessToken");
          localStorage.removeItem("obituary.refreshToken");
        } catch (error) {
          // Ignore
        }
      },
    };
  }, [user, accessToken, refreshToken]);

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
