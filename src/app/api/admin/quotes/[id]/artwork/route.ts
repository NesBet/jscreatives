import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      select: { artworkName: true, artworkType: true, artworkData: true },
    })

    if (!quote?.artworkData) {
      return Response.json({ error: 'Artwork not found' }, { status: 404 })
    }

    const filename = (quote.artworkName || 'artwork').replace(/[^a-zA-Z0-9._-]/g, '_')
    const bytes = Uint8Array.from(Buffer.from(quote.artworkData, 'base64'))

    return new Response(bytes, {
      headers: {
        'Content-Type': quote.artworkType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Admin download artwork error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
