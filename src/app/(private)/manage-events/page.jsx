"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = "https://together-for-good-server.onrender.com";

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

    let cancelled = false;

    async function fetchEvents() {
      setLoading(true);

      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication token unavailable");
        }

        const response = await fetch(`${API_URL}/my-events`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        if (!cancelled) {
          setEvents(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load your events.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, isPending]);

  const handleDelete = async () => {
    if (!selectedEvent || deletingId) return;

    const id = selectedEvent._id;

    setDeletingId(id);
    setError("");

    try {
      const { data, error: tokenError } =
        await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to get authentication token.");
      }

      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(
          result.message || "Failed to delete event."
        );
      }

      setEvents((prev) =>
        prev.filter((event) => event._id !== id)
      );

      setSelectedEvent(null);

      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error(
        err.message || "Failed to delete event. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        Loading your events...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-200">
          Please login to manage your events.
        </p>

        <Link
          href="/login"
          className="mt-4 inline-block text-emerald-700 dark:text-emerald-400"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16 transition-colors dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage My Events
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-300">
              View and manage the events you created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 dark:hover:bg-emerald-500"
          >
            <Plus className="size-4" />
            Create Event
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-600 dark:text-slate-300">
              You haven't created any events yet.
            </p>

            <Link
              href="/create-event"
              className="mt-4 inline-block font-semibold text-emerald-700 dark:text-emerald-400"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="h-48 bg-slate-100 dark:bg-slate-700">
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

                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
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

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/manage-events/${event._id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-7 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
              <AlertTriangle className="size-7 text-red-600 dark:text-red-400" />
            </div>

            <h2
              id="delete-event-title"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Delete Event?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Are you sure you want to delete{" "}
              <strong>{selectedEvent.title}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
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