import { prisma } from '@/lib/prisma'
import { verifyOtpSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { callN8n } from '@/lib/n8n'
import { createSessionToken, setSessionCookie } from '@/lib/auth'

const DEFAULT_HASH =
  process.env.ACCOUNT_DEFAULT_PASSWORD_HASH ||
  '$2b$12$xGbUi9jtZ1J5Sn0BD3LVE.JGwGYWhOq.WCVcCxIDCoHY6b1Upv5VW'

interface VerifyResponse {
  success?: boolean
  attemptsRemaining?: number
  locked?: boolean
  lockedUntil?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = verifyOtpSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { mode, phone, code, name, email } = parsed.data

    const rate = rateLimit(`verify-otp:${phone}`, 10, 10 * 60 * 1000)
    if (!rate.success) {
      return Response.json(
        { success: false, locked: true, message: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const webhookUrl = process.env.AUTH_VERIFY_WEBHOOK_URL
    if (!webhookUrl) {
      return Response.json({ success: false, message: 'Auth service is unavailable.' }, { status: 503 })
    }

    let n8n: Awaited<ReturnType<typeof callN8n>>
    try {
      n8n = await callN8n(webhookUrl, { mode, phone: phone.replace(/^\+/, ''), code, name, email })
    } catch {
      return Response.json(
        { success: false, message: 'Could not reach the auth service. Please try again later.' },
        { status: 502 }
      )
    }

    const data = (n8n.data ?? {}) as VerifyResponse

    if (!n8n.ok || data.success !== true) {
      return Response.json(
        {
          success: false,
          attemptsRemaining: data.attemptsRemaining ?? null,
          locked: data.locked ?? false,
          lockedUntil: data.lockedUntil ?? null,
          message: data.message || 'Invalid verification code.',
        },
        { status: 401 }
      )
    }

    let user
    if (mode === 'signup') {
      user = await prisma.user.upsert({
        where: { phone },
        update: {
          name: name ?? undefined,
          email: email ?? undefined,
          hashedPassword: DEFAULT_HASH,
          active: true,
        },
        create: {
          phone,
          name,
          email: email!,
          hashedPassword: DEFAULT_HASH,
          role: 'CUSTOMER',
          active: true,
        },
        select: { id: true, name: true, email: true, phone: true, role: true },
      })
    } else {
      user = await prisma.user.findUnique({
        where: { phone },
        select: { id: true, name: true, email: true, phone: true, role: true, active: true },
      })
      if (!user || !user.active) {
        return Response.json(
          { success: false, message: 'Account not found. Please sign up first.' },
          { status: 401 }
        )
      }
    }

    const token = await createSessionToken(user.id, user.phone ?? phone, user.role)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }

    return Response.json(
      { success: true, user: safeUser },
      { status: 200, headers: { 'Set-Cookie': setSessionCookie(token) } }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
