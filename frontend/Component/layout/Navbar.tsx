"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";

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
  { label: "Submit Memorial", href: "/memorial" },
];

export default function Navbar() {
  const { user, role, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const navigation =
    role === "admin" ? adminLinks : isAuthenticated ? userLinks : publicLinks;
  const showPublicActions = !isAuthenticated;

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";
  const avatarSrc = user?.userImage && !avatarFailed ? user.userImage : null;

  return (
    <header className="sticky top-0 z-20 border-b border-[#ece6dd] bg-white">
      <div className="mx-auto flex max-w-[90vw] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4d9c7] bg-white text-[#1e3a5f] shadow-sm transition hover:bg-[#f4efe8] lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex flex-col leading-none">
            <span className="font-heading text-[1.95rem] tracking-[-0.03em] text-[#1e3a5f]">
              Funeral Home
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
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

        <div className="hidden items-center gap-3 lg:flex">
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
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/profile"
              className="flex items-center gap-3  bg-white px-2 py-1 pr-5  "
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e3a5f] text-white">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={`${user?.firstName} ${user?.lastName}`.trim()}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <span className="text-sm font-semibold tracking-[0.08em]">
                    {initials || "--"}
                  </span>
                )}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-[#1e3a5f]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-[#626262]">{user?.email}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-950/35 transition-opacity duration-700 ease-in-out ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          id="mobile-navigation-drawer"
          className={`absolute left-0 top-0 flex h-full w-[min(86vw,20rem)] flex-col border-r border-[#eadfce] bg-[#fffaf4] shadow-[20px_0_60px_rgba(15,23,42,0.14)] transition-transform duration-700 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-[#efe4d5] px-5 py-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex flex-col leading-none"
            >
              <span className="font-heading text-2xl tracking-[-0.03em] text-[#1e3a5f]">
                Funeral Home
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d9c7] bg-white text-[#1e3a5f] transition hover:bg-[#f4efe8]"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#7b6a58]">
              Menu
            </p>

            <nav className="mt-4 space-y-2">
              {navigation.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-[1rem] transition ${active ? "border-[#1e3a5f]/20 bg-[#1e3a5f] text-white" : "border-[#eadfce] bg-white text-[#1e3a5f] hover:border-[#1e3a5f]/30 hover:bg-[#f8f3ec]"}`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 space-y-3 border-t border-[#efe4d5] pt-5">
              {showPublicActions ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl bg-[#1e3a5f] px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-[#16314f]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl border border-[#1e3a5f] px-4 py-3 text-center text-sm font-medium text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left transition hover:bg-[#faf7f2]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e3a5f] text-white">
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc}
                        alt={`${user?.firstName} ${user?.lastName}`.trim()}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : (
                      <span className="text-xs font-semibold tracking-[0.08em]">
                        {initials || "--"}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#1e3a5f]">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="block truncate text-xs text-[#626262]">
                      {user?.email}
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
