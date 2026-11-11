import { prisma } from '@/lib/prisma'
import { quoteSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { callN8n } from '@/lib/n8n'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp', 'ai', 'eps', 'zip'])

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function field(formData: FormData, key: string): string {
  return formData.get(key)?.toString() ?? ''
}

export async function POST(request: Request) {
  try {
    const rate = rateLimit(`quote:${getClientIp(request)}`, 4, 10 * 60 * 1000)
    if (!rate.success) {
      return Response.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()

    if (field(formData, 'website')) {
      return Response.json({ success: true, message: 'Request received.' })
    }

    const raw = {
      fullName: field(formData, 'fullName'),
      companyName: field(formData, 'companyName'),
      phone: field(formData, 'phone'),
      email: field(formData, 'email'),
      service: field(formData, 'service'),
      productName: field(formData, 'productName'),
      quantity: field(formData, 'quantity'),
      preferredColor: field(formData, 'preferredColor'),
      description: field(formData, 'description'),
      preferredDeliveryDate: field(formData, 'preferredDeliveryDate'),
      additionalInstructions: field(formData, 'additionalInstructions'),
      website: '',
    }

    const parsed = quoteSchema.safeParse(raw)

    if (!parsed.success) {
      return Response.json(
        { error: 'Please check the highlighted fields.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    let artworkName: string | null = null
    let artworkType: string | null = null
    let artworkSize: number | null = null
    let artworkData: string | null = null

    const artwork = formData.get('artwork')
    if (artwork instanceof File && artwork.size > 0) {
      if (artwork.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: 'Artwork must be 8MB or smaller.' },
          { status: 400 }
        )
      }

      const extension = artwork.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return Response.json(
          { error: 'Please upload a PDF, PNG, JPG, WEBP, AI, EPS or ZIP file.' },
          { status: 400 }
        )
      }

      artworkName = artwork.name
      artworkType = artwork.type || extension
      artworkSize = artwork.size
      artworkData = Buffer.from(await artwork.arrayBuffer()).toString('base64')
    }

    const data = parsed.data
    const quote = await prisma.quoteRequest.create({
      data: {
        fullName: data.fullName,
        companyName: data.companyName || null,
        phone: data.phone,
        email: data.email,
        service: data.service,
        productName: data.productName || null,
        quantity: data.quantity,
        preferredColor: data.preferredColor || null,
        description: data.description,
        preferredDeliveryDate: data.preferredDeliveryDate || null,
        additionalInstructions: data.additionalInstructions || null,
        artworkName,
        artworkType,
        artworkSize,
        artworkData,
      },
    })

    const message = [
      `Quote request from ${data.fullName}${data.companyName ? ` (${data.companyName})` : ''}.`,
      `Service: ${data.service}`,
      data.productName ? `Product: ${data.productName}` : null,
      `Quantity: ${data.quantity}`,
      data.preferredColor ? `Preferred colour: ${data.preferredColor}` : null,
      data.preferredDeliveryDate ? `Preferred delivery: ${data.preferredDeliveryDate}` : null,
      '',
      data.description,
      data.additionalInstructions ? `Additional instructions: ${data.additionalInstructions}` : null,
      artworkName ? `Artwork: ${artworkName}` : null,
    ].filter((line): line is string => line !== null).join('\n')

    const webhookUrl = process.env.QUOTE_WEBHOOK_URL

    if (webhookUrl) {
      const payload = {
        type: 'quote_request',
        subject: `New quote request from ${data.fullName}`,
        id: quote.id,
        name: data.fullName,
        fullName: data.fullName,
        company: data.companyName || null,
        companyName: data.companyName || null,
        phone: data.phone,
        email: data.email,
        service: data.service,
        productName: data.productName || null,
        quantity: data.quantity,
        preferredColor: data.preferredColor || null,
        description: data.description,
        message,
        preferredDeliveryDate: data.preferredDeliveryDate || null,
        additionalInstructions: data.additionalInstructions || null,
        artworkName,
        artworkType,
        artworkSize,
      }

      try {
        const result = await callN8n(webhookUrl, payload)
        if (!result.ok) {
          console.error(`Quote webhook returned HTTP ${result.status}.`)
        }
      } catch (error) {
        console.error('Quote webhook failed:', error)
      }
    }

    return Response.json(
      {
        success: true,
        id: quote.id,
        message:
          'Your quote request has been received. Our team will review it and respond within one business day.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Quote route error:', error)
    return Response.json(
      { error: 'We could not submit your quote request right now. Please try again.' },
      { status: 500 }
    )
  }
}
