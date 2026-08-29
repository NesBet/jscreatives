import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    if (!fullUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({ user: fullUser }, { status: 200 })
  } catch (error) {
    console.error('Get me error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
