import Link from "next/link";
import Navbar from "@/components/Navbar";

const steps = [
  { title: "Create your helper account", description: "Choose your work type and add your contact details." },
  { title: "Set up your service", description: "Add your experience, skills, introduction, and a service plan with your price." },
  { title: "Review requests", description: "Household booking requests appear in your dashboard, where you can accept or decline." },
];

export default function ForHelpersPage() {
  return <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">For helpers</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Find work that fits your skills.</h1>
        <p className="mt-5 text-lg leading-8 text-foreground/75">Create a profile for home cleaning or childcare, share the services you offer, and manage household requests from one place.</p>
        <Link href="/auth/signup/helper" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3.5 font-semibold hover:bg-primary-dark">Join as a helper</Link>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="How it works for helpers">
        {steps.map((step, index) => <article key={step.title} className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-bold text-primary-dark">STEP {index + 1}</p><h2 className="mt-3 text-xl font-bold">{step.title}</h2><p className="mt-2 text-sm leading-6 text-foreground/70">{step.description}</p>
        </article>)}
      </section>
    </main>
  </div>;
}
