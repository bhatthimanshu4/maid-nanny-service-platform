"use client";

import { useEffect, useState } from "react";
import {
  clearAuthSession,
  getAuthToken,
  getStoredAuthUser,
  normalizeAuthUser,
  storeAuthSession,
  type AuthUser,
} from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isActive = true;
    const token = getAuthToken();
    const cachedUser = getStoredAuthUser();

    if (cachedUser) setUser(cachedUser);
    if (!token) return () => { isActive = false; };

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

    return () => { isActive = false; };
  }, []);

  function handleSignOut() {
    clearAuthSession();
    setUser(null);
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-6 py-5 sm:px-8">
      <a href="/" className="text-xl font-bold text-foreground">
        Helper<span className="text-primary-dark">4U</span>
      </a>

      <div className="flex flex-wrap items-center justify-end gap-4 text-sm text-foreground sm:gap-8">
        <a href="/household" className="hover:text-primary-dark">Find a Helper</a>
        <a href="#how-it-works" className="hover:text-primary-dark">How It Works</a>
        <a href="/auth/signup" className="hover:text-primary-dark">For Helpers</a>

        {user ? (
          <>
            <span className="font-medium" aria-live="polite">Hi, {user.name}</span>
            <button type="button" onClick={handleSignOut} className="hover:text-primary-dark">
              Log out
            </button>
          </>
        ) : (
          <a href="/auth/login" className="hover:text-primary-dark">Login</a>
        )}

        {!user && (
          <a
            href="/auth/signup"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-foreground hover:bg-primary-dark"
          >
            Get Started
          </a>
        )}
      </div>
    </nav>
  );
}
