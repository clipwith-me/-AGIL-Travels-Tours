import Link from "next/link";

/** The AGIL badge mark — a gold "send/travel" plane on a navy rounded square. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="AGIL Travels and Tours"
    >
      <rect width="40" height="40" rx="10" fill="#0b2137" />
      {/* light wing */}
      <path d="M31 9 L8 18.2 L16.8 21.4 Z" fill="#f0d488" />
      {/* body / dark wing */}
      <path d="M31 9 L16.8 21.4 L18.9 31 L22.6 23.4 Z" fill="#e6bd57" />
    </svg>
  );
}

/** Full logo: badge + wordmark. Used in the header and footer. */
export function Logo({
  href = "/",
  variant = "dark",
}: {
  href?: string;
  /** "dark" for light backgrounds, "light" for dark backgrounds. */
  variant?: "dark" | "light";
}) {
  const primary = variant === "light" ? "text-white" : "text-brand-900";
  const secondary = variant === "light" ? "text-brand-200" : "text-brand-500";

  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="AGIL Travels and Tours — home">
      <LogoMark className="h-9 w-9" />
      <span className="flex flex-col leading-none">
        <span className={`text-sm font-bold tracking-tight ${primary}`}>AGIL</span>
        <span className={`text-[10px] font-medium uppercase tracking-widest ${secondary}`}>
          Travels &amp; Tours
        </span>
      </span>
    </Link>
  );
}
