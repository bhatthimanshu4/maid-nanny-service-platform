export default function HouseholdPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-8 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
          Household
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
          Find the right help for your home.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Browse verified maids, babysitters, and nannies based on your
          requirements.
        </p>

        <div className="mt-10">
           <a
            href="/household/helpers"
            className="inline-block rounded-lg bg-green-600 px-6 py-3.5 font-medium text-white hover:bg-green-700"
          >
            Find Helpers
          </a> 
        </div>
      </section>
    </main>
  );
}