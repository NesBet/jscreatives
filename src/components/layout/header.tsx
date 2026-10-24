"use client";

import { useState, useLayoutEffect, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/layout/auth-provider";
import { useCart } from "@/components/layout/cart-provider";
import { MagneticButton } from "@/components/ui/MagneticButton";

const navLinks = [
  { href: "/catalog", label: "Shop" },
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface MenuItemProps {
  href: string;
  label: string;
  onClose: () => void;
}

function MenuLink({ href, label, onClose }: MenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
    >
      {label}
    </Link>
  );
}

function UserMenu({ user, onLogout }: { user: { name: string; email: string; role: string }; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === "ADMIN";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 transition-all duration-300 ease-[var(--ease-smooth)] hover:bg-slate-800/50 hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="truncate max-w-[140px]">{user.name}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-300 ease-[var(--ease-spring)] ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-2xl py-2 shadow-[var(--shadow-elevated)] animate-fade-in-down"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>

          {isAdmin && (
            <>
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Admin
              </p>
              <MenuLink href="/admin" label="Dashboard" onClose={() => setOpen(false)} />
              <MenuLink href="/admin/products" label="Products" onClose={() => setOpen(false)} />
              <MenuLink href="/admin/orders" label="Orders" onClose={() => setOpen(false)} />
              <MenuLink href="/admin/users" label="Users" onClose={() => setOpen(false)} />
              <MenuLink href="/admin/payments" label="Payments" onClose={() => setOpen(false)} />
              <MenuLink href="/admin/audit" label="Audit Logs" onClose={() => setOpen(false)} />
              <div className="my-2 border-t border-slate-800" />
            </>
          )}

          <MenuLink href="/account" label={isAdmin ? "My Store Account" : "My Account"} onClose={() => setOpen(false)} />

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="block w-full px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-slate-800/50 hover:text-red-300"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { user, setUser } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevCountRef = useRef(cartCount);
  const bumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    if (cartCount !== prevCountRef.current) {
      prevCountRef.current = cartCount;
      if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
      setCartBump(true);
      bumpTimerRef.current = setTimeout(() => setCartBump(false), 300);
      return () => {
        if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
      }
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <header className={`sticky top-4 z-50 w-full transition-all duration-500 ease-[var(--ease-smooth)] ${scrolled ? "top-2" : "top-4"}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-colors duration-300 hover:text-red-500"
          aria-label="JSCREATIVES Home"
        >
          <span className="relative z-10">JS</span>
          <span className="text-red-600 relative z-10">CREATIVES</span>
        </Link>

        {/* Floating Glass Pill Navigation */}
        <nav className="relative z-10 hidden md:flex items-center" aria-label="Main navigation">
          <div className="glass-strong rounded-full px-6 py-2 flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 ease-[var(--ease-smooth)] hover:text-white hover:bg-white/5 rounded-full"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-white rounded-full group"
            aria-label={`Cart with ${cartCount} items`}
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white transition-all duration-300 ease-[var(--ease-spring)] ${cartBump ? "scale-125" : "scale-100"}`}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth buttons - desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white rounded-full"
                >
                  Login
                </Link>
                <MagneticButton variant="primary" size="sm" href="/register">
                  Register
                </MagneticButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-white rounded-full md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden animate-fade-in-down border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white rounded-xl"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                {user.role === "ADMIN" && (
                  <>
                    <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Admin</p>
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Dashboard</Link>
                    <Link href="/admin/products" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Products</Link>
                    <Link href="/admin/orders" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Orders</Link>
                    <Link href="/admin/users" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Users</Link>
                    <Link href="/admin/payments" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Payments</Link>
                    <Link href="/admin/audit" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Audit Logs</Link>
                    <div className="my-2 border-t border-slate-800" />
                  </>
                )}
                <Link href="/account" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">My Account</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="mx-4 mt-2 px-4 py-3 text-base font-medium text-red-400 transition-colors hover:bg-white/5 hover:text-red-300 rounded-xl text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">Login</Link>
                <MagneticButton variant="primary" size="md" className="mx-4 mt-2 w-full" href="/register">
                  Register
                </MagneticButton>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}