import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, refreshSessionToken } from '@/lib/session'

const PROTECTED_PREFIXES = ['/account', '/checkout', '/orders']
const ADMIN_PREFIX = '/admin'
const AUTH_PREFIXES = ['/login', '/register']

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value
  const session = token ? await verifySessionToken(token) : null

  const response = NextResponse.next()

  // Security headers (apply to every response)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/')

  // Logged-in users shouldn't see the auth pages
  if (session && AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Authenticated but not admin -> bounce away from admin
  if (session && isAdminRoute && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const needsAuth = isProtected(pathname) || isAdminRoute

  if (!session) {
    if (needsAuth) {
      const url = new URL('/login', req.url)
      url.searchParams.set('redirect', pathname)
      const res = NextResponse.redirect(url)
      if (token) res.cookies.delete('token')
      return res
    }
    // Not authenticated and not on a protected route: clear any stale cookie
    if (token) response.cookies.delete('token')
    return response
  }

  // Authenticated: slide the inactivity window by refreshing the cookie
  if (token) {
    const refreshed = await refreshSessionToken(token)
    if (refreshed) {
      response.cookies.set('token', refreshed, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })
    }
  }
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images/|jscreatives|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)',
  ],
}
