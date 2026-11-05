"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch(
          "https://together-for-good-server.onrender.com/upcoming-events"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Unable to load upcoming events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-emerald-50/40 px-5 py-16 transition-colors sm:px-8 lg:py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Make a Difference
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Upcoming Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Discover upcoming community events and join initiatives that
            create a positive impact.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Loading events...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="text-center text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No upcoming events available right now.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-emerald-950/30"
              >
                <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-300">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {event.eventType}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {event.title}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="min-w-0 break-words">
                        {event.location}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {event.eventDate}
                    </p>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
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
