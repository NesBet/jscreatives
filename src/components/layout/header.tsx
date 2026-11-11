"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/components/layout/auth-provider";
import { navLinks, site, whatsappUrl } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const accountHref = user?.role === "ADMIN" ? "/admin" : user ? "/account" : "/login";
  const accountLabel = user?.role === "ADMIN" ? "Admin" : user ? "My account" : "Client login";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-paper/92 backdrop-blur-md transition-shadow duration-500",
          scrolled ? "border-line shadow-[0_8px_30px_-24px_rgba(23,22,20,0.5)]" : "border-transparent"
        )}
      >
        <div
          className={cn(
            "overflow-hidden bg-ink text-paper transition-all duration-500",
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          )}
        >
          <div className="container-wide flex h-9 items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-paper/65">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-gold-soft" strokeWidth={1.6} />
                {site.location}
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <span className="h-1 w-1 rounded-full bg-gold-soft/70" />
                Mon–Fri, 8am–6pm
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href={`mailto:${site.email}`}
                className="hidden items-center gap-1.5 transition-colors hover:text-paper sm:inline-flex"
              >
                <Mail className="h-3 w-3 text-gold-soft" strokeWidth={1.6} />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-paper"
              >
                <Phone className="h-3 w-3 text-gold-soft" strokeWidth={1.6} />
                {site.phoneDisplay}
              </a>
              <Link
                href={accountHref}
                className="hidden items-center gap-1 transition-colors hover:text-paper md:inline-flex"
              >
                {accountLabel}
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>

        <div className="container-wide flex h-[74px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-[12px] font-medium tracking-[0.03em] transition-colors",
                    active ? "text-ink" : "text-stone hover:text-ink"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 items-center justify-center border border-line text-stone transition-colors hover:border-ink hover:text-ink sm:flex"
              aria-label="Chat with JsCreatives on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.35 5.1 4.56.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Z" />
              </svg>
            </Link>
            <Link
              href="/quote"
              className="group inline-flex h-10 items-center gap-2.5 bg-ink px-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-paper transition-colors hover:bg-gold hover:text-ink sm:px-5"
            >
              Get a quote
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.7}
              />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 z-[70] bg-paper transition-all duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="container-wide flex h-[74px] items-center justify-between border-b border-line">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        <div className="container-wide flex h-[calc(100dvh-74px)] flex-col overflow-y-auto py-8">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-line py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[27px] font-medium tracking-[-0.04em] text-ink transition-colors group-hover:text-gold-deep">
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-stone transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>

          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-8 flex h-14 items-center justify-center gap-3 bg-ink text-[12px] font-semibold uppercase tracking-[0.16em] text-paper"
          >
            Request a free quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <div className="mt-auto grid gap-3 pt-10 text-sm text-stone sm:grid-cols-2">
            <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Phone className="h-4 w-4 text-gold" strokeWidth={1.6} />
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Mail className="h-4 w-4 text-gold" strokeWidth={1.6} />
              {site.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" strokeWidth={1.6} />
              {site.location}
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-ink"
            >
              <span className="h-4 w-4 text-center text-gold">↗</span>
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
