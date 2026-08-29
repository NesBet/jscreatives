import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { PRINTING_SURCHARGE } from '@/constants'

export async function PATCH(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await context.params
    const body = await request.json()

    const hasQuantity = typeof body.quantity === 'number'
    const hasPrinting = typeof body.printingEnabled === 'boolean'

    if (!hasQuantity && !hasPrinting) {
      return Response.json({ error: 'Provide quantity or printingEnabled' }, { status: 400 })
    }

    if (hasQuantity && (body.quantity < 1)) {
      return Response.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, variant: { include: { product: true } } },
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return Response.json({ error: 'Cart item not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (hasQuantity) {
      updateData.quantity = body.quantity
    }

    if (hasPrinting) {
      updateData.printingEnabled = body.printingEnabled
      updateData.printingName = body.printingName || null
      updateData.printingNumber = body.printingNumber || null

      const basePrice = cartItem.variant.priceOverride
        ? parseFloat(cartItem.variant.priceOverride.toString())
        : parseFloat(cartItem.variant.product.basePrice.toString())
      updateData.unitPrice = body.printingEnabled ? basePrice + PRINTING_SURCHARGE : basePrice
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: updateData,
    })

    return Response.json({ cartItem: updated }, { status: 200 })
  } catch (error) {
    console.error('Update cart item error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await context.params

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return Response.json({ error: 'Cart item not found' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id: itemId } })

    return Response.json({ message: 'Item removed from cart' }, { status: 200 })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
