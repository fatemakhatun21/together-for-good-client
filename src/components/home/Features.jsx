
import {
  CalendarPlus,
  Users,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: CalendarPlus,
    title: "Create Events",
    description:
      "Organize meaningful community events and bring people together to make a positive impact.",
  },
  {
    icon: Users,
    title: "Join Communities",
    description:
      "Discover upcoming events, connect with volunteers, and participate in local initiatives.",
  },
  {
    icon: HeartHandshake,
    title: "Make an Impact",
    description:
      "Contribute to social development through volunteering, donations, and community action.",
  },
];

export default function Features() {
  return (
    <section className="bg-emerald-50/40 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            What We Offer
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Together, We Create Change
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            Everything you need to connect with your community,
            support meaningful causes, and make a lasting difference.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="size-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <ArrowUpRight className="mt-6 size-5 text-emerald-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
