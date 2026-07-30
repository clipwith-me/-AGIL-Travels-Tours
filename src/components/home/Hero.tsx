import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      {/* Decorative gradient / desert-dusk feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 85% 10%, rgba(217,165,50,0.25) 0%, rgba(217,165,50,0) 60%), radial-gradient(50% 50% at 10% 90%, rgba(44,95,158,0.45) 0%, rgba(44,95,158,0) 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-300">
          UAE Travel Specialists
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Travel the Emirates with confidence.
          <span className="block text-gold-400">{site.tagline}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-100">
          {site.name} handles your visa, flights, hotels, transfers, and tours —
          end to end. One trusted team for Nigerian and African travellers
          heading to the UAE.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(
              "Hello AGIL Travels, I'd like to plan a trip to the UAE.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gold-500 px-7 py-3.5 text-base font-semibold text-brand-950 shadow-lg shadow-gold-500/20 transition-colors hover:bg-gold-400"
          >
            Plan your trip
          </a>
          <Link
            href="/#services"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Explore our services
          </Link>
        </div>

        {/* Trust bullets */}
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-100">
          {[
            "Visa-to-tour, all in one place",
            "Real confirmations, real reference numbers",
            "Local UAE knowledge",
          ].map((point) => (
            <li key={point} className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gold-400"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
