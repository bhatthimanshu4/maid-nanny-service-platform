import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="bg-surface">
      <Navbar />

      <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary-dark">
            Trusted domestic help
          </p>

          <h1 className="text-6xl font-bold leading-tight tracking-tight text-foreground">
            Find reliable help
            <span className="block text-primary-dark">
              for your home.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground">
            Find verified maids, babysitters, and nannies based on your
            requirements, availability, experience, and preferred service plan.
          </p>

          <div className="mt-8 flex gap-4">
            {/* <a
              href="/auth/signup"
              className="rounded-lg bg-primary px-6 py-3.5 font-medium text-foreground hover:bg-primary-dark"
            >
              Find a Helper
            </a> */}

            <a
  href="/how-it-works"
  className="rounded-lg border border-border px-6 py-3.5 font-medium text-foreground hover:bg-background"
>
  How It Works
</a>
          </div>
        </div>
      </section>
    </main>
  );
}