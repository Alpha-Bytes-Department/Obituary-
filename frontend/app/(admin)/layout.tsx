import type { ReactNode } from "react";

import SiteShell from "../../Component/layout/SiteShell";

/**
 * Wraps admin routes in the shared site shell.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested admin route content.
 * @returns {JSX.Element} The admin route layout.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
