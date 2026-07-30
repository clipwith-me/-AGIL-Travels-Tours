/**
 * Central site configuration for AGIL Travels and Tours.
 *
 * NOTE (Week 1): the WhatsApp number and public contact details below are
 * placeholders pending confirmation from the client. Update these values in
 * one place and every CTA/footer link across the site follows. See the
 * "needs client confirmation" flags.
 */

export const site = {
  name: "AGIL Travels and Tours",
  shortName: "AGIL Travels",
  tagline: "Your Safety Is Our First Priority.",
  description:
    "UAE travel agency for travellers worldwide — visa assistance, flights, hotels, transfers, tours, and expert travel consultation.",

  // TODO(client): confirm the official WhatsApp Business number in E.164 digits
  // (no "+", no spaces). Placeholder below keeps links well-formed until then.
  whatsappNumber: "9710000000000",

  // TODO(client): confirm which address is the public-facing enquiry inbox.
  // The proposal lists gbeleyiinvestmentlimited@gmail.com (primary),
  // Agilvisa1@gmail.com, and Ceoagil@outlook.com.
  contactEmail: "Agilvisa1@gmail.com",

  socials: {
    // TODO(client): confirm real social handles/URLs.
    whatsapp: "", // filled by whatsappLink() below
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
} as const;

/** Build a wa.me enquiry link with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build an internal enquiry-form link, optionally preselecting a service. */
export function enquiryLink(serviceSlug?: string): string {
  return serviceSlug ? `/enquiry?service=${serviceSlug}` : "/enquiry";
}

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Visa", href: "/visa" },
  { label: "Tours", href: "/tours" },
  { label: "Transport", href: "/transport" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" },
];
