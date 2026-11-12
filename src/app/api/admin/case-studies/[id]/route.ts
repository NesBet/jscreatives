import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { caseStudySchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = caseStudySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { images, ...storyData } = parsed.data
    const story = await prisma.$transaction(async (tx) => {
      if (images) {
        await tx.caseStudyImage.deleteMany({ where: { caseStudyId: id } })
      }

      return tx.caseStudy.update({
        where: { id },
        data: {
          ...storyData,
          coverAlt: storyData.coverAlt?.trim() || null,
          services: storyData.services?.filter(Boolean) ?? [],
          ...(images
            ? {
                images: {
                  create: images.map((image, index) => ({
                    url: image.url,
                    altText: image.altText?.trim() || null,
                    caption: image.caption?.trim() || null,
                    stage: image.stage?.trim() || 'BEHIND_THE_SCENES',
                    sortOrder: image.sortOrder ?? index,
                  })),
                },
              }
            : {}),
        },
        include: { images: { orderBy: { sortOrder: 'asc' } } },
      })
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_CASE_STUDY',
      entity: 'CaseStudy',
      entityId: story.id,
      details: { title: story.title, published: story.published },
    })

    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${story.slug}`)

    return Response.json({ story })
  } catch (error) {
    console.error('Admin case study update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const story = await prisma.caseStudy.findUnique({ where: { id } })
    if (!story) {
      return Response.json({ error: 'Story not found.' }, { status: 404 })
    }

    await prisma.caseStudy.delete({ where: { id } })
    await logAudit({
      userId: user.id,
      action: 'DELETE_CASE_STUDY',
      entity: 'CaseStudy',
      entityId: story.id,
      details: { title: story.title, slug: story.slug },
    })

    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${story.slug}`)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Admin case study delete error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
