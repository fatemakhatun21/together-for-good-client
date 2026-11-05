"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarDays,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function JoinedEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadJoinedEvents() {
      setLoading(true);
      setError("");

      try {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Unable to get authentication token.");
        }

        const response = await fetch(
          "https://together-for-good-server.onrender.com/joined-events",
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load joined events."
          );
        }

        if (!cancelled) {
          setEvents(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load joined events.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJoinedEvents();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, isPending]);

  if (isPending || loading) {
    return (
      <main className="min-h-screen py-20 text-center text-slate-500">
        Loading joined events...
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

        {error ? (
          <p role="alert" className="text-center text-red-600">
            {error}
          </p>
        ) : events.length === 0 ? (
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-48 bg-slate-100">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {event.eventType}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-emerald-600" />
                      {event.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-emerald-600" />
                      {event.eventDate}
                    </p>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View Details
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
