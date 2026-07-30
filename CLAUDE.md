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
| UAE visa application form + document upload + email confirmation (full flow — see Visa Flow section) | CORE | 2 |
| Simple enquiry form for UK/US/Schengen/other country visas (see Visa Flow section) | CORE | 1–2 |
| Staff status dashboard (Approve/Decline/Under Review for UAE applications + auto-email) | CORE | 2 |
| Tour enquiry page for personalized/custom itineraries (separate from the fixed-price Tours catalogue) | CORE | 1 |
| Tours/Transport booking confirmation (reference number + email, same system as visa portal) | CORE | 2 |
| Public applicant status-tracking page (reference number + email lookup) | NICE-TO-HAVE — only build if time allows in Week 3 | — |
| Third-party ticketing API integration (Rathin API — see section below) | Docs received; credentials (ClientId/Secret + domain) still needed from client before building the integration | — |

## Visa Flow — TWO TIERS (confirmed by client)
The client clarified this is NOT one uniform flow for all countries. There are
two distinct paths:

### Tier 1 — UAE Visa: Full Application Flow (VFS Global–style)
This is the "real" application portal with document upload and status tracking.
1. Applicant selects UAE visa type (96hrs / 30-day / 60-day — see checklist
   below), fills personal + travel details
2. Applicant uploads required documents per the checklist below
3. On submit: generate unique reference number, send instant email
   ("Application received — under review")
4. Staff dashboard (auth-protected): list all applications, open one, set
   status to `under_review` | `approved` | `declined`
5. Any status change triggers an automated email to the applicant

**UAE visa document checklists (client-provided, exact — use as-is):**

*96hrs Visa:*
- Passport data page (minimum 6 months validity)
- Passport photo, white background
- Confirmed Emirates flight ticket
- Proof of accommodation
- Additional: 6 months' bank statement showing an equivalent balance of
  USD 10,000 held for each of the last 6 months
- Note: some nationalities may require additional documents (e.g. national ID)

*30-Day Visit Visa:*
- Passport data page (minimum 6 months validity)
- Passport photo, white background
- Flight ticket
- Proof of accommodation
- Note: some nationalities may require additional documents

*60-Day Visit Visa:*
- Passport data page (minimum 6 months validity)
- Passport photo, white background
- Flight ticket
- Proof of accommodation
- Note: some nationalities may require additional documents

For any other UAE visa type not listed above, the form should route the
customer to a general enquiry instead of a fixed checklist.

### Tier 2 — UK / US / Schengen / Other Countries: Simple Enquiry Form
NOT a document-upload flow. Client explicitly asked for a lightweight enquiry
form, sent as a reference screenshot: country dropdown, Name, Email, Contact
Number, Visa Type dropdown, and an "Apply Now" submit button, plus a footer
with phone/hours/email contact info. On submit, this goes to a backend/admin
view (not necessarily the same status-tracking system as Tier 1) and staff
follow up with the customer directly (phone/email/WhatsApp) — no automated
status emails required for this tier. Match the clean, minimal style of the
reference screenshot (rounded dropdowns, single accent-color button, soft
gray info cards below the form) as a UI/UX starting point, restyled to match
the new AGIL brand rather than copied verbatim.

## Tour Enquiry Page (NEW — client requested)
Separate from the fixed-price Tours catalogue (the "Book Now" flow with
pre-set tours/prices). This is for customers who want a custom/personalized
itinerary instead of picking from the catalogue. Should route to the same
kind of enquiry/backend + follow-up pattern as Tier 2 visas above, not the
instant-booking flow. Confirm with client whether this is a standalone page
or a form embedded on the Tours page.

## Brand Assets — Confirmed From Live Site
These are real asset URLs pulled directly from the reference site. Claude Code
will have normal internet access when running locally (unlike this planning
conversation, which is network-sandboxed) — fetch these directly rather than
recreating them from scratch.

**Logo:**
`https://pharmachelle-careconnect.vercel.app/assets/logo-DvOSFNyZ.jpg`
(715x715, alt text: "AGIL Travels")

**Hero image:**
`https://pharmachelle-careconnect.vercel.app/assets/hero-travel-CkJ6XSdU.jpg`
(1920x1080, aerial view of airplane over tropical islands)

