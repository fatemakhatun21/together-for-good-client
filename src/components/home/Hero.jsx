import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    HeartHandshake,
    Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden bg-white">
            <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-50/70 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-48 -left-32 h-[400px] w-[400px] rounded-full bg-green-50/60 blur-3xl" />

            <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">

                <div className="flex flex-col items-start">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        <Sparkles className="size-4" />
                        Together, we make a difference
                    </div>

                    <h1 className="max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.65rem]">
                        Small Actions.
                        <br />
                        <span className="text-emerald-600">
                            Big Impact.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
                        Discover meaningful community events, connect with
                        passionate volunteers, and turn small acts of kindness
                        into lasting positive change.
                    </p>

                    <div className="mt-9 flex w-full flex-wrap items-center gap-4 sm:w-auto">

                        <Link
                            href="/events"
                            className={`${buttonVariants()} inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-base font-semibold text-white shadow-md shadow-emerald-600/15 transition-colors hover:bg-emerald-700`}
                        >
                            Explore Events
                            <ArrowUpRight className="size-4 shrink-0" />
                        </Link>

                        <Link
                            href="/create-event"
                            className={`${buttonVariants({
                                variant: "outline",
                            })} inline-flex h-12 items-center justify-center gap-2 rounded-full border-emerald-200 bg-white px-7 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800`}
                        >
                            <HeartHandshake className="size-5 shrink-0" />
                            Create Event
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-3 border-t border-slate-100 pt-6">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <HeartHandshake className="size-6" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Every action matters
                            </p>
                            <p className="text-xs text-slate-500">
                                Make a difference in your community
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto mt-4 flex w-full items-center justify-center lg:mt-0">
                    <div className="pointer-events-none absolute inset-8 rounded-full bg-emerald-50/50 blur-3xl" />

                    <Image
                        src="/hero-banner.png"
                        alt="Volunteers working together to clean their community"
                        width={720}
                        height={620}
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="relative z-10 h-auto w-[65%] max-w-[240px] object-contain sm:w-[70%] sm:max-w-[300px] lg:w-full lg:max-w-[550px]"
                    />
                </div>
            </div>
        </section>
    );
}
