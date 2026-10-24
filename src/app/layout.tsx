import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/auth-provider";
import { CartProvider } from "@/components/layout/cart-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JSCREATIVES - Branding, Merchandise & Print Studio in Kenya",
  description:
    "JSCREATIVES is a Nairobi branding and print studio. We design identities, branded apparel, packaging, stationery and signage for businesses across Kenya.",
  icons: {
    icon: "/jscreatives.jpg",
    apple: "/jscreatives.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body className="bg-bg-primary text-text-primary font-body antialiased min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 z-60 pointer-events-none opacity-[0.02] noise-overlay" aria-hidden="true" />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main className="relative z-10 min-h-[calc(100vh-120px)]">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
