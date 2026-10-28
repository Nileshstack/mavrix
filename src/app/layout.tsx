import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { SmoothScroll } from "@/src/components/motion/SmoothScroll";
import { ScrollProgress } from "@/src/components/motion/ScrollProgress";
import { CustomCursor } from "@/src/components/layout/CustomCursor";
import { FloatingWidgets } from "@/src/components/layout/FloatingWidgets";
import { Navbar } from "@/src/components/layout/Navbar";
import { Preloader } from "@/src/components/layout/Preloader";
import { Footer } from "@/src/components/layout/Footer";
import { siteContent } from "@/src/content/site";
import { siteUrl } from "@/src/lib/siteMetadata";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteContent.brand.name,
    template: `%s | ${siteContent.brand.name}`,
  },
  description: siteContent.brand.tagline,
  applicationName: siteContent.brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteContent.brand.name,
    title: siteContent.brand.name,
    description: siteContent.brand.tagline,
    locale: "en_IN",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: siteContent.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteContent.brand.name,
    description: siteContent.brand.tagline,
    images: ["/icon.svg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteContent.brand.name,
    description: siteContent.brand.tagline,
    url: siteUrl.href,
    logo: new URL("/icon.svg", siteUrl).href,
    email: siteContent.contact.email,
    telephone: siteContent.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ghaziabad",
      addressRegion: "Uttar Pradesh",
      postalCode: "201024",
      addressCountry: "IN",
    },
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="skip-to-content fixed left-4 top-4 z-[110] -translate-y-[200%] rounded-lg bg-navy px-4 py-3 font-medium text-white focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {siteContent.accessibility.skipToContent}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll>
          <Preloader>
            <ScrollProgress />
            <Navbar />
            <CustomCursor />
            <FloatingWidgets />
            {children}
            <Footer />
          </Preloader>
        </SmoothScroll>
      </body>
    </html>
  );
}
