import type { MetadataRoute } from "next";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/tours",
    "/transport",
    "/faq",
    "/enquiry",
    "/visa-enquiry",
    "/tour-enquiry",
    "/uae-visa",
  ];

  const serviceRoutes = services.map((s) => `/services/${s.slug}`);

  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
