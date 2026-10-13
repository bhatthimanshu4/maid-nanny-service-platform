import AuthWallpaper from "@/components/AuthWallpaper";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <AuthWallpaper />

      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-[0_24px_80px_rgba(91,59,43,0.10)] sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-foreground/75">
              Log in to your Helper4U account
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary-dark focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/75">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="font-semibold text-primary-dark hover:underline"
            >
              Sign up
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
