import { hash, compare } from 'bcryptjs'
import {
  verifySessionToken,
  type SessionPayload,
} from '@/lib/session'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export interface SessionUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  image: string | null
  active: boolean
}

export async function getCurrentUser(request: Request): Promise<SessionUser | null> {
  const token = readTokenFromRequest(request)
  if (!token) return null

  const session: SessionPayload | null = await verifySessionToken(token)
  if (!session) return null

  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      image: true,
      active: true,
    },
  })

  // Deactivated accounts are treated as unauthenticated
  if (!user || !user.active) return null

  return user
}

function readTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/token=([^;]+)/)
    if (match) return match[1]
  }

  return null
}

// Re-export session helpers so existing importers keep working.
export {
  createSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
} from '@/lib/session'
