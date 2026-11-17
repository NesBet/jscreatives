import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { productSchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'
import { prepareMediaInput, type PreparedMedia } from '@/lib/media-input'

export async function GET(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    })

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Admin get product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
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
      await tx.product.update({
        where: { id },
        data: productData,
      })

      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } })
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: { option: string; sku: string; stock: number; priceOverride?: number }) => ({
              productId: id,
              option: v.option,
              sku: v.sku,
              stock: v.stock,
              priceOverride: v.priceOverride || null,
            })),
          })
        }
      }

      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } })
        if (preparedImages.length > 0) {
          await tx.productImage.createMany({
            data: preparedImages.map((image) => ({
              productId: id,
              mediaKind: image.mediaKind,
              url: image.url,
              embedUrl: image.embedUrl,
              altText: image.altText,
              sortOrder: image.sortOrder,
            })),
          })
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
      })
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: product!.name },
    })

    revalidatePath('/', 'layout')
    return Response.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Admin update product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })

    await logAudit({
      userId: user.id,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: existing.name },
    })

    revalidatePath('/', 'layout')
    return Response.json({ message: 'Product deleted' }, { status: 200 })
  } catch (error) {
    console.error('Admin delete product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
