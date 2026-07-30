import Link from "next/link";
import { services, type Service } from "@/lib/services";
import { whatsappLink } from "@/lib/site";

function ServiceCard({ service }: { service: Service }) {
  const isWhatsapp = service.funnel === "whatsapp";
  const href = isWhatsapp
    ? whatsappLink(`Hello AGIL Travels, I'd like help with ${service.title}.`)
    : service.href ?? "/#services";

  const ctaLabel = isWhatsapp ? "Enquire" : "View options";
  const ctaClass =
    "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900";

  const arrow = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-0.5"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <article className="group flex flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-800 group-hover:text-gold-400">
        {service.icon}
      </span>

      <h3 className="mt-5 text-lg font-semibold text-brand-900">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-brand-500">
        {service.blurb}
      </p>

      {isWhatsapp ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaClass}
        >
          {ctaLabel}
          {arrow}
        </a>
      ) : (
        <Link href={href} className={ctaClass}>
          {ctaLabel}
          {arrow}
        </Link>
      )}
    </article>
  );
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-sand-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-600">
            What we do
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Six services, one trusted team
          </h2>
          <p className="mt-4 text-lg leading-8 text-brand-500">
            From your visa to your final excursion, AGIL handles every part of
            your UAE trip — so you travel safely and stress-free.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
