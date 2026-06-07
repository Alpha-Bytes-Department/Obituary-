"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";

export default function ProtectedRouteClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, accessToken } = useAppContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If not authenticated and no access token, show modal
    if (!isAuthenticated && !accessToken) {
      setShowModal(true);
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, accessToken, router]);

  if (!isAuthenticated) {
    if (showModal) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Restricted Access
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              You must be logged in to view this page. Redirecting you to the
              login page...
            </p>
            <button
              onClick={() => router.replace("/login")}
              className="mt-6 w-full rounded-xl bg-[#274877] py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
            >
              Login Now
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}
