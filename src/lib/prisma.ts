import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function getRuntimeConnectionString() {
  const configured =
    process.env.DATABASE_POOL_URL || process.env.DATABASE_URL || ''

  try {
    const url = new URL(configured)
    if (
      url.port === '5432' &&
      (url.hostname.endsWith('.pooler.supabase.com') ||
        url.hostname.endsWith('.pooler.supabase.co'))
    ) {
      url.port = '6543'
    }
    return url.toString()
  } catch {
    return configured
  }
}

function createPrismaClient() {
  const connectionString = getRuntimeConnectionString()
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
