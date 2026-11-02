
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

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

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

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

          <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
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
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center md:flex">
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="h-11 rounded-full bg-emerald-600 px-6 font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              Login
              <ArrowUpRight className="size-4 shrink-0" />
            </span>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-11 rounded-xl border-slate-200"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(85vw,340px)] bg-white p-0"
            >
              <SheetHeader className="border-b border-slate-100 px-6 py-5">
                <SheetTitle className="text-left text-lg font-bold text-slate-900">
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
                      className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                      />
                    }
                    className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      Login
                      <ArrowUpRight className="size-4 shrink-0" />
                    </span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
