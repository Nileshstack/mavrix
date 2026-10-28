import type { MetadataRoute } from "next";
import { siteUrl } from "@/src/lib/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.href,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
