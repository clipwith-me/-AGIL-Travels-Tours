# AGIL Travels and Tours — New Website Build (From Scratch)

## Project Overview
UAE-focused travel agency site serving Nigerian/African travellers, tagline
"Your Safety Is Our First Priority." Six service lines: Visa Assistance, Flight
Ticket Booking, Hotel Reservations, Transportation & Transfers, Tour & Excursion
Packages, Travel Consultation.

**This is a ground-up rebuild, not a modification of an existing repo.** The
client has an old site at pharmachelle-careconnect.vercel.app (built by a
previous developer) that we are replacing entirely with a new codebase. That
old site is reference material only — a source of truth for what features and
content must exist in the new build — not a codebase we inherit or branch from.

Recommended stack: React + Vite (or Next.js — see routing note below) +
Tailwind, deployed on Vercel. Payment: Stripe + Ziina both integrated fresh
(see Feature Priorities). Backend: lightweight (e.g. Supabase) for bookings,
visa applications, and the staff dashboard — pick whatever's fastest to stand
up cleanly within the timeline.

Scope: web only (mobile app postponed). Fixed fee: ₦300,000 (₦50,000 deposit
received, ₦250,000 balance due in full at launch — see Constraints). Timeline:
3 weeks. Full scope doc: see project proposal shared with client — ask user if
not present.

Client contact: Ayo Gbeleyi, Director/Managing Director, AGIL GROUP —
gbeleyiinvestmentlimited@gmail.com (primary reply channel), cc'd on
Agilvisa1@gmail.com and Ceoagil@outlook.com.

## MANDATORY: Recreate Everything From the Reference Site
The client wants all functionality from the old site rebuilt fresh in the new
one, plus the new features below. This is an agency engagement — nothing the
client currently has should be missing from the new build. Confirmed present
on the reference site (audited directly), all of it must be rebuilt:

- **Tours catalogue**: 40+ tours across 6 categories (Desert Safari, Landmarks,
  Theme Parks, Cruises, Adventure, Nature & Wildlife) with real pricing and
  filtering. Get the actual tour list/copy/prices from the user or the old
  site before inventing placeholder content.
- **Transport catalogue**: Airport Transfers, City Tours, Private Car Hire,
  Limousine — each with its own detail page (itinerary + FAQ sections).
- **Payment**: Ziina (UAE-local) rebuilt fresh, with Stripe added alongside it
  for international cards — both live from launch, not just one.
- **WhatsApp enquiry funnel**: Visa, Flights, Hotels, and Consultation route to
  a WhatsApp-based enquiry form (wa.me links), now with the new budget-range
  field added.
- **All six service pages** with real content — pull existing copy from the
  reference site where it's good; don't fabricate service descriptions from
  scratch if usable copy already exists.
- **Social/contact links** (WhatsApp, Facebook, etc.).

If something on the reference site isn't listed above, don't assume it's
out of scope — ask the user rather than silently dropping it.

## Confirmed Content Captured During Audit (PARTIAL — not the full catalogue)
These are exact items directly observed on the reference site during the audit.
Use as real seed data and as a style/format reference for the rest — do NOT
invent the remaining ~35 tours or fill gaps with fabricated content. The client
content export (requested separately) is the source of truth for anything not
listed here. If the export hasn't arrived yet when this section is needed,
pause and ask the user rather than generating placeholder tours as if real.

**Tours confirmed (category: mixed, 6 categories total exist — Desert Safari,
Landmarks, Theme Parks, Cruises, Adventure, Nature & Wildlife):**
- Classic Desert Safari — $55 — "4x4 dune bashing, camel ride, BBQ dinner,
  Tanoura, Belly & Fire shows at a Bedouin camp" — 6 hours (afternoon–night)
- Premium Desert Safari (exact name unconfirmed) — $95 — VIP-tier version,
  premium service — 7 hours
- Dubai Frame — $20 — "Panoramic views of old and new Dubai from the iconic
  golden frame" — 1 hour — category: Landmarks
- The Palm Monorail — category: Landmarks — price/description not captured
- A museum-related tour was also visible on the Landmarks tab — name and
  details not captured

