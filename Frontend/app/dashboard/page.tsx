"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { clearAuthSession, getAuthToken, getStoredAuthUser, normalizeAuthUser, storeAuthSession, type AuthUser } from "@/lib/auth";

type Person = { name?: string; email?: string; phone?: string; city?: string; address?: string };
type HelperProfile = { helperType?: string; experience?: number; skills?: string[]; availability?: "available" | "unavailable"; verificationStatus?: string; bio?: string };
type ServicePlan = { _id: string; planType: "hourly" | "monthly" | "yearly"; price: number; description?: string; isActive: boolean };
type Booking = {
  _id: string;
  bookingDate: string;
  status: string;
  notes?: string;
  household?: Person;
  helper?: { helperType?: string; user?: Person };
  servicePlan?: { planType?: string; price?: number; description?: string };
};

async function api<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Could not reach the service. Check that the backend is running.");
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) throw new Error(result?.message || "Could not load your dashboard.");
  return result.data as T;
}

function showDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-sky-100 text-sky-800",
    rejected: "bg-rose-100 text-rose-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-stone-200 text-stone-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [helper, setHelper] = useState<HelperProfile | null>(null);
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [busyAvailability, setBusyAvailability] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async (authToken: string) => {
    try {
      const userData = await api<unknown>("/users/profile", authToken);
      const user = normalizeAuthUser(userData);
      if (!user) throw new Error("Your account details could not be read. Please log in again.");
      setToken(authToken);
      setProfile(user);

      if (user.role === "helper") {
        const [jobs, helperData, plans] = await Promise.all([
          api<Booking[]>("/bookings/helper", authToken),
          api<HelperProfile>("/helpers/profile", authToken),
          api<ServicePlan[]>("/service-plans", authToken),
        ]);
        setBookings(jobs);
        setHelper(helperData);
        setServicePlans(plans);
      } else {
        const householdBookings = await api<Booking[]>("/bookings/my-bookings", authToken);
        setBookings(householdBookings);
        setHelper(null);
      }
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Could not load your dashboard.";
      setError(message);
      if (/invalid|expired|unauthorized|log in again/i.test(message)) {
        clearAuthSession();
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const authToken = getAuthToken();
    const user = getStoredAuthUser();
    if (!authToken || !user) {
      router.replace("/auth/login");
      return;
    }
    const loadId = window.setTimeout(() => {
      void loadDashboard(authToken);
    }, 0);
    return () => window.clearTimeout(loadId);
  }, [loadDashboard, router]);

  async function changeBookingStatus(booking: Booking, status: "accepted" | "rejected" | "cancelled" | "completed") {
    setBusyId(booking._id);
    setError("");
    setNotice("");
    try {
      const path = status === "cancelled" ? `/bookings/${booking._id}/cancel` : status === "completed" ? `/bookings/${booking._id}/complete` : `/bookings/${booking._id}/status`;
      await api<Booking>(path, token, { method: "PUT", ...(status !== "cancelled" ? { body: JSON.stringify({ status }) } : {}) });
      setNotice(status === "cancelled" ? "Booking cancelled." : status === "completed" ? "Job marked complete." : `Booking ${status}.`);
      await loadDashboard(token);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Could not update this booking.");
    } finally {
      setBusyId("");
    }
  }

  async function toggleAvailability() {
    if (!helper?.availability) return;
    setBusyAvailability(true);
    setError("");
    setNotice("");
    const availability = helper.availability === "available" ? "unavailable" : "available";
    try {
      await api<{ availability: string }>("/helpers/availability", token, { method: "PUT", body: JSON.stringify({ availability }) });
      setHelper((current) => current ? { ...current, availability } : current);
      setNotice(`You are now marked ${availability}.`);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Could not update availability.");
    } finally {
      setBusyAvailability(false);
    }
  }

  async function createServicePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setNotice("");
    const form = new FormData(formElement);
    try {
      const plan = await api<ServicePlan>("/service-plans", token, {
        method: "POST",
        body: JSON.stringify({
          planType: String(form.get("planType")),
          price: Number(form.get("price")),
          description: String(form.get("description") || "").trim(),
        }),
      });
      setServicePlans((current) => [...current, plan]);
      setNotice("Service plan added. Households can now find and request this service.");
      formElement.reset();
    } catch (planError) {
      setError(planError instanceof Error ? planError.message : "Could not add your service plan.");
    }
  }

  async function saveAccountProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setNotice("");
    try {
      const updated = normalizeAuthUser(await api<unknown>("/users/profile", token, {
        method: "PUT",
        body: JSON.stringify({
          name: String(form.get("name") || "").trim(),
          phone: String(form.get("phone") || "").trim(),
          address: String(form.get("address") || "").trim(),
          city: String(form.get("city") || "").trim(),
        }),
      }));
      if (!updated) throw new Error("The updated account details could not be read.");
      storeAuthSession(token, updated);
      setProfile(updated);
      setNotice("Your account details have been saved.");
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : "Could not save your account details.");
    }
  }

  async function saveHelperProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setNotice("");
    try {
      const updated = await api<HelperProfile>("/helpers/profile", token, {
        method: "PUT",
        body: JSON.stringify({
          experience: Number(form.get("experience")),
          skills: String(form.get("skills") || "").split(",").map((skill) => skill.trim()).filter(Boolean),
          bio: String(form.get("bio") || "").trim(),
        }),
      });
      setHelper(updated);
      setNotice("Your helper profile has been saved.");
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : "Could not save your helper profile.");
    }
  }

  const isHelper = profile?.role === "helper";
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const activeCount = bookings.filter((booking) => ["pending", "accepted"].includes(booking.status)).length;

  return <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">{isHelper ? "Helper workspace" : "Household account"}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{profile ? `Welcome, ${profile.name}` : "Your dashboard"}</h1>
          <p className="mt-2 text-foreground/70">Keep track of your account and service activity.</p>
        </div>
        {isHelper ? <button onClick={() => void toggleAvailability()} disabled={!helper || busyAvailability} className="rounded-lg bg-primary px-5 py-3 font-semibold hover:bg-primary-dark disabled:opacity-60">{busyAvailability ? "Updating…" : `Mark ${helper?.availability === "available" ? "unavailable" : "available"}`}</button> : <Link href="/household/helpers" className="rounded-lg bg-primary px-5 py-3 font-semibold hover:bg-primary-dark">Find a helper</Link>}
      </header>

      {!token && error && <div role="alert" className="mb-6 rounded-xl border border-border bg-surface p-5">{error} <Link href="/auth/login" className="ml-1 font-semibold text-primary-dark underline">Log in</Link></div>}
      {error && token && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}

      {loading ? <div className="rounded-2xl border border-border bg-surface p-8 text-center">Loading your dashboard…</div> : profile && <>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Account overview">
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm"><p className="text-sm text-foreground/65">Account</p><p className="mt-2 text-lg font-bold">{isHelper ? "Helper" : "Household"}</p><p className="mt-1 text-sm text-foreground/70">{profile.email}</p></article>
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm"><p className="text-sm text-foreground/65">{isHelper ? "New requests" : "Pending bookings"}</p><p className="mt-2 text-3xl font-bold">{pendingCount}</p><p className="mt-1 text-sm text-foreground/70">{activeCount} active {isHelper ? "jobs" : "bookings"}</p></article>
          {isHelper ? <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm"><p className="text-sm text-foreground/65">Helper profile</p><p className="mt-2 text-lg font-bold capitalize">{helper?.helperType || "Helper"} · {helper?.availability || "availability unknown"}</p><p className="mt-1 text-sm capitalize text-foreground/70">Verification: {helper?.verificationStatus || "pending"}</p></article> : <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm"><p className="text-sm text-foreground/65">Booking history</p><p className="mt-2 text-3xl font-bold">{bookings.length}</p><p className="mt-1 text-sm text-foreground/70">Total service requests</p></article>}
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-xl font-bold">Account details</h2>
          <p className="mt-1 text-sm text-foreground/65">Keep your contact information up to date.</p>
          <form onSubmit={(event) => void saveAccountProfile(event)} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="account-name" className="mb-1 block text-sm font-medium">Full name</label><input id="account-name" name="name" defaultValue={profile.name} required className="w-full rounded-lg border border-border px-3 py-2" /></div>
            <div><label htmlFor="account-phone" className="mb-1 block text-sm font-medium">Phone</label><input id="account-phone" name="phone" type="tel" defaultValue={profile.phone} required className="w-full rounded-lg border border-border px-3 py-2" /></div>
            <div><label htmlFor="account-city" className="mb-1 block text-sm font-medium">City</label><input id="account-city" name="city" defaultValue={profile.city || ""} className="w-full rounded-lg border border-border px-3 py-2" /></div>
            <div><label htmlFor="account-address" className="mb-1 block text-sm font-medium">Address</label><input id="account-address" name="address" defaultValue={profile.address || ""} className="w-full rounded-lg border border-border px-3 py-2" /></div>
            <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark sm:col-span-2">Save account details</button>
          </form>
        </section>

        {isHelper && helper && <section className="mb-8 rounded-2xl border border-border bg-surface p-5 sm:p-6"><h2 className="text-xl font-bold">Your helper profile</h2><form onSubmit={(event) => void saveHelperProfile(event)} className="mt-4 grid gap-4 sm:grid-cols-2"><div><label htmlFor="helper-experience" className="mb-1 block text-sm font-medium">Years of experience</label><input id="helper-experience" name="experience" type="number" min="0" max="60" defaultValue={helper.experience ?? 0} required className="w-full rounded-lg border border-border px-3 py-2" /></div><div><label htmlFor="helper-skills" className="mb-1 block text-sm font-medium">Skills, separated by commas</label><input id="helper-skills" name="skills" defaultValue={helper.skills?.join(", ") || ""} className="w-full rounded-lg border border-border px-3 py-2" placeholder="Cleaning, cooking, childcare" /></div><div className="sm:col-span-2"><label htmlFor="helper-bio" className="mb-1 block text-sm font-medium">About you</label><textarea id="helper-bio" name="bio" maxLength={1000} rows={3} defaultValue={helper.bio || ""} className="w-full rounded-lg border border-border px-3 py-2" placeholder="Introduce yourself and the help you provide" /></div><button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark sm:col-span-2">Save helper profile</button></form><div className="mt-6 border-t border-border pt-5"><h3 className="font-bold">Your service plans</h3>{servicePlans.length > 0 && <ul className="mt-3 space-y-2">{servicePlans.map((plan) => <li key={plan._id} className="flex flex-wrap justify-between gap-2 rounded-lg bg-background px-4 py-3 text-sm"><span className="font-medium capitalize">{plan.planType} · ₹{plan.price}</span><span className="text-foreground/70">{plan.isActive ? "Active and visible to households" : "Inactive"}</span></li>)}</ul>}<form onSubmit={(event) => void createServicePlan(event)} className="mt-4 grid gap-3 sm:grid-cols-2"><div><label htmlFor="plan-type" className="mb-1 block text-sm font-medium">Plan type</label><select id="plan-type" name="planType" className="w-full rounded-lg border border-border bg-surface px-3 py-2"><option value="hourly">Hourly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div><div><label htmlFor="plan-price" className="mb-1 block text-sm font-medium">Price (₹)</label><input id="plan-price" name="price" type="number" min="1" step="1" required className="w-full rounded-lg border border-border px-3 py-2" placeholder="e.g. 500" /></div><div className="sm:col-span-2"><label htmlFor="plan-description" className="mb-1 block text-sm font-medium">What does this service include?</label><textarea id="plan-description" name="description" maxLength={500} rows={2} className="w-full rounded-lg border border-border px-3 py-2" placeholder="Briefly describe the service" /></div><button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark sm:col-span-2">Add service plan</button></form></div></section>}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-5"><h2 className="text-xl font-bold">{isHelper ? "Job requests" : "Your bookings"}</h2><p className="mt-1 text-sm text-foreground/65">{isHelper ? "Review requests and update their status." : "See the status and timing of your service requests."}</p></div>
          {bookings.length === 0 ? <div className="rounded-xl bg-background p-6 text-center"><p className="font-semibold">{isHelper ? "No job requests yet" : "No bookings yet"}</p><p className="mt-1 text-sm text-foreground/70">{isHelper ? "New household requests will appear here." : "Browse helpers to find support for your home."}</p>{!isHelper && <Link href="/household/helpers" className="mt-4 inline-block font-semibold text-primary-dark hover:underline">Browse helpers →</Link>}</div> : <div className="space-y-4">{bookings.map((booking) => {
            const contact = isHelper ? booking.household : booking.helper?.user;
            const canRespond = isHelper && booking.status === "pending";
            const canComplete = isHelper && booking.status === "accepted";
            const canCancel = !isHelper && ["pending", "accepted"].includes(booking.status);
            return <article key={booking._id} className="rounded-xl border border-border p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{isHelper ? contact?.name || "Household" : contact?.name || `${booking.helper?.helperType || "Helper"}`}</h3><p className="mt-1 text-sm text-foreground/65">{contact?.email || ""}</p></div><Status status={booking.status}/></div><div className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><p><span className="font-semibold">When:</span> {showDate(booking.bookingDate)}</p><p><span className="font-semibold">Plan:</span> <span className="capitalize">{booking.servicePlan?.planType || "Service"}</span></p><p><span className="font-semibold">Price:</span> {booking.servicePlan?.price != null ? `₹${booking.servicePlan.price}` : "Not listed"}</p></div>{booking.notes && <p className="mt-3 text-sm text-foreground/70"><span className="font-semibold">Notes:</span> {booking.notes}</p>}{(canRespond || canComplete || canCancel) && <div className="mt-4 flex flex-wrap gap-2">{canRespond && <><button disabled={busyId === booking._id} onClick={() => void changeBookingStatus(booking, "accepted")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">Accept</button><button disabled={busyId === booking._id} onClick={() => void changeBookingStatus(booking, "rejected")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-background disabled:opacity-50">Decline</button></>}{canComplete && <button disabled={busyId === booking._id} onClick={() => void changeBookingStatus(booking, "completed")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">Mark complete</button>}{canCancel && <button disabled={busyId === booking._id} onClick={() => void changeBookingStatus(booking, "cancelled")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">Cancel booking</button>}</div>}</article>;
            })}</div>}
        </section>
      </>}
    </main>
  </div>;
}
