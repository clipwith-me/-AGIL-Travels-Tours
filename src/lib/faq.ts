/**
 * FAQ content, grouped into the six categories required by the spec:
 * Visa, Flights, Hotels, Tours, Payments, General.
 *
 * Answers here are intentionally general and safe. They do NOT state specific
 * processing times, prices, refund windows, or per-country visa rules, because
 * those depend on client policy and are not yet confirmed. Replace/expand with
 * the client's real answers before launch — flagged for client review.
 */

export type FaqItem = { q: string; a: string };
export type FaqCategory = { slug: string; name: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    slug: "visa",
    name: "Visa",
    items: [
      {
        q: "Which visas can AGIL help me with?",
        a: "We assist with UAE visas and a range of international destinations. Tell us where you're travelling and we'll confirm eligibility and the exact requirements for your case.",
      },
      {
        q: "What documents will I need?",
        a: "Requirements vary by destination and visa type — typically a valid passport, a photo, and supporting documents. Start an enquiry and we'll send you the checklist that applies to you.",
      },
      {
        q: "Do you guarantee visa approval?",
        a: "No agency can guarantee approval — the decision rests with the issuing authority. What we do is make sure your application is complete, correct, and submitted properly to give it the best chance.",
      },
    ],
  },
  {
    slug: "flights",
    name: "Flights",
    items: [
      {
        q: "Can you book flights to and from the UAE?",
        a: "Yes. Wherever you're flying from, share your travel dates and preferences and we'll find suitable routing and fares in and out of the UAE.",
      },
      {
        q: "Can I change or cancel a booked flight?",
        a: "Changes and cancellations follow the airline's fare rules. We'll explain the conditions before you confirm any booking.",
      },
    ],
  },
  {
    slug: "hotels",
    name: "Hotels",
    items: [
      {
        q: "What kind of hotels do you book?",
        a: "Everything from value stays to premium hotels across the Emirates. We match the option to your trip and budget.",
      },
      {
        q: "Can you book hotels alongside my flights and transfers?",
        a: "Yes — that's the point of AGIL. We can arrange your visa, flights, hotel, and transfers together so it's one coordinated trip.",
      },
    ],
  },
  {
    slug: "tours",
    name: "Tours",
    items: [
      {
        q: "What tours and excursions do you offer?",
        a: "Our packages span desert safaris, landmarks, theme parks, cruises, adventure, and nature & wildlife. Browse the Tours page or enquire for the current line-up.",
      },
      {
        q: "How do I book a tour?",
        a: "Start an enquiry with the tour you're interested in and your dates. We'll confirm availability, details, and next steps.",
      },
    ],
  },
  {
    slug: "payments",
    name: "Payments",
    items: [
      {
        q: "How can I pay?",
        a: "We accept local UAE payments via Ziina and international cards via Stripe. Confirm your preferred method when you book.",
      },
      {
        q: "Will I get a confirmation after paying?",
        a: "Yes. Every booking produces a reference number and a confirmation — you'll always have a record of your booking.",
      },
    ],
  },
  {
    slug: "general",
    name: "General",
    items: [
      {
        q: "Who is AGIL Travels for?",
        a: "We help travellers from around the world plan safe, well-organised trips to the UAE — from the visa through to the final excursion.",
      },
      {
        q: "How do I get in touch?",
        a: "The fastest way is to start a WhatsApp enquiry. Tell us what you need and our team will respond and guide you through it.",
      },
    ],
  },
];
