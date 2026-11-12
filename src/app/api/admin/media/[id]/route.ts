import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { deleteMediaFile } from '@/lib/media-storage'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altText:
          typeof body.altText === 'string' ? body.altText.trim() || null : undefined,
        caption:
          typeof body.caption === 'string' ? body.caption.trim() || null : undefined,
      },
    })

    return Response.json({ asset })
  } catch (error) {
    console.error('Admin media update error:', error)
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
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!asset) {
      return Response.json({ error: 'Image not found.' }, { status: 404 })
    }

    const [siteImages, covers, galleryImages] = await Promise.all([
      prisma.siteImage.count({ where: { url: asset.url } }),
      prisma.caseStudy.count({ where: { coverUrl: asset.url } }),
      prisma.caseStudyImage.count({ where: { url: asset.url } }),
    ])

    if (siteImages + covers + galleryImages > 0) {
      return Response.json(
        {
          error:
            'This image is currently used on the website. Replace its usage before deleting it.',
        },
        { status: 409 }
      )
    }

    if (asset.storageKey) {
      await deleteMediaFile(asset.storageKey)
    }
    await prisma.mediaAsset.delete({ where: { id } })

    await logAudit({
      userId: user.id,
      action: 'DELETE_MEDIA',
      entity: 'MediaAsset',
      entityId: asset.id,
      details: { url: asset.url },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Admin media delete error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