**Destination images** (used on homepage destination cards):
- Dubai: `.../assets/dest-dubai-DrZCUUeC.jpg`
- UK: `.../assets/dest-uk-DZeyDLwf.jpg`
- Canada: `.../assets/dest-canada-D6j_qE8E.jpg`
- USA: `.../assets/dest-usa-C2ehAI3v.jpg`
- South Africa: `.../assets/dest-sa-BVf51U_L.jpg`
- Turkey: `.../assets/dest-turkey-_ZNEflgm.jpg`
- Saudi Arabia: `.../assets/dest-saudi-BjuTP4AW.jpg`
(all under the same `pharmachelle-careconnect.vercel.app/assets/` base path)

**Confirmed brand colors** (pulled from live CSS variables, HSL format):
- `--primary: 234 75% 30%` — deep navy blue
- `--accent` / `--secondary: 42 88% 55%` — gold/amber
- `--background: 0 0% 100%` — white
- `--foreground: 220 40% 13%` — dark navy (body text)

This confirms a navy-and-gold palette, consistent with Configur's existing
premium visual style — safe to carry forward into the redesign rather than
inventing a new palette, unless the client says otherwise.

**Not available from the live site** (ask the client directly if needed):
favicon (none found), vector/SVG logo source, brand guidelines document, fonts
in use beyond what's computed at runtime.


Client sent Postman docs: https://documenter.getpostman.com/view/32356669/2sB3QJQBKr
This is a third-party PARK/ATTRACTION ticketing inventory API — not a generic
booking-ticket generator. It supplies live park/attraction data (availability,
ticket types, pricing, images, details) — likely meant to power the Tours
section dynamically rather than from static hand-entered content. Revisit the
"Recreate Everything" Tours section above in light of this: confirm with the
client whether ALL tours should come from this live API, or only some
(e.g. Global Village / major attractions), with the rest remaining static
content as originally planned.

**Auth flow:**
- `GET {{domain}}/api/auth/v2/token` — headers: `ClientId`, `ClientSecret` →
  returns a bearer token
- All subsequent calls use `Authorization: {{Token}}`

**Endpoints:**
- `POST {{domain}}/api/park/v2/availability/park` — list available
  parks/attractions (filterable, e.g. `status = "Y"`)
- `POST {{domain}}/api/park/v2/common/search/custTicketType` — ticket types +
  pricing for a given `parkId`
- `GET {{domain}}/api/park/v1/image/{id}` — park images
- `GET {{domain}}/api/park/v2/details/{id}` — full park details (also appears
  to double as the T&C content endpoint)

**STILL MISSING — ask the client for these before building the integration:**
- Real `ClientId` / `ClientSecret`
- The actual `{{domain}}` base URL (not in the public doc)

**Security note:** the public doc page has example cURL calls with real-looking
JWTs hardcoded in them (issued mid-2024, likely expired). Do not copy those
tokens into any code or commit them anywhere — get fresh credentials from the
client and store them as environment variables, never hardcoded.

## Open Questions (confirm with client before building)
1. ~~Which countries/visa types at launch~~ — ANSWERED: UAE gets the full
   application flow (96hrs/30-day/60-day, checklists above); UK/US/Schengen/
   other countries get the simple enquiry form (Tier 2). Still worth
   confirming the exact "other countries" list to show in that dropdown.
2. ~~Document checklist per visa type~~ — ANSWERED for UAE (see checklists
   above). Not needed for Tier 2 countries since it's enquiry-only, no
   document upload.
3. Who gets staff dashboard access — one account or multiple?
4. Confirm public tracking page is out of scope for the ₦300,000 fee unless
   time allows.
5. When will the ticketing API docs/credentials be shared?
6. Can the client provide the actual tour list, pricing, and copy from the old
   site (or export access to it), so content doesn't have to be reconstructed
   by hand from screenshots?
7. Should Tours content come live from the Rathin API, remain static
   (client-provided list), or a mix? If live, need ClientId/ClientSecret and
   the API base domain before that work can start.
8. Is the Tour Enquiry page (for personalized itineraries) a standalone page
   or embedded on the existing Tours page?

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