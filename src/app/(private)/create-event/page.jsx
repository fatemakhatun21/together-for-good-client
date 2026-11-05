"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
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

  const today = new Date().toLocaleDateString("en-CA");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first.");
      return;
    }

    if (form.eventDate <= today) {
      toast.warning("Please select a future date.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: tokenError } =
        await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to get authentication token.");
      }

      const response = await fetch(
        "https://together-for-good-server.onrender.com/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            ...form,
            creatorEmail: session.user.email,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message || "Failed to create event."
        );
      }

      toast.success("Event created successfully!");

      router.push("/events");
      router.refresh();
    } catch (err) {
      toast.error(
        err.message || "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

  const labelClass =
    "mb-2 block font-medium text-slate-700 dark:text-slate-200";

  if (isPending) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        Loading...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-200">
          Please login to create an event.
        </p>

        <Link
          href="/login"
          className="mt-4 inline-block font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16 transition-colors dark:bg-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors sm:p-10 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create Event
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-300">
          Organize an event and make a difference.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className={labelClass}>
              Event Title
            </label>

            <input
              id="title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventType" className={labelClass}>
              Event Type
            </label>

            <select
              id="eventType"
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Plantation">Plantation</option>
              <option value="Cleanup">Cleanup</option>
              <option value="Donation">Donation</option>
              <option value="Awareness">Awareness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>
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
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Event Location
            </label>

            <input
              id="location"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventDate" className={labelClass}>
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
              className={`${inputClass} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label htmlFor="creatorEmail" className={labelClass}>
              Creator Email
            </label>

            <input
              id="creatorEmail"
              value={session.user.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-emerald-500"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
