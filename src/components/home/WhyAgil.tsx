const pillars = [
  {
    title: "Safety first, always",
    body: "Our whole promise starts here. Vetted partners, verified bookings, and clear communication at every step — no guesswork, no surprises.",
  },
  {
    title: "One team, end to end",
    body: "Visa, flights, hotels, transfers, and tours from a single point of contact. No juggling five different vendors for one trip.",
  },
  {
    title: "Real confirmations",
    body: "Every booking produces a genuine reference number and confirmation — so you always know exactly where your trip stands.",
  },
  {
    title: "Built for travellers everywhere",
    body: "Wherever you're travelling from, we handle the details that matter and plan your UAE trip around what's important to you.",
  },
];

export function WhyAgil() {
  return (
    <section id="why" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              Why AGIL
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
              Your safety is our first priority
            </h2>
            <p className="mt-4 text-lg leading-8 text-brand-500">
              We&apos;re a UAE-focused travel agency built around trust. That
              means doing the small things right — confirming every booking,
              answering quickly, and standing behind your trip from planning to
              return.
            </p>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title}>
                <dt className="flex items-center gap-2 text-base font-semibold text-brand-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/15 text-gold-600">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    </svg>
                  </span>
                  {p.title}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-brand-500">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
