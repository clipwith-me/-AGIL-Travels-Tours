import Link from "next/link";

/** Compact hero band used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 80% at 90% 0%, rgba(217,165,50,0.22) 0%, rgba(217,165,50,0) 60%), radial-gradient(50% 60% at 0% 100%, rgba(44,95,158,0.4) 0%, rgba(44,95,158,0) 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <nav className="mb-4 text-xs font-medium text-brand-200">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="px-2 text-brand-400">/</span>
          <span className="text-gold-300">{title}</span>
        </nav>
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-brand-100">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
