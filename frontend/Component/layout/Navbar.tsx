"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
}

const guestLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Obituaries", href: "/obituary" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const userLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Obituaries", href: "/obituary" },
  { label: "Profile", href: "/profile" },
  { label: "Create Obituary", href: "/profile/create" },
];

const adminLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Admin Dashboard", href: "/admin" },
  { label: "Profile", href: "/profile" },
  { label: "Create Obituary", href: "/profile/create" },
];

/**
 * Renders the global navigation bar with role-aware links.
 *
 * @returns {JSX.Element} The navigation bar.
 */
export default function Navbar() {
  const { user, role, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navigation =
    role === "admin" ? adminLinks : isAuthenticated ? userLinks : guestLinks;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Memorials
          </span>
          <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Obituaries Platform
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
          ) : null}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
