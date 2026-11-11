import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/auth-provider";
import { CartProvider } from "@/components/layout/cart-provider";
import { ToastProvider } from "@/components/ui/toast";
import { SiteChrome } from "@/components/layout/site-chrome";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { site } from "@/content/site";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | Printing, Branding & Custom Merchandise in Kenya`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "printing company in Kenya",
    "branding company in Nairobi",
    "custom merchandise Kenya",
    "corporate branding Kenya",
    "customized t-shirts Nairobi",
    "promotional products Kenya",
    "printing services Nairobi",
    "event branding Kenya",
    "corporate gifts Kenya",
    "JsCreatives",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: site.url,
    siteName: site.name,
    title: `${site.shortName} | ${site.positioning}`,
    description: site.description,
    images: [
      {
        url: "/og-jscreatives.jpg",
        width: 1200,
        height: 630,
        alt: "JsCreatives printing and branding work in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} | ${site.positioning}`,
    description: site.description,
    images: ["/og-jscreatives.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/jscreatives.jpg",
    apple: "/jscreatives.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f2e9",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/og-jscreatives.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  areaServed: ["Kenya", "East Africa"],
  priceRange: "KES",
  sameAs: ["https://instagram.com/jscreatives__/", "https://www.facebook.com/jscreatives"],
  makesOffer: [
    "Printing Services",
    "Corporate Branding",
    "Customized Merchandise",
    "Graphic Design",
    "Promotional and Marketing Materials",
    "Event Branding",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <SiteChrome>{children}</SiteChrome>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