**Transport services confirmed (4 total):**
- Airport Transfers — has a full detail page with itinerary + FAQ sections
- City Tours
- Private Car Hire
- Limousine Service

**Booking modal format observed** (for Tours "Book Now"): shows price, full
name field, optional email, start/end date, number of travellers, pickup/hotel
details field — useful as a UI/UX reference for the new booking form.


The reference site has a routing bug worth learning from: every service/detail
route (e.g. `/services/tours`, `/transport/airport-transfers`) 404s on direct
load or refresh, because the SPA was deployed on Vercel without a fallback
rewrite. **Since we're building fresh, avoid this from the start**: if using a
Vite SPA, add a `vercel.json` rewrite (`{ "source": "/(.*)", "destination":
"/index.html" }`) as part of initial setup, not as a later fix. Next.js sidesteps
this entirely via file-based routing — worth considering for that reason alone.

Also avoid the reference site's other gaps by building these right the first
time: "Book Now" / "Request Booking" / "Ask a Question" buttons must all be
functional from the start (the old site has several that do nothing), and
every booking (Tours, Transport, and visa applications) must produce a real
reference number and confirmation email — the old site's Ziina flow takes
payment but never confirms anything afterward; don't repeat that.

## Feature Priorities (CORE = must ship in 3 weeks)

| Feature | Priority | Week |
|---|---|---|
| Full site build, all 7 pages — content/features per "Recreate Everything" above | CORE | 1 |
| Correct routing/deployment config from the start (see pitfall above) | CORE | 1 |
| FAQ page (categorised: Visa, Flights, Hotels, Tours, Payments, General) | CORE | 1 |
| Enquiry form + budget-range field (WhatsApp funnel) | CORE | 1 |
| Stripe + Ziina payment, both live | CORE | 1–2 |
| Visa application form + document upload + email confirmation | CORE | 2 |
| Staff status dashboard (Approve/Decline/Under Review + auto-email) | CORE | 2 |
| Tours/Transport booking confirmation (reference number + email, same system as visa portal) | CORE | 2 |
| Public applicant status-tracking page (reference number + email lookup) | NICE-TO-HAVE — only build if time allows in Week 3 | — |
| Third-party ticketing API integration | TBD — client providing API docs, not yet received. Do not start until docs are in hand. | — |

## Visa Portal Flow (VFS Global–style)
1. Applicant selects visa type/destination, fills personal + travel details
2. Applicant uploads required documents (passport copy, photo, supporting docs —
   exact per-country checklist TBD, confirm with client before building the form)
3. On submit: generate unique reference number, send instant email
   ("Application received — under review")
4. Staff dashboard (auth-protected): list all applications, open one, set status
   to `under_review` | `approved` | `declined`
5. Any status change triggers an automated email to the applicant

## Open Questions (confirm with client before building)
1. Which countries/visa types at launch — full list (UAE, UK, USA, Schengen,
   Canada) or a smaller starting set?
2. Document checklist per visa type?
3. Who gets staff dashboard access — one account or multiple?
4. Confirm public tracking page is out of scope for the ₦300,000 fee unless
   time allows.
5. When will the ticketing API docs/credentials be shared?
6. Can the client provide the actual tour list, pricing, and copy from the old
   site (or export access to it), so content doesn't have to be reconstructed
   by hand from screenshots?

## Constraints
- Fixed fee project — be mindful of scope creep. Anything not listed as CORE
  above should be flagged to the user before building, not built by default.
- No mobile app in this phase.
- Payment terms: ₦50,000 deposit received. ₦250,000 balance due in full at
  launch — before final source files and hosting access are handed over
  (per signed service agreement). Do not treat the balance as optional or
  negotiable mid-build; if the client raises payment issues during
  development, flag to the user rather than resolving unilaterally.
- Agency standard: this build should reflect professional quality throughout —
  clean code, sensible commits, no shortcuts that would embarrass a portfolio
  piece. Treat this as flagship work, not a rushed cheap job, regardless of
  the fee negotiation history.
