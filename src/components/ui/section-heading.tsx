import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  link?: { href: string; label: string };
  invert?: boolean;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  invert = false,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end", className)}>
      <div>
        <p className={cn("eyebrow", invert && "text-gold-soft")}>{eyebrow}</p>
        <h2
          className={cn(
            "display-title mt-5 max-w-4xl text-balance",
            invert ? "text-paper" : "text-ink",
            titleClassName
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "body-lg mt-6 max-w-2xl text-pretty",
              invert ? "text-paper/60" : "text-stone"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "group inline-flex w-fit items-center gap-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
            invert ? "text-paper/70 hover:text-gold-soft" : "text-ink hover:text-gold-deep"
          )}
        >
          {link.label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
