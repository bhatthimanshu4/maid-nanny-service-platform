export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-8 py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-600">
          Simple & trusted
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          How Helper4U works
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Find the right domestic help, choose a service plan, and manage your
          bookings through one platform.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-green-600">01</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-gray-600">
              Sign up as a household or a helper and create your profile.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-green-600">02</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">
              Find the right match
            </h2>
            <p className="mt-2 text-gray-600">
              Households can browse helpers based on their requirements,
              experience, availability, and service plan.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-green-600">03</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">
              Book and manage
            </h2>
            <p className="mt-2 text-gray-600">
              Send booking requests, manage services, and track service
              history.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/auth/signup"
            className="inline-block rounded-lg bg-green-600 px-6 py-3.5 font-medium text-white hover:bg-green-700"
          >
            Get Started
          </a>
        </div>
      </section>
    </main>
  );
}