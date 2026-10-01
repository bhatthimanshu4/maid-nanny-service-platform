export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-foreground">
            First, tell us how you&apos;ll use Helper4U
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <a
            href="/household"
            className="block w-full rounded-xl border-2 border-primary bg-background p-4 text-left hover:bg-background"
          >
            <p className="font-semibold text-foreground">
              I&apos;m a Household
            </p>
            <p className="mt-1 text-sm text-foreground">
              I&apos;m looking for a maid, babysitter, or nanny.
            </p>
          </a>

          <button
            type="button"
            className="w-full rounded-xl border border-border bg-surface p-4 text-left hover:border-primary hover:bg-background"
          >
            <p className="font-semibold text-foreground">
              I&apos;m a Helper
            </p>
            <p className="mt-1 text-sm text-foreground">
              I&apos;m looking for domestic work opportunities.
            </p>
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-medium text-foreground hover:bg-primary-dark"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-primary-dark hover:text-primary-dark"
          >
            Log in
          </a>
        </p>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-foreground hover:text-foreground"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </main>
  );
}