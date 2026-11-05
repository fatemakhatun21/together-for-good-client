"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Menu,
  LogOut,
  UserRound,
  CalendarPlus,
  CalendarCheck,
  Settings2,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "next-themes";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
];

const accountLinks = [
  {
    label: "Create Event",
    href: "/create-event",
    icon: CalendarPlus,
  },
  {
    label: "Manage Events",
    href: "/manage-events",
    icon: Settings2,
  },
  {
    label: "Joined Events",
    href: "/joined-events",
    icon: CalendarCheck,
  },
];

function ThemeToggle({ mobile = false }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      title="Toggle light / dark mode"
      className={`inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 ${mobile ? "h-11 w-full gap-2" : "size-11"}`}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
      {mobile && <span className="text-sm font-semibold">Toggle Theme</span>}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setProfileOpen(false);
      setMenuOpen(false);

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };
  const avatar = (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50">
      {user?.image ? (
        <img
          src={user.image}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound className="size-5 text-emerald-700" />
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="TogetherForGood Logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />

          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
            Together
            <span className="text-emerald-600">
              ForGood
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${active
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isPending ? (
            <div className="h-11 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                title={user.name || "My Account"}
                aria-expanded={profileOpen}
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-3 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {avatar}
                <ChevronDown className="size-4 text-slate-500 dark:text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-3">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    {accountLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                        >
                          <Icon className="size-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {loggingOut ? "Logging Out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Register
                <ArrowUpRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-11 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(85vw,340px)] bg-white p-0 dark:bg-slate-950"
            >
              <SheetHeader className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                <SheetTitle className="text-left text-lg font-bold text-slate-900 dark:text-slate-100">
                  TogetherForGood
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-5 py-6">
                {navLinks.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-5">
                  {isPending ? (
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/50">
                        {avatar}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {accountLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            <Icon className="size-4 text-emerald-600" />
                            {link.label}
                          </Link>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 font-semibold text-red-600 disabled:opacity-60"
                      >
                        <LogOut className="size-4" />
                        {loggingOut ? "Logging Out..." : "Logout"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
