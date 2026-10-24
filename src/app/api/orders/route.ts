import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { shippingAddressSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = shippingAddressSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } } } },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }

    let total = 0
    const orderItems = cart.items.map((item) => {
      const product = item.variant.product
      const unitPrice = item.unitPrice
      const subtotal = parseFloat(unitPrice.toString()) * item.quantity
      total += subtotal

      return {
        variantId: item.variantId,
        productName: product.name,
        productCategory: product.category,
        productMethod: product.printMethod,
        productOption: item.variant.option,
        productImage: product.images[0]?.url || null,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      }
    })

    const address = parsed.data
    const reference = `JS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // NOTE: cart items and stock are deducted only after a successful payment
    // (see webhook + verify endpoints) so a cancelled payment keeps the cart intact.
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
          shippingPhone: address.phone,
          notes: address.notes?.trim() || null,
          paymentReference: reference,
          items: { create: orderItems },
        },
        include: { items: true },
      })

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          reference,
          amount: total,
          status: 'PENDING',
        },
      })

      return newOrder
    })

    return Response.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
      },
    })

    return Response.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Get orders error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
