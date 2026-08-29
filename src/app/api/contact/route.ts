import { contactSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('CONTACT_WEBHOOK_URL is not configured')
      return Response.json({ error: 'Contact service is unavailable.' }, { status: 503 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const contactSecret = process.env.N8N_CONTACT_SECRET

    let webhookResponse: Response
    try {
      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(contactSecret ? { N8N_CONTACT_SECRET: contactSecret } : {}),
        },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
      })
    } catch (err) {
      clearTimeout(timeout)
      console.error('Contact webhook request failed:', err)
      return Response.json(
        { error: 'Unable to reach the contact service. Please try again later.' },
        { status: 502 }
      )
    }
    clearTimeout(timeout)

    let data: unknown = null
    try {
      data = await webhookResponse.json()
    } catch {
      data = null
    }

    if (!webhookResponse.ok) {
      return Response.json(
        { error: 'The contact service returned an error. Please try again later.' },
        { status: 502 }
      )
    }

    const webhookMessage =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message?: unknown }).message
        : undefined
    const message =
      typeof webhookMessage === 'string'
        ? webhookMessage
        : 'Your message has been sent successfully. We will get back to you shortly.'

    return Response.json({ success: true, message }, { status: 200 })
  } catch (error) {
    console.error('Contact route error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
