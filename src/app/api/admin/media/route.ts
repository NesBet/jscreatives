import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { mediaAssetSchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'
import {
  isMediaStorageConfigured,
  normalizeMediaFolder,
  uploadMediaFile,
  validateMediaFile,
} from '@/lib/media-storage'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const search = searchParams.get('search')?.trim()
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1)
    const perPage = Math.min(
      Math.max(parseInt(searchParams.get('perPage') || '24') || 24, 1),
      100
    )
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = {}
    if (folder && folder !== 'all') where.folder = folder
    if (search) {
      where.OR = [
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaAsset.count({ where }),
    ])

    return Response.json({
      assets,
      configured: isMediaStorageConfigured(),
      pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    })
  } catch (error) {
    console.error('Admin media list error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file')

      if (!(file instanceof File)) {
        return Response.json({ error: 'Choose an image to upload.' }, { status: 400 })
      }

      const fileError = validateMediaFile(file)
      if (fileError) {
        return Response.json({ error: fileError }, { status: 400 })
      }

      if (!isMediaStorageConfigured()) {
        return Response.json(
          {
            error:
              'Media storage is not configured. Add SUPABASE_URL and a server-side secret key (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY), plus SUPABASE_STORAGE_BUCKET. The publishable key cannot upload on its own. You can also add an image by URL.',
          },
          { status: 503 }
        )
      }

      const folder = normalizeMediaFolder(String(formData.get('folder') || 'library'))
      const stored = await uploadMediaFile(file, folder)
      const asset = await prisma.mediaAsset.create({
        data: {
          url: stored.url,
          storageKey: stored.storageKey,
          altText: String(formData.get('altText') || '').trim() || null,
          caption: String(formData.get('caption') || '').trim() || null,
          mimeType: stored.mimeType,
          size: stored.size,
          folder,
        },
      })

      await logAudit({
        userId: user.id,
        action: 'UPLOAD_MEDIA',
        entity: 'MediaAsset',
        entityId: asset.id,
        details: { url: asset.url, folder },
      })

      return Response.json({ asset }, { status: 201 })
    }

    const body = await request.json()
    const parsed = mediaAssetSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        url: parsed.data.url,
        altText: parsed.data.altText?.trim() || null,
        caption: parsed.data.caption?.trim() || null,
        folder: normalizeMediaFolder(parsed.data.folder),
      },
    })

    await logAudit({
      userId: user.id,
      action: 'ADD_MEDIA_URL',
      entity: 'MediaAsset',
      entityId: asset.id,
      details: { url: asset.url, folder: asset.folder },
    })

    return Response.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('Admin media create error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
