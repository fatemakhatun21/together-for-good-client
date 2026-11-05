"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(form.password)) {
      toast.warning(
        "Password must contain uppercase, lowercase and at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const { error: signupError } =
        await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
          image: form.image || undefined,
        });

      if (signupError) {
        toast.error(
          signupError.message || "Registration failed."
        );
        return;
      }

      toast.success("Account created successfully!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { error: googleError } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });

      if (googleError) {
        toast.error(
          googleError.message || "Google registration failed."
        );
      }
    } catch {
      toast.error("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50/40 px-4 py-16 transition-colors dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          Create Account
        </h1>

        <p className="mt-2 text-center text-slate-500 dark:text-slate-300">
          Join the TogetherForGood community
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {[
            {
              name: "name",
              label: "Full Name",
              type: "text",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
            },
            {
              name: "image",
              label: "Photo URL (Optional)",
              type: "url",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {field.label}
              </label>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                required={field.name !== "image"}
                minLength={
                  field.name === "password" ? 6 : undefined
                }
                autoComplete={
                  field.name === "name"
                    ? "name"
                    : field.name === "email"
                      ? "email"
                      : field.name === "password"
                        ? "new-password"
                        : undefined
                }
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-emerald-500"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
        >
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            G
          </span>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
