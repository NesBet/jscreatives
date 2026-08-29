import { clearSessionCookie } from '@/lib/session'

export async function POST() {
  try {
    return Response.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: { 'Set-Cookie': clearSessionCookie() },
      }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
