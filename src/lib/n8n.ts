export interface N8nResult {
  ok: boolean
  status: number
  data: unknown
}

/**
 * Posts JSON to an n8n webhook with the shared `N8N_CONTACT_SECRET` header.
 * Awaits the response (the app waits for n8n at all times) with a 15s timeout.
 */
export async function callN8n(webhookUrl: string, payload: unknown): Promise<N8nResult> {
  const secret = process.env.N8N_CONTACT_SECRET

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { N8N_CONTACT_SECRET: secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    clearTimeout(timeout)
    throw err
  } finally {
    clearTimeout(timeout)
  }
}
