import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { caseStudySchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const stories = await prisma.caseStudy.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    })

    return Response.json({ stories })
  } catch (error) {
    console.error('Admin case studies list error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = caseStudySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { images, ...storyData } = parsed.data
    const story = await prisma.caseStudy.create({
      data: {
        ...storyData,
        coverAlt: storyData.coverAlt?.trim() || null,
        services: storyData.services?.filter(Boolean) ?? [],
        images: {
          create: (images ?? []).map((image, index) => ({
            url: image.url,
            altText: image.altText?.trim() || null,
            caption: image.caption?.trim() || null,
            stage: image.stage?.trim() || 'BEHIND_THE_SCENES',
            sortOrder: image.sortOrder ?? index,
          })),
        },
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    })

    await logAudit({
      userId: user.id,
      action: 'CREATE_CASE_STUDY',
      entity: 'CaseStudy',
      entityId: story.id,
      details: { title: story.title, slug: story.slug },
    })

    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${story.slug}`)

    return Response.json({ story }, { status: 201 })
  } catch (error) {
    console.error('Admin case study create error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
