"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

import useAuth from "../../hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
}

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

const publicLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Find a Memorial", href: "/obituary" },
  { label: "Memorial", href: "/obituary" },
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
    role === "admin" ? adminLinks : isAuthenticated ? userLinks : publicLinks;
  const showPublicActions = !isAuthenticated || role === "guest";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-20 border-b border-[#ece6dd] bg-white">
      <div className="mx-auto flex max-w-[90vw]  items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-(family-name:--font-playfair) text-[1.95rem] tracking-[-0.03em] text-[#1e3a5f]">
            Funeral Home
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 px-1 py-1 text-[1.05rem] transition ${active ? "border-[#1e3a5f] text-[#1e3a5f]" : "border-transparent text-[#1e3a5f]/90 hover:border-[#1e3a5f]/30"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {showPublicActions ? (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#16314f]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
              >
                Sing Up
              </Link>
            </>
          ) : role === "admin" ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#16314f]"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-full bg-white px-2 py-1 pr-4 shadow-sm ring-1 ring-black/5">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#1e3a5f] text-white">
                {initials || <CircleUserRound className="h-7 w-7" />}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-[#1e3a5f]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-[#626262]">{user?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
