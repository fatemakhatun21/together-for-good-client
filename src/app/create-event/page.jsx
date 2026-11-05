"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "Plantation",
    image: "",
    location: "",
    eventDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!session?.user) return;

    if (form.eventDate <= today) {
      setMessage("Please select a future date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          creatorEmail: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      router.push("/events");
      router.refresh();
    } catch {
      setMessage("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <p className="py-20 text-center">Loading...</p>;
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen py-20 text-center">
        <p>Please login to create an event.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700">
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Event
        </h1>

        <p className="mt-2 text-slate-500">
          Organize an event and make a difference.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Event Title
            </label>
            <input
              id="title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="eventType" className="mb-2 block font-medium">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="Plantation">Plantation</option>
              <option value="Cleanup">Cleanup</option>
              <option value="Donation">Donation</option>
              <option value="Awareness">Awareness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block font-medium">
              Thumbnail Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              required
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block font-medium">
              Event Location
            </label>
            <input
              id="location"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="mb-2 block font-medium">
              Event Date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              required
              min={today}
              value={form.eventDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="creatorEmail" className="mb-2 block font-medium">
              Creator Email
            </label>
            <input
              id="creatorEmail"
              value={session.user.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
            />
          </div>

          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
