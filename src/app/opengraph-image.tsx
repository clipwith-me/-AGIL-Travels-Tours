import { ImageResponse } from "next/og";

export const alt = "AGIL Travels and Tours — Your Safety Is Our First Priority.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b2137 0%, #142f52 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="10" fill="#ffffff14" />
            <path d="M31 9 L8 18.2 L16.8 21.4 Z" fill="#f0d488" />
            <path d="M31 9 L16.8 21.4 L18.9 31 L22.6 23.4 Z" fill="#e6bd57" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "white", fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              AGIL
            </span>
            <span style={{ color: "#adc7e8", fontSize: 18, letterSpacing: 6, textTransform: "uppercase" }}>
              Travels &amp; Tours
            </span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ color: "white", fontSize: 60, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            Travel the Emirates with confidence.
          </span>
          <span style={{ color: "#e6bd57", fontSize: 38, fontWeight: 600 }}>
            Your Safety Is Our First Priority.
          </span>
        </div>

        {/* Footer row */}
        <span style={{ color: "#adc7e8", fontSize: 24 }}>
          Visa · Flights · Hotels · Transfers · Tours · Consultation
        </span>
      </div>
    ),
    size,
  );
}
