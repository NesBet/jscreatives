import { prisma } from '@/lib/prisma'
import { PRODUCT_PER_PAGE } from '@/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const printMethod = searchParams.get('printMethod')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = Math.min(
      Math.max(parseInt(searchParams.get('perPage') || '') || PRODUCT_PER_PAGE, 1),
      100
    )
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = { active: true }

    if (category) where.category = category
    if (printMethod) where.printMethod = printMethod
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { basePrice: 'asc' }
    if (sort === 'price-desc') orderBy = { basePrice: 'desc' }
    if (sort === 'newest') orderBy = { createdAt: 'desc' }

    const skip = (page - 1) * perPage

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    return Response.json(
      {
        products,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get products error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
