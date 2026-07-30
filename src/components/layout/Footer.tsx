import Link from "next/link";
import { primaryNav, site, whatsappLink } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-auto bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {/* Brand + tagline */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 font-bold text-gold-400">
              A
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              AGIL Travels &amp; Tours
            </span>
          </div>
          <p className="mt-4 text-sm text-gold-300">{site.tagline}</p>
          <p className="mt-3 text-sm text-brand-200">{site.description}</p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href="/#services"
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={whatsappLink("Hello AGIL Travels, I'd like to make an enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-200 transition-colors hover:text-white"
              >
                WhatsApp enquiry
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-brand-200 transition-colors hover:text-white"
              >
                {site.contactEmail}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-200 hover:text-white"
              >
                Facebook
              </a>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-200 hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-brand-300 sm:px-6">
          © {year} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
