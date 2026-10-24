import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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

    if (!hasQuantity) {
      return Response.json({ error: 'Provide a quantity' }, { status: 400 })
    }

    if (body.quantity < 1) {
      return Response.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, variant: { include: { product: true } } },
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return Response.json({ error: 'Cart item not found' }, { status: 404 })
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: body.quantity },
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
