import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-theme flex min-h-dvh flex-col bg-ink text-paper">
      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="border-t border-white/10 bg-ink px-4 py-6">
        <p className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] font-medium tracking-[0.14em] text-paper/45">
          <span className="font-semibold text-paper">JSCREATIVES</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Design</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Print</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Brand</span>
          <span className="text-paper/30" aria-hidden="true">•</span>
          <span>&copy; All rights Reserved 2026</span>
        </p>
      </footer>
    </div>
  );
}
