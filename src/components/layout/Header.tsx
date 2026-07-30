"use client";

import Link from "next/link";
import { useState } from "react";
import { enquiryLink, primaryNav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label={site.name}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 font-bold text-gold-400">
            A
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-brand-900">
              AGIL
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-brand-500">
              Travels &amp; Tours
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={enquiryLink()}
            className="hidden rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400 sm:inline-block"
          >
            Make an enquiry
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-800 hover:bg-brand-50 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-brand-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={enquiryLink()}
              onClick={() => setOpen(false)}
              className="mt-2 mb-2 rounded-full bg-gold-500 px-4 py-3 text-center text-sm font-semibold text-brand-950"
            >
              Make an enquiry
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
