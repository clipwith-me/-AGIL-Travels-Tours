import Image from "next/image";
import Link from "next/link";

/**
 * Square AGIL badge — derived from the brand (electric-blue field, white "Á").
 * Used for the favicon, 404, and social image where a square mark is needed.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="AGIL">
      <rect width="40" height="40" rx="10" fill="#080ce0" />
      {/* accent dash over the A */}
      <path d="M24.5 9.5 L30 8 L28.8 12 L23.8 13.2 Z" fill="#ffffff" opacity="0.95" />
      {/* italic A */}
      <path
        d="M13 31 L20.5 12 L24 12 L28.5 31 L24.6 31 L23.7 26.6 L18.4 26.6 L16.8 31 Z M19.6 23.4 L23 23.4 L21.6 16.6 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * Full logo: the ÁGIL wordmark image + a "Travels & Tours" descriptor.
 * variant "dark" for light backgrounds, "light" for dark backgrounds.
 */
export function Logo({
  href = "/",
  variant = "dark",
}: {
  href?: string;
  variant?: "dark" | "light";
}) {
  const src = variant === "light" ? "/agil-logo-white.png" : "/agil-logo.png";
  const descriptor = variant === "light" ? "text-brand-200" : "text-brand-500";

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5"
      aria-label="AGIL Travels and Tours — home"
    >
      <Image
        src={src}
        alt="ÁGIL"
        width={1240}
        height={479}
        priority
        className="h-7 w-auto sm:h-8"
      />
      <span
        className={`hidden border-l pl-2.5 text-[10px] font-medium uppercase leading-tight tracking-widest sm:block ${descriptor} ${
          variant === "light" ? "border-white/20" : "border-brand-200"
        }`}
      >
        Travels
        <br />&amp; Tours
      </span>
    </Link>
  );
}
