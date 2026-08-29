import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '20')
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (paymentStatus === 'paid') {
      where.payment = { status: 'SUCCESS' }
    } else if (paymentStatus === 'unpaid') {
      where.OR = [{ payment: null }, { payment: { status: { not: 'SUCCESS' } } }]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ])

    return Response.json(
      {
        orders,
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
    console.error('Admin get orders error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
