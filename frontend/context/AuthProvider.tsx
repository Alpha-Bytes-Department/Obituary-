"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Lightweight Auth context to hold user session in memory.
 * Access token should be stored in-memory for Lighthouse performance.
 */

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
} | null;

const AuthContext = createContext({
  user: null as User,
  setUser: (u: User) => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Hydration placeholder: optionally read from secure storage or silent refresh
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
