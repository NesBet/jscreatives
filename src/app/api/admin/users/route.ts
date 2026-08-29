import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '20')
    const filter = searchParams.get('filter') || 'all'
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = {}
    if (filter === 'active') where.active = true
    if (filter === 'inactive') where.active = false

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          active: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return Response.json(
      {
        users,
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
    console.error('Admin get users error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
