import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { z } from 'zod'

const updateUserSchema = z.object({
  role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        orders: { select: { id: true, total: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })

    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({ user: targetUser }, { status: 200 })
  } catch (error) {
    console.error('Admin get user error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()

    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, image: true },
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: id,
      details: parsed.data,
    })

    return Response.json({ user: updated }, { status: 200 })
  } catch (error) {
    console.error('Admin update user error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
