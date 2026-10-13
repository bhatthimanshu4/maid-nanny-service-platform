import Navbar from "@/components/Navbar";

function SmileIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
    >
      <circle cx="32" cy="32" r="29" fill="#E8B89C" />
      <circle cx="22" cy="26" r="2.7" fill="#292524" />
      <circle cx="42" cy="26" r="2.7" fill="#292524" />
      <path
        d="M20 37c2.8 5.5 6.8 8.2 12 8.2S41.2 42.5 44 37"
        stroke="#292524"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className="h-10 w-10">
      <path
        d="m7 22 17-14 17 14v18H7V22Z"
        fill="#FFF8F3"
        stroke="#D89B78"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path d="M20 40V27h8v13" stroke="#D89B78" strokeWidth="2.5" />
      <path d="M33 15V9h5v10" stroke="#D89B78" strokeWidth="2.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-background">
      <Navbar />

      <section className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-surface to-primary/20"
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-warm-pulse" />

        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:py-0">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-2 text-sm font-semibold text-primary-dark shadow-sm">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary-dark" />
              Trusted domestic help
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
              Find reliable help
              <span className="block text-primary-dark">for your home.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/80">
              Find verified maids, babysitters, and nannies based on your
              requirements, availability, experience, and preferred service plan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-foreground/75">
              <span className="rounded-full bg-surface/80 px-4 py-2 shadow-sm">Care you can trust</span>
              <span className="rounded-full bg-surface/80 px-4 py-2 shadow-sm">Support for every home</span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto flex h-[340px] w-full max-w-[540px] items-center justify-center sm:h-[420px]"
          >
            <div className="absolute h-64 w-64 rounded-full bg-primary/25 blur-3xl animate-warm-pulse sm:h-80 sm:w-80" />

            <div className="relative z-10 w-[min(100%,360px)] rounded-[2rem] border border-border bg-surface/90 p-6 shadow-[0_24px_80px_rgba(91,59,43,0.14)] backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">
                    Helper4U
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">
                    Happier homes,
                    <span className="block">together.</span>
                  </h2>
                </div>
                <SmileIcon className="h-14 w-14 animate-smile-soft" />
              </div>

              <div className="relative my-7 flex items-center justify-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-background shadow-inner">
                  <HomeIcon />
                </div>
                <svg viewBox="0 0 100 24" className="h-6 w-20 overflow-visible">
                  <path
                    d="M2 12h96"
                    stroke="#D89B78"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    className="animate-helping-path"
                  />
                </svg>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white bg-primary/25 text-4xl text-primary-dark shadow-sm">
                  🤝
                </div>
              </div>

              <div className="rounded-2xl bg-background px-4 py-3 text-center">
                <p className="text-sm font-semibold text-foreground">A little help goes a long way</p>
                <p className="mt-1 text-xs text-foreground/65">People caring for people</p>
              </div>
            </div>

            <span className="absolute right-[13%] top-[20%] h-3 w-3 rounded-full bg-primary animate-sparkle-soft" />
            <span className="absolute bottom-[24%] left-[9%] h-2.5 w-2.5 rounded-full bg-primary-dark/60 animate-sparkle-soft animation-delay-700" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 bg-background">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-dark">
            Simple &amp; trusted
          </p>

          <h2 className="text-5xl font-bold tracking-tight text-foreground">
            How Helper4U works
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground">
            Find the right domestic help, choose a service plan, and manage your
            bookings through one platform.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary-dark">01</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                Create an account
              </h3>
              <p className="mt-2 text-foreground">
                Sign up as a household or a helper and create your profile.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary-dark">02</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                Find the right match
              </h3>
              <p className="mt-2 text-foreground">
                Households can browse helpers based on their requirements,
                experience, availability, and service plan.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary-dark">03</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                Book and manage
              </h3>
              <p className="mt-2 text-foreground">
                Send booking requests, manage services, and track service
                history.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="/auth/signup"
              className="inline-block rounded-lg bg-primary px-6 py-3.5 font-medium text-foreground hover:bg-primary-dark"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
