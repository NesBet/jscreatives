import { SiteButton } from "@/components/ui/site-button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(176,132,66,0.12),transparent_45%)]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-deep">
          Error 404
        </p>
        <h1 className="mt-6 font-display text-6xl font-semibold leading-none tracking-[-0.05em] text-ink sm:text-8xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink/60">
          The page you are looking for may have moved, or the link may be out of date.
          Let us help you find the right place.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <SiteButton href="/" variant="ink">Back to home</SiteButton>
          <SiteButton href="/quote" variant="outline">Request a quote</SiteButton>
        </div>
      </div>
    </section>
  );
}
