import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

const updateMessageSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED']),
})

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
    const parsed = updateMessageSchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Message not found' }, { status: 404 })
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: parsed.data,
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_CONTACT_MESSAGE',
      entity: 'ContactMessage',
      entityId: id,
      details: parsed.data,
    })

    return Response.json({ message })
  } catch (error) {
    console.error('Admin update message error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
