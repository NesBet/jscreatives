import { prisma } from '@/lib/prisma'
import { requestOtpSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { callN8n } from '@/lib/n8n'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = requestOtpSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { mode, phone, name, email } = parsed.data

    if (mode === 'login') {
      const rate = rateLimit(`otp-login:${phone}`, 5, 60 * 1000)
      if (!rate.success) {
        return Response.json(
          { error: 'Too many attempts. Please try again later.' },
          { status: 429 }
        )
      }

      const existing = await prisma.user.findUnique({ where: { phone } })
      if (!existing) {
        return Response.json({ registered: false }, { status: 200 })
      }

      const webhookUrl = process.env.AUTH_OTP_WEBHOOK_URL
      if (!webhookUrl) {
        return Response.json({ error: 'Auth service is unavailable.' }, { status: 503 })
      }

      try {
        const result = await callN8n(webhookUrl, { mode: 'login', phone: phone.replace(/^\+/, '') })
        if (!result.ok) {
          return Response.json(
            { error: 'Could not send verification code. Please try again later.' },
            { status: 502 }
          )
        }
        const n8nData = (result.data ?? {}) as {
          locked?: boolean
          lockedUntil?: string
          message?: string
        }
        if (n8nData.locked) {
          return Response.json(
            {
              registered: true,
              locked: true,
              lockedUntil: n8nData.lockedUntil ?? null,
              message: n8nData.message ?? 'Account locked. Please try again later.',
            },
            { status: 200 }
          )
        }
      } catch {
        return Response.json(
          { error: 'Could not reach the auth service. Please try again later.' },
          { status: 502 }
        )
      }

      return Response.json({ registered: true }, { status: 200 })
    }

    // signup
    const rate = rateLimit(`otp-signup:${phone}`, 3, 15 * 60 * 1000)
    if (!rate.success) {
      return Response.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const conflict = await prisma.user.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    })
    if (conflict) {
      return Response.json(
        { error: 'An account with this number or email already exists. Please sign in.' },
        { status: 409 }
      )
    }

    // Verify the number is actually on WhatsApp before creating an account
    const verifyUrl = process.env.VERIFY_USER_NUMBER
    if (!verifyUrl) {
      return Response.json({ error: 'WhatsApp verification service is unavailable.' }, { status: 503 })
    }

    try {
      const verifyRes = await callN8n(verifyUrl, { phone: phone.replace(/^\+/, '') })
      if (!verifyRes.ok) {
        return Response.json(
          { error: 'Could not verify the WhatsApp number. Please try again later.' },
          { status: 502 }
        )
      }
      const verifyData = (verifyRes.data ?? {}) as { onWhatsApp?: boolean; message?: string }
      if (verifyData.onWhatsApp !== true) {
        return Response.json(
          {
            whatsapp: false,
            error:
              verifyData.message ||
              'This number is not on WhatsApp. Please enter a WhatsApp number.',
          },
          { status: 200 }
        )
      }
    } catch {
      return Response.json(
        { error: 'Could not reach the WhatsApp verification service. Please try again later.' },
        { status: 502 }
      )
    }

    const webhookUrl = process.env.AUTH_OTP_WEBHOOK_URL
    if (!webhookUrl) {
      return Response.json({ error: 'Auth service is unavailable.' }, { status: 503 })
    }

    try {
      const result = await callN8n(webhookUrl, { mode: 'signup', phone: phone.replace(/^\+/, ''), name, email })
      if (!result.ok) {
        return Response.json(
          { error: 'Could not send verification code. Please try again later.' },
          { status: 502 }
        )
      }
      const n8nData = (result.data ?? {}) as {
        locked?: boolean
        lockedUntil?: string
        message?: string
      }
      if (n8nData.locked) {
        return Response.json(
          {
            success: true,
            locked: true,
            lockedUntil: n8nData.lockedUntil ?? null,
            message: n8nData.message ?? 'Account locked. Please try again later.',
          },
          { status: 200 }
        )
      }
    } catch {
      return Response.json(
        { error: 'Could not reach the auth service. Please try again later.' },
        { status: 502 }
      )
    }

    return Response.json(
      { success: true, message: 'Verification code sent to your WhatsApp.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Request OTP error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
