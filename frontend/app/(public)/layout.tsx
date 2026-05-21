import type { ReactNode } from "react";

import SiteShell from "../../Component/layout/SiteShell";

/**
 * Wraps public routes in the shared site shell.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested public route content.
 * @returns {JSX.Element} The public route layout.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
