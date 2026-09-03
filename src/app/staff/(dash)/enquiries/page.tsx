import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import {
  listVisaEnquiries,
  listTourEnquiries,
  listHotelEnquiries,
  listQuoteRequests,
  type EnquiryType,
} from "@/lib/enquiries-admin";
import { EnquiryStatusControl } from "@/components/staff/EnquiryStatusControl";

export const dynamic = "force-dynamic";

function Contact({ email, phone }: { email: string; phone: string }) {
  const wa = phone.replace(/[^0-9]/g, "");
  return (
    <div className="text-xs">
      <a href={`mailto:${email}`} className="text-brand-700 hover:text-brand-900">
        {email}
      </a>
      <div className="mt-0.5">
        <a
          href={wa ? `https://wa.me/${wa}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:text-brand-800"
        >
          {phone}
        </a>
      </div>
    </div>
  );
}

function Section({
  title,
  type,
  count,
  children,
}: {
  title: string;
  type: EnquiryType;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section id={type} className="mb-10">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-bold text-brand-900">{title}</h2>
        <span className="text-xs text-brand-500">{count}</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </section>
  );
}

const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-500";
const td = "px-4 py-3 align-top";

export default async function EnquiriesPage() {
  await requireStaff();

  let visa, tour, hotel, quotes;
  try {
    [visa, tour, hotel, quotes] = await Promise.all([
      listVisaEnquiries(),
      listTourEnquiries(),
      listHotelEnquiries(),
      listQuoteRequests(),
    ]);
  } catch (err) {
    console.error("enquiries load failed:", err);
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        <p className="font-semibold">Couldn&apos;t load enquiries.</p>
        <p className="mt-1">
          Make sure <code className="rounded bg-amber-100 px-1">schema.sql</code>,{" "}
          <code className="rounded bg-amber-100 px-1">002_updates.sql</code>, and{" "}
          <code className="rounded bg-amber-100 px-1">004_quotes.sql</code> have been run.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-brand-900">Enquiries</h1>
        <div className="flex gap-3 text-xs text-brand-500">
          <a href="#quote" className="hover:text-brand-900">Quotes ({quotes.length})</a>
          <a href="#visa" className="hover:text-brand-900">Visa ({visa.length})</a>
          <a href="#tour" className="hover:text-brand-900">Tours ({tour.length})</a>
          <a href="#hotel" className="hover:text-brand-900">Hotels ({hotel.length})</a>
        </div>
      </div>
      <p className="mt-1 text-sm text-brand-500">
        Enquiries from the website. Reach out by email or WhatsApp, then mark them
        contacted or closed.
      </p>

      <div className="mt-8">
        {/* Quote requests */}
        <Section title="Instant-quote requests" type="quote" count={quotes.length}>
          <thead className="border-b border-brand-100 bg-sand-50">
            <tr>
              <th className={th}>Contact</th>
              <th className={th}>Trip</th>
              <th className={th}>Estimate</th>
              <th className={th}>Received</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {quotes.length === 0 ? (
              <tr><td className={td} colSpan={5}><span className="text-brand-400">No quote requests.</span></td></tr>
            ) : (
              quotes.map((e) => (
                <tr key={e.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-900">{e.full_name}</div>
                    <Contact email={e.email} phone={e.phone} />
                  </td>
                  <td className={td}>
                    <div className="text-brand-900">{e.destination || "—"}</div>
                    <div className="text-xs text-brand-500">
                      {[
                        e.travellers ? `${e.travellers} pax` : null,
                        e.nights ? `${e.nights} nights` : null,
                        (e.services ?? []).join(", "),
                      ].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td className={td}>{e.estimate_aed != null ? `AED ${e.estimate_aed.toLocaleString()}` : "—"}</td>
                  <td className={td}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className={td}><EnquiryStatusControl type="quote" id={e.id} current={e.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </Section>

        {/* Visa enquiries */}
        <Section title="Visa enquiries" type="visa" count={visa.length}>
          <thead className="border-b border-brand-100 bg-sand-50">
            <tr>
              <th className={th}>Applicant</th>
              <th className={th}>Country / Type</th>
              <th className={th}>Nationality</th>
              <th className={th}>Received</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {visa.length === 0 ? (
              <tr><td className={td} colSpan={5}><span className="text-brand-400">No visa enquiries.</span></td></tr>
            ) : (
              visa.map((e) => (
                <tr key={e.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-900">{e.full_name}</div>
                    <Contact email={e.email} phone={e.phone} />
                  </td>
                  <td className={td}>
                    <div className="text-brand-900">{e.country}</div>
                    <div className="text-xs text-brand-500">{e.visa_type}</div>
                  </td>
                  <td className={td}>{e.nationality || "—"}</td>
                  <td className={td}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className={td}><EnquiryStatusControl type="visa" id={e.id} current={e.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </Section>

        {/* Tour enquiries */}
        <Section title="Tour / custom itinerary enquiries" type="tour" count={tour.length}>
          <thead className="border-b border-brand-100 bg-sand-50">
            <tr>
              <th className={th}>Contact</th>
              <th className={th}>Trip</th>
              <th className={th}>Budget</th>
              <th className={th}>Received</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {tour.length === 0 ? (
              <tr><td className={td} colSpan={5}><span className="text-brand-400">No tour enquiries.</span></td></tr>
            ) : (
              tour.map((e) => (
                <tr key={e.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-900">{e.full_name}</div>
                    <Contact email={e.email} phone={e.phone} />
                  </td>
                  <td className={td}>
                    <div className="text-brand-900">{e.destination || "—"}</div>
                    <div className="text-xs text-brand-500">
                      {[e.travellers ? `${e.travellers} travellers` : null, e.travel_dates].filter(Boolean).join(" · ") || ""}
                    </div>
                  </td>
                  <td className={td}>{e.budget_range || "—"}</td>
                  <td className={td}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className={td}><EnquiryStatusControl type="tour" id={e.id} current={e.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </Section>

        {/* Hotel enquiries */}
        <Section title="Hotel & apartment enquiries" type="hotel" count={hotel.length}>
          <thead className="border-b border-brand-100 bg-sand-50">
            <tr>
              <th className={th}>Contact</th>
              <th className={th}>Stay</th>
              <th className={th}>Guests</th>
              <th className={th}>Received</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {hotel.length === 0 ? (
              <tr><td className={td} colSpan={5}><span className="text-brand-400">No hotel enquiries.</span></td></tr>
            ) : (
              hotel.map((e) => (
                <tr key={e.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-900">{e.full_name}</div>
                    <Contact email={e.email} phone={e.phone} />
                  </td>
                  <td className={td}>
                    <div className="text-brand-900">{e.city}, {e.country}</div>
                    <div className="text-xs text-brand-500">
                      {[e.check_in, e.check_out].filter(Boolean).join(" → ") || "dates TBC"}
                      {e.star_rating && e.star_rating !== "Any" ? ` · ${e.star_rating}` : ""}
                      {e.hotel_name ? ` · ${e.hotel_name}` : ""}
                    </div>
                  </td>
                  <td className={td}>
                    {[
                      e.rooms ? `${e.rooms} rm` : null,
                      e.adults != null ? `${e.adults} ad` : null,
                      e.children ? `${e.children} ch` : null,
                    ].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className={td}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className={td}><EnquiryStatusControl type="hotel" id={e.id} current={e.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </Section>
      </div>

      <Link href="/staff" className="text-sm font-medium text-brand-600 hover:text-brand-900">
        ← Visa applications
      </Link>
    </div>
  );
}
