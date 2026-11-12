import { prisma } from "@/lib/prisma";

export async function getPublishedCaseStudies(options?: {
  limit?: number;
  featuredOnly?: boolean;
}) {
  return prisma.caseStudy.findMany({
    where: {
      published: true,
      ...(options?.featuredOnly ? { featured: true } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: options?.limit,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 3 },
      _count: { select: { images: true } },
    },
  });
}

export async function getCaseStudyBySlug(slug: string) {
  return prisma.caseStudy.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}
