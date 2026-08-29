import { SignJWT, jwtVerify } from 'jose'

const SESSION_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'development-insecure-session-secret-change-me'
)

export const SESSION_MAX_INACTIVITY_MS = 30 * 60 * 1000
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60

export interface SessionPayload {
  userId: string
  phone: string
  role: string
  lastActivity: number
}

export async function createSessionToken(
  userId: string,
  phone: string,
  role: string
): Promise<string> {
  const now = Date.now()
  return new SignJWT({ userId, phone, role, lastActivity: now })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SESSION_SECRET)
}

/**
 * Verifies a session token and enforces the 30-minute inactivity window.
 * Returns null if the token is invalid OR the last activity is older than
 * SESSION_MAX_INACTIVITY_MS (i.e. the user has been idle too long).
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET)
    const p = payload as Record<string, unknown>
    if (!p.userId || typeof p.userId !== 'string') return null

    const lastActivity =
      typeof p.lastActivity === 'number'
        ? p.lastActivity
        : typeof p.iat === 'number'
          ? p.iat * 1000
          : 0

    if (Date.now() - lastActivity > SESSION_MAX_INACTIVITY_MS) return null

    return {
      userId: p.userId,
      phone: typeof p.phone === 'string' ? p.phone : '',
      role: typeof p.role === 'string' ? p.role : 'CUSTOMER',
      lastActivity,
    }
  } catch {
    return null
  }
}

/** Re-signs a still-valid token with a refreshed lastActivity (sliding window). */
export async function refreshSessionToken(token: string): Promise<string | null> {
  const payload = await verifySessionToken(token)
  if (!payload) return null
  return createSessionToken(payload.userId, payload.phone, payload.role)
}

export function setSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production'
  return `token=${token}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
}

export function clearSessionCookie(): string {
  return 'token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
}
