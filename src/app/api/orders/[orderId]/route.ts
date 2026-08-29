import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { orderStatusSchema } from '@/lib/validations'
import { logAudit } from '@/lib/audit'

export async function GET(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await context.params

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true, user: { select: { id: true, name: true, email: true } } },
    })

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Get order error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId } = await context.params
    const body = await request.json()

    const parsed = orderStatusSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: parsed.data.status },
      include: { items: true, payment: true },
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_ORDER_STATUS',
      entity: 'Order',
      entityId: orderId,
      details: { from: order.status, to: parsed.data.status },
    })

    return Response.json({ order: updated }, { status: 200 })
  } catch (error) {
    console.error('Update order error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
