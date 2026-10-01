export default function HouseholdPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-8 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
          Household
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground">
          Find the right help for your home.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground">
          Browse verified maids, babysitters, and nannies based on your
          requirements.
        </p>

        <div className="mt-10">
           <a
            href="/household/helpers"
            className="inline-block rounded-lg bg-primary px-6 py-3.5 font-medium text-foreground hover:bg-primary-dark"
          >
            Find Helpers
          </a> 
        </div>
      </section>
    </main>
  );
}