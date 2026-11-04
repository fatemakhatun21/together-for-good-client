"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    HeartHandshake,
} from "lucide-react";

export default function EventDetailsPage() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        async function fetchEvent() {
            try {
                const response = await fetch(
                    `http://localhost:5000/events/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch event");
                }

                const data = await response.json();
                setEvent(data);
            } catch (error) {
                setError("Unable to load event details.");
            } finally {
                setLoading(false);
            }
        }

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen py-24 text-center text-slate-500">
                Loading event details...
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-screen py-24 text-center">
                <p className="text-red-600">
                    {error || "Event not found."}
                </p>

                <Link
                    href="/events"
                    className="mt-4 inline-block text-emerald-700"
                >
                    Back to Events
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-emerald-50/40 px-5 py-12 sm:px-8 lg:py-16">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/events"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    <div className="h-64 bg-slate-100 sm:h-96">
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

                    <div className="p-6 sm:p-10">
                        <span className="inline-block rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            {event.eventType}
                        </span>

                        <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
                            {event.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                                <CalendarDays className="size-5 text-emerald-600" />
                                {event.eventDate}
                            </p>

                            <p className="flex items-center gap-2">
                                <MapPin className="size-5 text-emerald-600" />
                                {event.location}
                            </p>
                        </div>

                        <div className="my-8 border-t border-slate-100" />

                        <h2 className="text-xl font-bold text-slate-900">
                            About This Event
                        </h2>

                        <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                            {event.description}
                        </p>

                        <button
                            type="button"
                            disabled
                            className="mt-10 inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white opacity-60"
                        >
                            <HeartHandshake className="size-5" />
                            Join Event
                        </button>

                        <p className="mt-3 text-xs text-slate-500">
                            Joining will be available after authentication is implemented.
                        </p>
                    </div>
                </article>
            </div>
        </main>
    );
}
