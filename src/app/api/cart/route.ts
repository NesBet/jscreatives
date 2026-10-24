import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { cartItemSchema } from '@/lib/validations'

async function findOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } })
  }
  return cart
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await findOrCreateCart(user.id)
    const cartWithItems = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
                },
              },
            },
          },
        },
      },
    })

    return Response.json({ cart: cartWithItems }, { status: 200 })
  } catch (error) {
    console.error('Get cart error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = cartItemSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { variantId, quantity } = parsed.data

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    })
    if (!variant) {
      return Response.json({ error: 'Variant not found' }, { status: 404 })
    }
    if (variant.stock < quantity) {
      return Response.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    const cart = await findOrCreateCart(user.id)

    const unitPrice = variant.priceOverride
      ? parseFloat(variant.priceOverride.toString())
      : parseFloat(variant.product.basePrice.toString())

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          unitPrice,
        },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
                },
              },
            },
          },
        },
      },
    })

    return Response.json({ cart: updatedCart }, { status: 200 })
  } catch (error) {
    console.error('Add to cart error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
    if (!cart) {
      return Response.json({ message: 'Cart already empty' }, { status: 200 })
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    return Response.json({ message: 'Cart cleared' }, { status: 200 })
  } catch (error) {
    console.error('Clear cart error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
