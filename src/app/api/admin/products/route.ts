import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { productSchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'
import { PRODUCT_PER_PAGE } from '@/constants'
import { prepareMediaInput, type PreparedMedia } from '@/lib/media-input'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')
    const perPage = Math.min(
      Math.max(parseInt(searchParams.get('perPage') || '') || PRODUCT_PER_PAGE, 1),
      100
    )
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    return Response.json(
      {
        products,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin get products error:', error)
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
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { variants, images, ...productData } = parsed.data
    const preparedImages: PreparedMedia[] = []

    for (const [index, image] of (images ?? []).entries()) {
      const prepared = prepareMediaInput(image, index)
      if (prepared.error) {
        return Response.json({ error: prepared.error }, { status: 400 })
      }
      if (!prepared.data) {
        return Response.json({ error: 'Invalid media.' }, { status: 400 })
      }
      preparedImages.push(prepared.data)
    }

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({ data: productData })

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: { option: string; sku: string; stock: number; priceOverride?: number }) => ({
            productId: newProduct.id,
            option: v.option,
            sku: v.sku,
            stock: v.stock,
            priceOverride: v.priceOverride || null,
          })),
        })
      }

      if (preparedImages.length > 0) {
        await tx.productImage.createMany({
          data: preparedImages.map((image) => ({
            productId: newProduct.id,
            mediaKind: image.mediaKind,
            url: image.url,
            embedUrl: image.embedUrl,
            altText: image.altText,
            sortOrder: image.sortOrder,
          })),
        })
      }

      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: { images: true, variants: true },
      })
    })

    await logAudit({
      userId: user.id,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: product!.id,
      details: { name: product!.name },
    })

    revalidatePath('/', 'layout')
    return Response.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Admin create product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
