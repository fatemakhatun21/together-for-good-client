
import Link from "next/link";
import Image from "next/image";
import { Mail, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="TogetherForGood Logo"
              width={44}
              height={44}
              className="size-11 object-contain"
            />
            <span className="text-xl font-bold">
              Together<span className="text-emerald-400">ForGood</span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            Bringing communities together through meaningful social
            initiatives. Join hands, create change, and make a
            positive difference.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/" className="text-sm text-slate-400 hover:text-emerald-400">
              Home
            </Link>
            <Link href="/events" className="text-sm text-slate-400 hover:text-emerald-400">
              Upcoming Events
            </Link>
            <Link href="/create-event" className="text-sm text-slate-400 hover:text-emerald-400">
              Create Event
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Get In Touch</h3>

          <a
            href="mailto:contact@togetherforgood.example"
            className="mt-5 flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400"
          >
            <Mail className="size-4" />
            Contact Us
          </a>

          <Link
            href="/events"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Explore Events
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} TogetherForGood. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="size-4 text-emerald-400" /> for a better community
          </p>
        </div>
      </div>
    </footer>
  );
}