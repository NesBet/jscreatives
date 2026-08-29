import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/paystack'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    if (!reference) {
      return Response.json({ error: 'reference is required' }, { status: 400 })
    }

    const data = await verifyPayment(reference)
    const status = data.status
    const amount = data.amount
    const paidAt = data.paid_at

    if (status === 'success') {
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
              paidAt: paidAt ? new Date(paidAt) : new Date(),
              channel: data.channel ?? null,
              rawPayload: data as unknown as object,
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
      }
    }

    return Response.json(
      { status, amount, reference: data.reference, paidAt },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify payment error:', error)
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}
