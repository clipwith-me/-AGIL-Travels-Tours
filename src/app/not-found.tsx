import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <LogoMark className="h-14 w-14" />
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-gold-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          This page has wandered off
        </h1>
        <p className="mt-4 text-base leading-7 text-brand-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on route.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
          >
            Back to home
          </Link>
          <Link
            href="/#services"
            className="inline-flex items-center justify-center rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
          >
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
