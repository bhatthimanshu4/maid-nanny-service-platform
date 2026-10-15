"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  clearAuthSession,
  getAuthToken,
  normalizeAuthUser,
  storeAuthSession,
  type AuthUser,
} from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isUserDashboard = pathname === "/dashboard";
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isActive = true;
    const handleAuthUpdated = (event: Event) => {
      const updatedUser = (event as CustomEvent<AuthUser>).detail;
      if (updatedUser) setUser(updatedUser);
    };
    window.addEventListener("helper4u:auth-updated", handleAuthUpdated);
    const token = getAuthToken();
    if (!token) return () => {
      isActive = false;
      window.removeEventListener("helper4u:auth-updated", handleAuthUpdated);
    };

    fetch("/api/backend/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!isActive) return;

        if (response.status === 401) {
          clearAuthSession();
          setUser(null);
          return;
        }

        if (!response.ok || !result?.success) return;
        const profile = normalizeAuthUser(result.data);
        if (!profile) return;
        storeAuthSession(token, profile);
        setUser(profile);
      })
      .catch(() => {
        // Keep the cached name visible if the backend is temporarily offline.
      });

    return () => {
      isActive = false;
      window.removeEventListener("helper4u:auth-updated", handleAuthUpdated);
    };
  }, []);

  function handleSignOut() {
    clearAuthSession();
    setUser(null);
    router.replace("/");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-6 py-5 sm:px-8">
      <Link href="/" className="text-xl font-bold text-foreground">
        Helper<span className="text-primary-dark">4U</span>
      </Link>

      <div className="flex flex-wrap items-center justify-end gap-4 text-sm text-foreground sm:gap-8">
        {!isUserDashboard && (
          <>
            <Link href="/household/helpers" className="hover:text-primary-dark">Find a Helper</Link>
            <Link href="/#how-it-works" className="hover:text-primary-dark">How It Works</Link>
            <Link href="/for-helpers" className="hover:text-primary-dark">For Helpers</Link>
          </>
        )}

        {user ? (
          <>

            <Link href="/dashboard" className="font-semibold text-primary-dark hover:underline">My dashboard</Link>
            <span className="font-medium" aria-live="polite">Hi, {user.name}</span>
            <button type="button" onClick={handleSignOut} className="hover:text-primary-dark">
              Log out
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="hover:text-primary-dark">Login</Link>
        )}

        {!user && (
          <Link
            href="/auth/signup"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-foreground hover:bg-primary-dark"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
