"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { CalendarCheck, ArrowUpRight } from "lucide-react";

export default function JoinedEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="min-h-screen py-20 text-center">
        Loading...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen py-20 text-center">
        <p>Please login to view your joined events.</p>
        <Link
          href="/login"
          className="mt-4 inline-block font-semibold text-emerald-700"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            My Joined Events
          </h1>
          <p className="mt-2 text-slate-600">
            Explore the community events you have joined.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50">
            <CalendarCheck className="size-8 text-emerald-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Joined Events Yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-slate-500">
            Once you join an event, it will appear here.
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Explore Events
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
