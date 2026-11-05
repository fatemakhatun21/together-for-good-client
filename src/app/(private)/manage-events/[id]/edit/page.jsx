"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    if (isPending || !id) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadEvent() {
      setLoading(true);

      try {
        const response = await fetch(
          `https://together-for-good-server.onrender.com/events/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load event");
        }

        const event = await response.json();

        if (cancelled) return;

        if (event.creatorEmail !== session.user.email) {
          setError("You can only edit your own events.");
          return;
        }

        setForm({
          title: event.title || "",
          description: event.description || "",
          eventType: event.eventType || "Plantation",
          image: event.image || "",
          location: event.location || "",
          eventDate: event.eventDate || "",
        });
      } catch {
        if (!cancelled) {
          setError("Unable to load event.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id, session?.user?.email, isPending]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form || !session?.user) {
      toast.error("Please login first.");
      return;
    }

    if (form.eventDate <= today) {
      toast.warning("Please select a future date.");
      return;
    }

    setSaving(true);

    try {
      const { data, error: tokenError } =
        await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to get authentication token.");
      }

      const response = await fetch(
        `https://together-for-good-server.onrender.com/events/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(
          result.message || "Failed to update event."
        );
      }

      toast.success("Event updated successfully!");

      router.push("/manage-events");
      router.refresh();
    } catch (err) {
      toast.error(
        err.message || "Failed to update event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

  const labelClass =
    "mb-2 block font-medium text-slate-700 dark:text-slate-200";

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        Loading event...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-emerald-50/40 py-20 text-center text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Please{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          login
        </Link>{" "}
        first.
      </main>
    );
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-emerald-50/40 px-4 py-20 text-center text-red-600 dark:bg-slate-900 dark:text-red-400">
        {error || "Event not found."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50/40 px-4 py-16 transition-colors dark:bg-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors sm:p-10 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {[
            {
              name: "title",
              label: "Event Title",
              type: "text",
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
            },
            {
              name: "image",
              label: "Thumbnail URL",
              type: "url",
            },
            {
              name: "location",
              label: "Location",
              type: "text",
            },
            {
              name: "eventDate",
              label: "Event Date",
              type: "date",
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className={labelClass}
              >
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  required
                  rows={4}
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.name]: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  required
                  min={
                    field.type === "date"
                      ? today
                      : undefined
                  }
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.name]: e.target.value,
                    })
                  }
                  className={`${inputClass} ${field.type === "date"
                      ? "dark:[color-scheme:dark]"
                      : ""
                    }`}
                />
              )}
            </div>
          ))}

          <div>
            <label
              htmlFor="eventType"
              className={labelClass}
            >
              Event Type
            </label>

            <select
              id="eventType"
              value={form.eventType}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventType: e.target.value,
                })
              }
              className={inputClass}
            >
              <option value="Plantation">Plantation</option>
              <option value="Cleanup">Cleanup</option>
              <option value="Donation">Donation</option>
              <option value="Awareness">Awareness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-emerald-500"
          >
            {saving ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
