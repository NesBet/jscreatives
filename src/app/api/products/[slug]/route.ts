import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { slug } = await context.params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    })

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Get product error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
