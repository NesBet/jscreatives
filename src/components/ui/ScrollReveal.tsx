"use client";

import { ReactNode, useRef, useEffect, HTMLAttributes } from "react";
import { gsap } from "@/lib/gsap-wrapper";
import { useReducedMotion } from "motion/react";

interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const ScrollReveal = ({ children, delay = 0, stagger = 0.08, direction = "up", once = true, threshold = 0.15, rootMargin = "0px", className, ...props }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".reveal-item", containerRef.current);
      if (elements.length === 0) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : direction === "left" ? 40 : -40 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.8,
            delay,
            ease: "expo.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once,
              markers: false,
            },
          }
          );
          return;
        }

        elements.forEach((el, i: number) => {
          const initialTransform = direction === "up" ? { y: 50, opacity: 0 }
            : direction === "down" ? { y: -50, opacity: 0 }
            : direction === "left" ? { x: 50, opacity: 0 }
            : { x: -50, opacity: 0 };

          gsap.fromTo(
            el,
            initialTransform,
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.7,
              delay: delay + i * stagger,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once,
                markers: false,
              },
            }
          );
        });
      }, containerRef);

      return () => ctx.revert();
    }, [reduce, delay, stagger, direction, once, threshold, rootMargin]);

    return (
      <div ref={(el: HTMLDivElement | null) => { containerRef.current = el; }} className={className} {...props}>
        {children}
      </div>
    );
  }

ScrollReveal.displayName = "ScrollReveal";

export interface RevealItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  index?: number;
}

export const RevealItem = ({ children, index = 0, className, ...props }: RevealItemProps) => (
  <div className={`reveal-item ${className}`} data-index={index} {...props}>
    {children}
  </div>
);