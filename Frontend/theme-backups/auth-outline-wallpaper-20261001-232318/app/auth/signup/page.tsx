import AuthWallpaper from "@/components/AuthWallpaper";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <AuthWallpaper
        title="Care goes both ways."
        description="Whether you’re looking for help or ready to offer it, find your place with Helper4U."
      />

      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-7 shadow-[0_24px_80px_rgba(91,59,43,0.10)] sm:p-9">
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-foreground/75">
              First, tell us how you&apos;ll use Helper4U
            </p>
          </div>

          <form className="space-y-5">
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
                    defaultChecked
                  />
                  <span className="flex w-full items-center rounded-xl border-2 border-border bg-surface p-4 text-left transition-colors peer-checked:border-primary-dark peer-checked:bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary-dark">
                    <span>
                      <span className="block font-semibold text-foreground">
                        I&apos;m a Household
                      </span>
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
                  />
                  <span className="flex w-full items-center rounded-xl border-2 border-border bg-surface p-4 text-left transition-colors peer-checked:border-primary-dark peer-checked:bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary-dark">
                    <span>
                      <span className="block font-semibold text-foreground">
                        I&apos;m a Helper
                      </span>
                      <span className="mt-1 block text-sm text-foreground/75">
                        I&apos;m looking for domestic work opportunities.
                      </span>
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/75">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-primary-dark hover:underline"
            >
              Log in
            </a>
          </p>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
