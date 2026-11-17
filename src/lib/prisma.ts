import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!
  const configuredPoolMax = Number(process.env.DATABASE_POOL_MAX ?? 3)
  const max =
    Number.isFinite(configuredPoolMax) && configuredPoolMax > 0
      ? configuredPoolMax
      : 3
  const adapter = new PrismaPg({
    connectionString,
    max,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()
globalForPrisma.prisma = prisma
