export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to your Helper4U account
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700"
          >
            Log in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
  Don&apos;t have an account?{" "}
  <a
    href="/auth/signup"
    className="font-medium text-green-600 hover:text-green-700"
  >
    Sign up
  </a>
</p>

<div className="mt-4 text-center">
  <a
    href="/"
    className="text-sm text-gray-500 hover:text-gray-700"
  >
    ← Back to home
  </a>
</div>
      </div>
    </main>
  );
}