import Link from "next/link";

const footerLinks = [
  { href: "/catalog", label: "Shop" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  { href: "https://instagram.com/jscreatives__/", label: "Instagram", icon: <i className="fa fa-instagram text-xl" aria-hidden="true" /> },
  { href: "https://wa.me/254780237794?text=Hello%20JSCREATIVES%20Family%20I%20will%20like%20to%20inquire%20about", label: "WhatsApp", icon: <i className="fa fa-whatsapp text-xl" aria-hidden="true" /> },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-600/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white font-[var(--font-display)]">
              JS<span className="text-red-600">CREATIVES</span>
            </Link>
            <p className="mt-4 text-slate-400 max-w-md leading-relaxed">
              Premium football jerseys with custom name & number printing.
              Authentic quality, custom printing, and fast delivery across Kenya.
            </p>
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 transition-all duration-300 hover:bg-red-600/10 hover:border-red-500/30 hover:text-red-400"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Quick Links</h3>
            <nav className="space-y-3" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 transition-colors hover:text-white hover:translate-x-1 duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Support</h3>
            <nav className="space-y-3" aria-label="Support links">
              <Link href="/faq" className="block text-sm text-slate-400 transition-colors hover:text-white hover:translate-x-1 duration-300">FAQ</Link>
              <Link href="/shipping" className="block text-sm text-slate-400 transition-colors hover:text-white hover:translate-x-1 duration-300">Shipping Info</Link>
              <Link href="/returns" className="block text-sm text-slate-400 transition-colors hover:text-white hover:translate-x-1 duration-300">Returns</Link>
              <Link href="/contact" className="block text-sm text-slate-400 transition-colors hover:text-white hover:translate-x-1 duration-300">Contact Us</Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} JSCREATIVES. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Crafted with precision for football lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
