import Image from "next/image";

const galleryImages = [
    {
        src: "/gallery/plantation.jpg",
        title: "Tree Plantation",
    },
    {
        src: "/gallery/cleanup.jpg",
        title: "Community Cleanup",
    },
    {
        src: "/gallery/food-donation.jpg",
        title: "Food Donation",
    },
    {
        src: "/gallery/clothes-donation.jpg",
        title: "Clothes Distribution",
    },
    {
        src: "/gallery/volunteering.jpg",
        title: "Volunteering",
    },
    {
        src: "/gallery/community.jpg",
        title: "Community Support",
    },
];

export default function Gallery() {
    return (
        <section className="bg-white px-5 py-20 transition-colors sm:px-8 lg:py-24 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        Our Community
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Moments That Make a Difference
                    </h2>

                    <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                        Discover inspiring moments of kindness, teamwork,
                        and positive change in our communities.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((image) => (
                        <div
                            key={image.src}
                            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800"
                        >
                            <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-transparent to-transparent p-6">
                                <h3 className="text-lg font-semibold text-white">
                                    {image.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
