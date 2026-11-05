"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    HeartHandshake,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const [checkingJoin, setCheckingJoin] = useState(true);
    const [joinMessage, setJoinMessage] = useState("");
    const [joinError, setJoinError] = useState(false);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function fetchEvent() {
            try {
                const response = await fetch(
                    `http://localhost:5000/events/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch event");
                }

                const data = await response.json();

                if (!cancelled) {
                    setEvent(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load event details.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchEvent();

        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        if (isPending || !id) return;

        if (!session?.user) {
            setJoined(false);
            setCheckingJoin(false);
            return;
        }

        let cancelled = false;

        async function checkJoinStatus() {
            setCheckingJoin(true);
            setJoinMessage("");
            setJoinError(false);

            try {
                const { data, error: tokenError } =
                    await authClient.token();

                if (tokenError || !data?.token) {
                    throw new Error("Authentication token unavailable");
                }

                const response = await fetch(
                    `http://localhost:5000/join-events/${id}/status`,
                    {
                        headers: {
                            Authorization: `Bearer ${data.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to check join status");
                }

                const result = await response.json();

                if (!cancelled) {
                    setJoined(Boolean(result.joined));
                }
            } catch {
                if (!cancelled) {
                    setJoinError(true);
                    setJoinMessage("Unable to check join status.");
                }
            } finally {
                if (!cancelled) {
                    setCheckingJoin(false);
                }
            }
        }

        checkJoinStatus();

        return () => {
            cancelled = true;
        };
    }, [id, session?.user?.id, isPending]);

    const handleJoin = async () => {
        if (isPending || checkingJoin || joining || joined || joinError) {
            return;
        }

        setJoinMessage("");
        setJoinError(false);

        if (!session?.user) {
            const callbackUrl = `/events/${id}`;

            router.push(
                `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
            );
            return;
        }

        setJoining(true);

        try {
            const { data, error: tokenError } =
                await authClient.token();

            if (tokenError || !data?.token) {
                throw new Error("Unable to get authentication token.");
            }

            const response = await fetch(
                "http://localhost:5000/join-events",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                        eventId: id,
                    }),
                }
            );

            const result = await response.json().catch(() => ({}));

            if (response.status === 409) {
                setJoined(true);
                setJoinMessage("You have already joined this event.");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to join event."
                );
            }

            setJoined(true);
            setJoinMessage("You have successfully joined this event!");
        } catch (err) {
            setJoinError(true);
            setJoinMessage(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setJoining(false);
        }
    };

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

    const today = new Date().toISOString().slice(0, 10);
    const isPastEvent = event.eventDate <= today;

    return (
        <main className="min-h-screen bg-emerald-50/40 px-5 py-12 sm:px-8 lg:py-16">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/events"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
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
                            onClick={handleJoin}
                            disabled={
                                joining ||
                                joined ||
                                isPastEvent ||
                                isPending ||
                                checkingJoin ||
                                joinError
                            }
                            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <HeartHandshake className="size-5" />

                            {checkingJoin || isPending
                                ? "Checking..."
                                : joining
                                    ? "Joining..."
                                    : joined
                                        ? "Already Joined"
                                        : isPastEvent
                                            ? "Event Ended"
                                            : "Join Event"}
                        </button>

                        {joinMessage && (
                            <p
                                role={joinError ? "alert" : "status"}
                                className={`mt-3 text-sm ${joinError
                                        ? "text-red-600"
                                        : "text-emerald-700"
                                    }`}
                            >
                                {joinMessage}
                            </p>
                        )}
                        {joinError && (
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-3 block text-sm font-semibold text-emerald-700 hover:underline"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                </article>
            </div>
        </main>
    );
}
