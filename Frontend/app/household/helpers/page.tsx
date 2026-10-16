"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getAuthToken, getStoredAuthUser } from "@/lib/auth";

type Plan = { _id: string; planType: string; price: number; description?: string };
type Helper = {
  _id: string;
  helperType: "maid" | "nanny";
  experience: number;
  skills: string[];
  bio?: string;
  verificationStatus: string;
  user?: { name?: string; city?: string };
  plans: Plan[];
};

async function readResult<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) throw new Error(result?.message || "The request could not be completed.");
  return result.data as T;
}

export default function HelperDirectoryPage() {
  const router = useRouter();
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [minimumExperience, setMinimumExperience] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/backend/helpers/browse")
      .then(readResult<Helper[]>)
      .then((data) => { if (active) setHelpers(data); })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load helpers."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleHelpers = useMemo(() => helpers.filter((helper) => {
    const matchesType = filter === "all" || helper.helperType === filter;
    const searchable = [helper.user?.name, helper.bio, ...helper.skills].join(" ").toLowerCase();
    const matchesCity = !city.trim() || (helper.user?.city || "").toLowerCase().includes(city.trim().toLowerCase());
    const matchesExperience = !minimumExperience || (helper.experience || 0) >= Number(minimumExperience);
    const matchesPrice = !maximumPrice || helper.plans.some((plan) => plan.price <= Number(maximumPrice));
    return matchesType && matchesCity && matchesExperience && matchesPrice && searchable.includes(search.trim().toLowerCase());
  }), [helpers, filter, search, city, minimumExperience, maximumPrice]);

  async function requestBooking(event: FormEvent<HTMLFormElement>, helper: Helper, plan: Plan) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setNotice("");
    const user = getStoredAuthUser();
    const token = getAuthToken();
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "household") {
      setError("Only household accounts can request a booking. Please sign in with a household account.");
      return;
    }
    const form = new FormData(formElement);
    setSubmitting(`${helper._id}:${plan._id}`);
    try {
      await readResult(await fetch("/api/backend/bookings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          helperId: helper._id,
          servicePlanId: plan._id,
          bookingDate: new Date(String(form.get("bookingDate"))).toISOString(),
          notes: String(form.get("notes") || "").trim(),
        }),
      }));
      setNotice(`Your request was sent to ${helper.user?.name || "the helper"}. You can follow its status from your dashboard.`);
      formElement.reset();
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "Could not send the booking request.");
    } finally {
      setSubmitting("");
    }
  }

  return <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">Find a helper</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Find the right help for your home</h1>
        <p className="mt-3 max-w-2xl text-foreground/70">Compare available services and send a booking request directly to a helper.</p>
      </header>

      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-5">
        <div><label className="mb-1 block text-xs font-medium" htmlFor="helper-search">Name or skill</label><input id="helper-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search helpers" className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary/40" /></div>
        <div><label className="mb-1 block text-xs font-medium" htmlFor="helper-type">Service type</label><select id="helper-type" value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-3 outline-none focus:border-primary-dark"><option value="all">All services</option><option value="maid">Home cleaning</option><option value="nanny">Childcare</option></select></div>
        <div><label className="mb-1 block text-xs font-medium" htmlFor="helper-city">City</label><input id="helper-city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Any city" className="w-full rounded-lg border border-border px-3 py-3" /></div>
        <div><label className="mb-1 block text-xs font-medium" htmlFor="helper-experience">Minimum experience</label><input id="helper-experience" type="number" min="0" value={minimumExperience} onChange={(event) => setMinimumExperience(event.target.value)} placeholder="Any" className="w-full rounded-lg border border-border px-3 py-3" /></div>
        <div><label className="mb-1 block text-xs font-medium" htmlFor="helper-price">Maximum price (₹)</label><input id="helper-price" type="number" min="0" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} placeholder="Any price" className="w-full rounded-lg border border-border px-3 py-3" /></div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice} <Link href="/dashboard" className="font-semibold underline">Open dashboard</Link></p>}
      {loading ? <p className="rounded-2xl border border-border bg-surface p-8 text-center">Loading available helpers…</p> : visibleHelpers.length === 0 ? <section className="rounded-2xl border border-border bg-surface p-8 text-center"><h2 className="text-xl font-bold">No matching helpers yet</h2><p className="mt-2 text-sm text-foreground/70">Try another service or search. Helpers with an active service plan will appear here.</p></section> : <div className="grid gap-5 lg:grid-cols-2">
        {visibleHelpers.map((helper) => <article key={helper._id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{helper.helperType === "maid" ? "Home cleaning" : "Childcare"}</p><h2 className="mt-1 text-2xl font-bold">{helper.user?.name || "Helper"}</h2><p className="mt-1 text-sm text-foreground/70">{helper.experience} {helper.experience === 1 ? "year" : "years"} experience{helper.user?.city ? ` · ${helper.user.city}` : ""}</p></div>
            <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold capitalize">{helper.verificationStatus === "accepted" ? "Verified" : "Verification pending"}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-foreground/80">{helper.bio || "This helper has not added an introduction yet."}</p>
          {helper.skills.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{helper.skills.map((skill) => <span key={skill} className="rounded-full border border-border px-3 py-1 text-xs">{skill}</span>)}</div>}
          <div className="mt-5 space-y-4 border-t border-border pt-4">
            {helper.plans.filter((plan) => !maximumPrice || plan.price <= Number(maximumPrice)).map((plan) => <form key={plan._id} onSubmit={(event) => void requestBooking(event, helper, plan)} className="rounded-xl bg-background p-4">
              <div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold capitalize">{plan.planType} service</h3><p className="font-bold">₹{plan.price}</p></div>
              {plan.description && <p className="mt-1 text-sm text-foreground/70">{plan.description}</p>}
              <label htmlFor={`date-${plan._id}`} className="mb-1 mt-4 block text-sm font-medium">Preferred date and time</label>
              <input id={`date-${plan._id}`} name="bookingDate" type="datetime-local" min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} required className="w-full rounded-lg border border-border bg-surface px-3 py-2" />
              <label htmlFor={`notes-${plan._id}`} className="mb-1 mt-3 block text-sm font-medium">Notes <span className="font-normal text-foreground/60">(optional)</span></label>
              <textarea id={`notes-${plan._id}`} name="notes" rows={2} maxLength={1000} placeholder="Share any details the helper should know" className="w-full rounded-lg border border-border bg-surface px-3 py-2" />
              <button type="submit" disabled={submitting === `${helper._id}:${plan._id}`} className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 font-semibold hover:bg-primary-dark disabled:opacity-60">{submitting === `${helper._id}:${plan._id}` ? "Sending request…" : "Request this service"}</button>
            </form>)}
          </div>
        </article>)}
      </div>}
    </main>
  </div>;
}
