import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HouseholdPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">Household</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Find the right help for your home.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/75">
          Browse available maids and nannies, compare their services, and send a booking request that you can follow from your dashboard.
        </p>
        <Link href="/household/helpers" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3.5 font-semibold hover:bg-primary-dark">
          Browse available helpers
        </Link>
      </main>
    </div>
  );
}
