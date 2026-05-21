"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AxiosInstance } from "axios";
import type { ReactNode } from "react";

import { useAppContext } from "./AppContext";

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

/**
 * Provides a configured Axios instance with auth headers and 401 handling.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested application content.
 * @returns {JSX.Element} The Axios provider.
 */
export function AxiosProvider({ children }: { children: ReactNode }) {
  const { accessToken, logout } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization =
          `Bearer ${accessToken}`;
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();

          if (
            pathname !== "/login" &&
            pathname !== "/register" &&
            pathname !== "/forgot-password"
          ) {
            router.replace("/login");
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, api, logout, pathname, router]);

  return <AxiosContext.Provider value={api}>{children}</AxiosContext.Provider>;
}

/**
 * Returns the shared Axios instance configured by the provider.
 *
 * @returns {AxiosInstance} The application Axios client.
 * @throws {Error} Throws when used outside of AxiosProvider.
 */
export function useAxios() {
  const api = useContext(AxiosContext);

  if (!api) {
    throw new Error("useAxios must be used within AxiosProvider");
  }

  return api;
}
