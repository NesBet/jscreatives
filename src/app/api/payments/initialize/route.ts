import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { initializePayment } from '@/lib/paystack'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const orderId = body.orderId
    if (!orderId) {
      return Response.json({ error: 'orderId is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    })

    if (!order || order.userId !== user.id) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.payment?.status === 'SUCCESS') {
      return Response.json({ error: 'Order already paid' }, { status: 400 })
    }

    const reference = order.paymentReference || order.payment?.reference
    if (!reference) {
      return Response.json({ error: 'Missing payment reference' }, { status: 400 })
    }

    const amount = Math.round(parseFloat(order.total.toString()) * 100)
    const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?ref=${reference}`

    const data = await initializePayment({
      email: user.email,
      amount,
      reference,
      callback_url,
      metadata: { orderId: order.id },
    })

    return Response.json(
      { accessCode: data.access_code, reference },
      { status: 200 }
    )
  } catch (error) {
    console.error('Initialize payment error:', error)
    return Response.json({ error: 'Could not initialize payment' }, { status: 500 })
  }
}
