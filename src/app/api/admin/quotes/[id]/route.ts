import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

const updateQuoteSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'CLOSED']).optional(),
  internalNotes: z.string().max(5000).nullable().optional(),
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
    const parsed = updateQuoteSchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.quoteRequest.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Quote request not found' }, { status: 404 })
    }

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: parsed.data,
    })

    await logAudit({
      userId: user.id,
      action: 'UPDATE_QUOTE',
      entity: 'QuoteRequest',
      entityId: id,
      details: parsed.data,
    })

    return Response.json({ quote })
  } catch (error) {
    console.error('Admin update quote error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
