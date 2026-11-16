import { resolveSiteImage, getSiteImageMap } from "@/lib/site-images";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logo = resolveSiteImage(await getSiteImageMap(), "brand:logo");
    return Response.json(
      { url: logo.url, alt: logo.altText },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Site logo error:", error);
    return Response.json(
      { error: "Could not load the site logo." },
      { status: 500 }
    );
  }
}
