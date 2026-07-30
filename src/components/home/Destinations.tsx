import Image from "next/image";
import Link from "next/link";
import { enquiryLink } from "@/lib/site";

type Destination = { name: string; image: string; blurb: string };

const destinations: Destination[] = [
  { name: "Dubai, UAE", image: "/destinations/dubai.jpg", blurb: "Our home base" },
  { name: "United Kingdom", image: "/destinations/uk.jpg", blurb: "Visa & travel" },
  { name: "United States", image: "/destinations/usa.jpg", blurb: "Visa & travel" },
  { name: "Canada", image: "/destinations/canada.jpg", blurb: "Visa & travel" },
  { name: "Turkey", image: "/destinations/turkey.jpg", blurb: "Tours & transit" },
  { name: "Saudi Arabia", image: "/destinations/saudi-arabia.jpg", blurb: "Visa & travel" },
  { name: "South Africa", image: "/destinations/south-africa.jpg", blurb: "Visa & travel" },
];

export function Destinations() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-600">
            Where we take you
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Popular destinations
          </h2>
          <p className="mt-4 text-lg leading-8 text-brand-500">
            From the Emirates to the wider world — we handle visas, flights, and
            trips across the destinations our travellers ask for most.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <Link
              key={d.name}
              href={enquiryLink()}
              className="group relative overflow-hidden rounded-2xl"
            >
              <Image
                src={d.image}
                alt={d.name}
                width={800}
                height={1024}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={i < 4}
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gold-300">
                  {d.blurb}
                </p>
                <p className="mt-0.5 text-base font-semibold text-white">{d.name}</p>
              </div>
            </Link>
          ))}

          {/* CTA tile to fill the grid */}
          <Link
            href={enquiryLink()}
            className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-200 bg-sand-50 p-4 text-center transition-colors hover:border-brand-300 hover:bg-sand-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5v14" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-brand-800">
              Somewhere else?
            </span>
            <span className="text-xs text-brand-500">Tell us where</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
