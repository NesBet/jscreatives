import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { siteImageDefinitions, siteImageDefinitionMap } from '@/content/site-images'
import { siteImageSchema } from '@/lib/validations'
import { prepareMediaInput } from '@/lib/media-input'

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
          mediaKind: override?.mediaKind ?? 'IMAGE',
          url: override?.url ?? definition.defaultUrl,
          embedUrl: override?.embedUrl ?? null,
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

    const definition = siteImageDefinitionMap.get(parsed.data.key)
    if (!definition) {
      return Response.json({ error: 'Unknown media slot.' }, { status: 400 })
    }

    const prepared = prepareMediaInput(parsed.data)
    if (prepared.error) {
      return Response.json({ error: prepared.error }, { status: 400 })
    }
    if (!prepared.data) {
      return Response.json({ error: 'Invalid media.' }, { status: 400 })
    }

    const { mediaKind, url, embedUrl, altText } = prepared.data
    const image = await prisma.siteImage.upsert({
      where: { key: parsed.data.key },
      create: {
        key: parsed.data.key,
        mediaKind,
        url,
        embedUrl,
        altText,
      },
      update: {
        mediaKind,
        url,
        embedUrl,
        altText,
      },
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_SITE_IMAGE',
      entity: 'SiteImage',
      entityId: image.id,
      details: {
        key: image.key,
        mediaKind: image.mediaKind,
        url: image.url,
        embedUrl: image.embedUrl,
      },
    })

    revalidatePath('/', 'layout')
    return Response.json({
      image: {
        ...definition,
        mediaKind: image.mediaKind,
        url: image.url ?? definition.defaultUrl,
        embedUrl: image.embedUrl,
        altText: image.altText ?? definition.defaultAlt,
        isOverride: true,
        updatedAt: image.updatedAt,
      },
    })
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
      return Response.json({ error: 'Unknown media slot.' }, { status: 400 })
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
