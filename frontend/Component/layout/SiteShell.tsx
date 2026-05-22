import type { ReactNode } from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

/**
 * Wraps route content with the shared navigation and footer shell.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested route content.
 * @returns {JSX.Element} The shell layout.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto max-w-full  lg:max-w-[90vw] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
