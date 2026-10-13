export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-foreground">
            Log in to your Helper4U account
          </p>
        </div>

        <form className="space-y-5">
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
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-medium text-foreground hover:bg-primary-dark"
          >
            Log in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-foreground">
  Don&apos;t have an account?{" "}
  <a
    href="/auth/signup"
    className="font-medium text-primary-dark hover:text-primary-dark"
  >
    Sign up
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