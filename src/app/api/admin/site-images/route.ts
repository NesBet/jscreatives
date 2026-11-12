import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { siteImageDefinitions, siteImageDefinitionMap } from '@/content/site-images'
import { siteImageSchema } from '@/lib/validations'

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  return user && user.role === 'ADMIN' ? user : null
}

export async function GET(request: Request) {
  try {
    const user = await requireAdmin(request)
    if (!user) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const overrides = await prisma.siteImage.findMany()
    const byKey = new Map(overrides.map((row) => [row.key, row]))

    return Response.json({
      images: siteImageDefinitions.map((definition) => {
        const override = byKey.get(definition.key)
        return {
          ...definition,
          url: override?.url ?? definition.defaultUrl,
          altText: override?.altText ?? definition.defaultAlt,
          isOverride: Boolean(override),
          updatedAt: override?.updatedAt ?? null,
        }
      }),
    })
  } catch (error) {
    console.error('Admin site images list error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request)
    if (!user) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = siteImageSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (!siteImageDefinitionMap.has(parsed.data.key)) {
      return Response.json({ error: 'Unknown image slot.' }, { status: 400 })
    }

    const image = await prisma.siteImage.upsert({
      where: { key: parsed.data.key },
      create: {
        key: parsed.data.key,
        url: parsed.data.url,
        altText: parsed.data.altText?.trim() || null,
      },
      update: {
        url: parsed.data.url,
        altText: parsed.data.altText?.trim() || null,
      },
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_SITE_IMAGE',
      entity: 'SiteImage',
      entityId: image.id,
      details: { key: image.key, url: image.url },
    })

    revalidatePath('/', 'layout')
    return Response.json({ image })
  } catch (error) {
    console.error('Admin site image update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAdmin(request)
    if (!user) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    if (!key || !siteImageDefinitionMap.has(key)) {
      return Response.json({ error: 'Unknown image slot.' }, { status: 400 })
    }

    await prisma.siteImage.deleteMany({ where: { key } })
    await logAudit({
      userId: user.id,
      action: 'RESET_SITE_IMAGE',
      entity: 'SiteImage',
      entityId: key,
      details: { key },
    })

    revalidatePath('/', 'layout')
    return Response.json({ success: true })
  } catch (error) {
    console.error('Admin site image reset error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
