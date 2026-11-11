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
    const search = searchParams.get('search')?.trim()
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1)
    const perPage = Math.min(Math.max(parseInt(searchParams.get('perPage') || '20') || 20, 1), 100)
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { service: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ])

    return Response.json({
      messages,
      pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    })
  } catch (error) {
    console.error('Admin get messages error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
