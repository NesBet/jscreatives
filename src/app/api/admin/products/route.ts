import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { productSchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'
import { PRODUCT_PER_PAGE } from '@/constants'

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
        { club: { contains: search, mode: 'insensitive' } },
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

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({ data: productData })

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: { size: string; sku: string; stock: number; priceOverride?: number }) => ({
            productId: newProduct.id,
            size: v.size,
            sku: v.sku,
            stock: v.stock,
            priceOverride: v.priceOverride || null,
          })),
        })
      }

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: { url: string; altText?: string; sortOrder?: number }, index: number) => ({
            productId: newProduct.id,
            url: img.url,
            altText: img.altText || null,
            sortOrder: img.sortOrder ?? index,
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

    return Response.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Admin create product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
