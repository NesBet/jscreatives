"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { brandLogo } from "@/content/site";

interface SiteLogoValue {
  url: string;
  alt: string;
}

const defaultLogo: SiteLogoValue = {
  url: brandLogo.url,
  alt: brandLogo.alt,
};

const SiteLogoContext = createContext<SiteLogoValue>(defaultLogo);

export function SiteLogoProvider({ children }: { children: ReactNode }) {
  const [logo, setLogo] = useState<SiteLogoValue>(defaultLogo);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/site-logo", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (typeof data?.url === "string" && data.url) {
          setLogo({
            url: data.url,
            alt: typeof data.alt === "string" ? data.alt : defaultLogo.alt,
          });
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return (
    <SiteLogoContext.Provider value={logo}>
      {children}
    </SiteLogoContext.Provider>
  );
}

export function useSiteLogo() {
  return useContext(SiteLogoContext);
}
