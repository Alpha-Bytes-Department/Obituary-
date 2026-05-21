"use client";

import type { ReactNode } from "react";

import { AppProvider } from "../context/AppContext";
import { AxiosProvider } from "../context/AxiosProvider";

/**
 * Composes the global application providers.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested application content.
 * @returns {JSX.Element} The provider tree.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AxiosProvider>{children}</AxiosProvider>
    </AppProvider>
  );
}
