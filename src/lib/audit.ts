import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

export async function logAudit(params: {
  userId?: string
  action: string
  entity: string
  entityId?: string
  details?: Record<string, unknown>
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      details: (params.details || {}) as Prisma.InputJsonValue,
    },
  })
}
