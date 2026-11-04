"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";

export default function RecentEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch(
                    "http://localhost:5000/recent-events"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError("Unable to load upcoming events.");
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return (
        <section className="bg-emerald-50/40 px-5 py-20 sm:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                            Upcoming Opportunities
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                            Recent Upcoming Events
                        </h2>

                        <p className="mt-4 max-w-xl text-slate-600">
                            Explore meaningful events and find opportunities
                            to make a positive impact in your community.
                        </p>
                    </div>

                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        View All Events
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-slate-500">
                        Loading events...
                    </p>
                ) : error ? (
                    <p role="alert" className="text-center text-red-600">
                        {error}
                    </p>
                ) : events.length === 0 ? (
                    <p className="text-center text-slate-500">
                        No upcoming events available.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <article
                                key={event._id}
                                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                            >
                                <div className="relative h-52 bg-slate-100">
                                    {event.image ? (
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            unoptimized
                                            className="object-cover"
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

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        {event.title}
                                    </h3>

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
                                        View Event
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
