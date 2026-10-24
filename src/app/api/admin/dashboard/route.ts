import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [totalRevenue, totalOrders, totalUsers, lowStockVariants, recentOrders] =
      await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true },
        }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.productVariant.findMany({
          where: { stock: { lt: 5 } },
          include: { product: { select: { name: true, category: true } } },
          orderBy: { stock: 'asc' },
        }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: true,
          },
        }),
      ])

    const topSellingCategories = await prisma.orderItem.groupBy({
      by: ['productCategory'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    })

    return Response.json(
      {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalOrders,
        totalUsers,
        lowStockAlerts: lowStockVariants,
        topSellingCategories: topSellingCategories.map((c) => ({
          category: c.productCategory,
          totalSold: c._sum.quantity,
        })),
        recentOrders,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
