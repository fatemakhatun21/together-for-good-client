
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
    return (
        <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-700 px-6 py-16 text-center sm:px-12 lg:py-20">

                <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-2xl">
                    <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                        <Mail className="size-7" />
                    </div>

                    <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-100">
                        <Sparkles className="size-4" />
                        Stay Connected
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Be Part of Something Good
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-emerald-50/90">
                        Stay inspired by community initiatives, volunteering
                        opportunities, and stories that make a difference.
                    </p>

                    <div className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            aria-label="Email address"
                            className="h-13 min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-300"
                        />

                        <button
                            type="button"
                            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Subscribe
                            <ArrowUpRight className="size-4" />
                        </button>
                    </div>

                    <p className="mt-5 text-xs text-emerald-100/80">
                        Inspiring communities, one event at a time.
                    </p>
                </div>
            </div>
        </section>
    );
}
