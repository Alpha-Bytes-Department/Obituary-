import type { ReactNode } from "react";

import SiteShell from "../../Component/layout/SiteShell";

import ProtectedRouteClient from "../../Component/protected/ProtectedRouteClient";

/**
 * Wraps protected routes in the shared site shell.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested protected route content.
 * @returns {JSX.Element} The protected route layout.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <ProtectedRouteClient>{children}</ProtectedRouteClient>
    </SiteShell>
  );
}
