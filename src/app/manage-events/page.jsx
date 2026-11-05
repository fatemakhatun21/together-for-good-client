"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ManageEventsPage() {
  const router = useRouter();
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

    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:5000/events");

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        const myEvents = data.filter(
          (event) => event.creatorEmail === session.user.email
        );

        setEvents(myEvents);
      } catch {
        setError("Unable to load your events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [session?.user?.email, isPending]);

  if (isPending || loading) {
    return (
      <main className="min-h-screen py-20 text-center text-slate-500">
        Loading your events...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen py-20 text-center">
        <p>Please login to manage your events.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700">
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage My Events
            </h1>
            <p className="mt-2 text-slate-500">
              View and manage the events you created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            <Plus className="size-4" />
            Create Event
          </Link>
        </div>

        {error ? (
          <p role="alert" className="text-red-600">{error}</p>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">
              You haven't created any events yet.
            </p>
            <Link
              href="/create-event"
              className="mt-4 inline-block font-semibold text-emerald-700"
            >
              Create Your First Event
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
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {event.eventType}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-emerald-600" />
                      {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-emerald-600" />
                      {event.eventDate}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/manage-events/${event._id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled
                      title="Delete functionality will be added after API security"
                      className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 opacity-50"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
