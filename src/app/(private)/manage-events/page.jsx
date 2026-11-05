"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ManageEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function fetchEvents() {
      try {
        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication token unavailable");
        }

        const response = await fetch("http://localhost:5000/my-events", {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        setEvents(data);
      } catch {
        setError("Unable to load your events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [session?.user?.email, isPending]);

  const handleDelete = async () => {
    if (!selectedEvent || deletingId) return;

    const id = selectedEvent._id;
    setDeletingId(id);
    setError("");

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to get authentication token.");
      }

      const response = await fetch(
        `http://localhost:5000/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to delete event.");
      }

      setEvents((prev) =>
        prev.filter((event) => event._id !== id)
      );

      setSelectedEvent(null);
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

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
        <Link
          href="/login"
          className="mt-4 inline-block text-emerald-700"
        >
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

        {error && (
          <p role="alert" className="mb-6 text-sm text-red-600">
            {error}
          </p>
        )}

        {events.length === 0 ? (
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
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
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

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="size-7 text-red-600" />
            </div>

            <h2
              id="delete-event-title"
              className="text-xl font-bold text-slate-900"
            >
              Delete Event?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <strong>{selectedEvent.title}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
