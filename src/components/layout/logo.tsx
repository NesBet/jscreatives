import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

interface LogoProps {
  invert?: boolean;
  className?: string;
}

export function Logo({ invert = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="JsCreatives home"
      className={cn(
        "group inline-flex items-center gap-2.5 outline-none transition-opacity hover:opacity-80",
        className
      )}
    >
      <Image
        src={site.logo}
        alt=""
        width={150}
        height={150}
        priority
        unoptimized
        className={cn(
          "h-11 w-11 shrink-0 object-contain",
          invert ? "grayscale invert mix-blend-screen" : "mix-blend-multiply"
        )}
      />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[16px] font-semibold leading-none tracking-[0.13em]",
            invert ? "text-paper" : "text-ink"
          )}
        >
          JSCREATIVES
        </span>
        <span
          className={cn(
            "mt-[5px] block text-[8px] font-medium uppercase leading-none tracking-[0.27em]",
            invert ? "text-paper/50" : "text-stone"
          )}
        >
          Print &amp; Brand Studio
        </span>
      </span>
    </Link>
  );
}
