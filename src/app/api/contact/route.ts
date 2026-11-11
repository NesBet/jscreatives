import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { callN8n } from '@/lib/n8n'

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: Request) {
  try {
    const rate = rateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60 * 1000)
    if (!rate.success) {
      return Response.json(
        { error: 'Too many messages. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Please check the highlighted fields.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.website) {
      return Response.json({
        success: true,
        message: 'Thank you. We will get back to you shortly.',
      })
    }

    const { name, email, phone, company, service, message } = parsed.data

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message,
      },
    })

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await callN8n(webhookUrl, {
          id: saved.id,
          name,
          email,
          phone: phone || null,
          company: company || null,
          service: service || null,
          message,
        })
      } catch (error) {
        console.error('Contact webhook failed:', error)
      }
    }

    return Response.json(
      {
        success: true,
        message:
          'Your message has been received. Our team will get back to you within one business day.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact route error:', error)
    return Response.json(
      { error: 'We could not send your message right now. Please try again.' },
      { status: 500 }
    )
  }
}
