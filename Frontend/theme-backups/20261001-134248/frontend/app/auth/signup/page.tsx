export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            First, tell us how you&apos;ll use Helper4U
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <a
            href="/household"
            className="block w-full rounded-xl border-2 border-green-600 bg-green-50 p-4 text-left hover:bg-green-100"
          >
            <p className="font-semibold text-gray-900">
              I&apos;m a Household
            </p>
            <p className="mt-1 text-sm text-gray-600">
              I&apos;m looking for a maid, babysitter, or nanny.
            </p>
          </a>

          <button
            type="button"
            className="w-full rounded-xl border border-gray-300 bg-white p-4 text-left hover:border-green-600 hover:bg-green-50"
          >
            <p className="font-semibold text-gray-900">
              I&apos;m a Helper
            </p>
            <p className="mt-1 text-sm text-gray-600">
              I&apos;m looking for domestic work opportunities.
            </p>
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-green-600 hover:text-green-700"
          >
            Log in
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