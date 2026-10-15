"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp, type AccountRole } from "@/lib/auth";
import AuthWallpaper from "@/components/AuthWallpaper";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>("household");
  const [helperType, setHelperType] = useState<"maid" | "nanny">("maid");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await signUp({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        phone: String(formData.get("phone") ?? "").trim(),
        role,
        ...(role === "helper" ? { helperType } : {}),
      });
      router.replace("/");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We couldn't create your account.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <AuthWallpaper />
      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-[0_24px_80px_rgba(91,59,43,0.10)] sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="mt-2 text-sm text-foreground/75">
              First, tell us how you&apos;ll use Helper4U
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-foreground">
                I&apos;m signing up as a
              </legend>

              <div className="space-y-3">
                <label className="block cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="role"
                    value="household"
                    checked={role === "household"}
                    onChange={() => setRole("household")}
                  />
                  <span className="flex w-full items-center rounded-xl border-2 border-border bg-surface p-4 text-left transition-colors peer-checked:border-primary-dark peer-checked:bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary-dark">
                    <span>
                      <span className="block font-semibold text-foreground">I&apos;m a Household</span>
                      <span className="mt-1 block text-sm text-foreground/75">
                        I&apos;m looking for a maid, babysitter, or nanny.
                      </span>
                    </span>
                  </span>
                </label>

                <label className="block cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="role"
                    value="helper"
                    checked={role === "helper"}
                    onChange={() => setRole("helper")}
                  />
                  <span className="flex w-full items-center rounded-xl border-2 border-border bg-surface p-4 text-left transition-colors peer-checked:border-primary-dark peer-checked:bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary-dark">
                    <span>
                      <span className="block font-semibold text-foreground">I&apos;m a Helper</span>
                      <span className="mt-1 block text-sm text-foreground/75">
                        I&apos;m looking for domestic work opportunities.
                      </span>
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            {role === "helper" && (
              <div>
                <label htmlFor="signup-helper-type" className="mb-2 block text-sm font-medium text-foreground">
                  Type of work
                </label>
                <select
                  id="signup-helper-type"
                  name="helperType"
                  value={helperType}
                  onChange={(event) => setHelperType(event.target.value as "maid" | "nanny")}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="maid">Maid / home cleaning</option>
                  <option value="nanny">Nanny / childcare</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-phone" className="mb-2 block text-sm font-medium text-foreground">
                Phone number
              </label>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/75">
            Already have an account?{" "}
            <a href="/auth/login" className="font-semibold text-primary-dark hover:underline">
              Log in
            </a>
          </p>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-foreground/70 hover:text-foreground">
              ← Back to home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
