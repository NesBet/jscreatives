import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, refreshSessionToken } from '@/lib/session'

const PROTECTED_PREFIXES = ['/account', '/checkout', '/orders']
const ADMIN_PREFIX = '/admin'

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value
  const session = token ? await verifySessionToken(token) : null

  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/')
  const needsAuth = isProtected(pathname) || isAdminRoute

  // Authenticated but not admin -> bounce away from admin
  if (session && isAdminRoute && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!session) {
    if (needsAuth) {
      const url = new URL('/login', req.url)
      url.searchParams.set('redirect', pathname)
      const res = NextResponse.redirect(url)
      if (token) res.cookies.delete('token')
      return res
    }
    // Not authenticated and not on a protected route: clear any stale cookie
    const res = NextResponse.next()
    if (token) res.cookies.delete('token')
    return res
  }

  // Authenticated: slide the inactivity window by refreshing the cookie
  const res = NextResponse.next()
  if (token) {
    const refreshed = await refreshSessionToken(token)
    if (refreshed) {
      res.cookies.set('token', refreshed, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })
    }
  }
  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images/|jscreatives|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)',
  ],
}
