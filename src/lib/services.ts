import { createElement as h, type ReactNode } from "react";

/**
 * The six AGIL service lines (from the project spec).
 *
 * Copy here is concise, honest placeholder copy describing each service — it is
 * NOT scraped from the reference site. Final marketing copy should be pulled
 * from the client's existing site / content export before launch.
 *
 * `funnel` = how the service is actioned:
 *   "whatsapp" — routes to the WhatsApp enquiry funnel (Visa, Flights, Hotels,
 *                Consultation).
 *   "catalogue" — has its own browsable catalogue + booking flow (Tours,
 *                 Transport). Those pages are built in Week 1–2.
 */
export type ServiceFunnel = "whatsapp" | "catalogue";

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  funnel: ServiceFunnel;
  /** Destination for the catalogue services (route to be built). */
  href?: string;
  /** Inline SVG icon. */
  icon: ReactNode;
};

// Icons are minimal inline SVGs (currentColor) — no icon library dependency.
const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const VisaIcon = h(
  "svg",
  iconProps,
  h("rect", { key: "r", x: 3, y: 5, width: 18, height: 14, rx: 2 }),
  h("path", { key: "p1", d: "M3 10h18" }),
  h("path", { key: "p2", d: "M7 15h4" }),
);

const FlightIcon = h(
  "svg",
  iconProps,
  h("path", {
    key: "p",
    d: "M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.9 4-2.2 2.2-2-.5a.5.5 0 0 0-.5.8L6 18l2.5 1.9a.5.5 0 0 0 .8-.5l-.5-2 2.2-2.2 4 3.9a.5.5 0 0 0 .8-.5Z",
  }),
);

const HotelIcon = h(
  "svg",
  iconProps,
  h("path", { key: "p1", d: "M3 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" }),
  h("path", { key: "p2", d: "M14 9h5a1 1 0 0 1 1 1v11" }),
  h("path", { key: "p3", d: "M2 21h20" }),
  h("path", { key: "p4", d: "M7 8h.01M7 12h.01M10 8h.01M10 12h.01" }),
);

const TransferIcon = h(
  "svg",
  iconProps,
  h("path", { key: "p1", d: "M5 17H3v-5l2-5h11l3 5h1a1 1 0 0 1 1 1v4h-2" }),
  h("circle", { key: "c1", cx: 7.5, cy: 17.5, r: 1.5 }),
  h("circle", { key: "c2", cx: 17.5, cy: 17.5, r: 1.5 }),
  h("path", { key: "p2", d: "M9 17h6" }),
);

const TourIcon = h(
  "svg",
  iconProps,
  h("circle", { key: "c", cx: 12, cy: 12, r: 9 }),
  h("path", { key: "p", d: "m15.5 8.5-2 5-5 2 2-5 5-2Z" }),
);

const ConsultIcon = h(
  "svg",
  iconProps,
  h("path", {
    key: "p1",
    d: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 20l1.4-4.2A8.5 8.5 0 1 1 21 11.5Z",
  }),
);

export const services: Service[] = [
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    blurb:
      "End-to-end support for visas worldwide — UAE, UK, US, Schengen, Canada and beyond. Eligibility checks, document guidance, and application handling from start to approval.",
    funnel: "catalogue",
    href: "/visa",
    icon: VisaIcon,
  },
  {
    slug: "flight-ticket-booking",
    title: "Flight Ticket Booking",
    blurb:
      "Competitive fares on flights to and from anywhere in the world, with routing and dates arranged around your schedule and budget.",
    funnel: "whatsapp",
    icon: FlightIcon,
  },
  {
    slug: "hotel-reservations",
    title: "Hotel & Apartment Rentals",
    blurb:
      "Hand-picked hotels and apartments worldwide to match your trip — tell us your destination and dates, and we'll find your stay.",
    funnel: "catalogue",
    href: "/hotels",
    icon: HotelIcon,
  },
  {
    slug: "transportation-transfers",
    title: "Transportation & Transfers",
    blurb:
      "Airport transfers, private car hire, city tours, and limousine service — safe, reliable ground transport throughout your stay.",
    funnel: "catalogue",
    href: "/transport",
    icon: TransferIcon,
  },
  {
    slug: "tour-excursion-packages",
    title: "Tour & Excursion Packages",
    blurb:
      "Desert safaris, landmarks, theme parks, cruises and more — curated experiences across the UAE with clear pricing.",
    funnel: "catalogue",
    href: "/tours",
    icon: TourIcon,
  },
  {
    slug: "travel-consultation",
    title: "Travel Consultation",
    blurb:
      "Not sure where to start? Talk to our team for tailored advice on itineraries, timing, budgets, and the safest way to travel.",
    funnel: "whatsapp",
    icon: ConsultIcon,
  },
];
