"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-wrapper";

interface PremiumImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  revealDirection?: "up" | "down" | "left" | "right" | "scale";
}

export const PremiumImage = ({ src, alt, fill = false, priority = false, className = "", revealDirection = "scale" }: PremiumImageProps) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !imgRef.current) return;

    const getInitialTransform = () => {
      switch (revealDirection) {
        case "up": return { y: 60, opacity: 0, scale: 1.05 };
        case "down": return { y: -60, opacity: 0, scale: 1.05 };
        case "left": return { x: 60, opacity: 0, scale: 1.05 };
        case "right": return { x: -60, opacity: 0, scale: 1.05 };
        case "scale": return { scale: 1.12, opacity: 0, filter: "grayscale(20%)" };
        default: return { scale: 1.12, opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      const imgEl = imgRef.current?.querySelector("img");
      if (!imgEl) return;

      gsap.fromTo(
        imgEl,
        getInitialTransform(),
        {
          ...getInitialTransform(),
          opacity: 1,
          scale: 1,
          y: 0,
          x: 0,
          filter: "grayscale(0%)",
          duration: revealDirection === "scale" ? 1.2 : 0.9,
          ease: "expo.out",
          delay: 0.1,
        }
      );
    }, imgRef);

    return () => ctx.revert();
  }, [inView, revealDirection]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ transition: "opacity 0.4s ease-out" }}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)] via-[var(--color-bg-card)] to-[var(--color-bg-secondary)] animate-pulse-subtle" aria-hidden="true" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className={`transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${inView ? "" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        sizes={fill ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : undefined}
      />
    </div>
  );
};

PremiumImage.displayName = "PremiumImage";