import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "ink" | "gold" | "outline" | "light";
type Size = "md" | "lg";

interface SiteButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: boolean;
  external?: boolean;
  ariaLabel?: string;
}

const variants: Record<Variant, string> = {
  ink: "bg-ink text-paper hover:bg-gold hover:text-ink",
  gold: "bg-gold text-ink hover:bg-ink hover:text-paper",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light:
    "border border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-[12px]",
  lg: "px-7 py-4 text-[13px]",
};

export function SiteButton({
  href,
  children,
  variant = "ink",
  size = "md",
  className,
  icon = true,
  external = false,
  ariaLabel,
}: SiteButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center justify-center gap-3 font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
