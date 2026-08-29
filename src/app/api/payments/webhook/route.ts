import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/paystack'
import { logAudit } from '@/lib/audit'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 })
    }

    const isValid = verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'charge.success') {
      const { reference } = event.data

      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: { order: { include: { items: true } } },
      })

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESS',
              paidAt: new Date(),
              channel: event.data.channel,
              rawPayload: event.data,
            },
          })

          // Only fulfil the order once to keep stock & cart changes idempotent
          if (payment.order.status === 'PENDING') {
            await tx.order.update({
              where: { id: payment.orderId },
              data: { status: 'PROCESSING' },
            })

            for (const item of payment.order.items) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              })
            }

            await tx.cartItem.deleteMany({
              where: { cart: { userId: payment.order.userId } },
            })
          }
        })

        await logAudit({
          action: 'PAYMENT_SUCCESS',
          entity: 'Payment',
          entityId: payment.id,
          details: { reference, amount: payment.amount },
        })
      }
    }

    return Response.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
