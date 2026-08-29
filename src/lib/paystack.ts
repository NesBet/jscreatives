import crypto from 'crypto'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

export async function initializePayment(params: {
  email: string
  amount: number // in cents (KES * 100)
  reference: string
  callback_url?: string
  metadata?: Record<string, unknown>
}) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      callback_url: params.callback_url,
      metadata: params.metadata,
    }),
  })

  const data = await response.json()
  if (!data.status) {
    throw new Error(data.message || 'Payment initialization failed')
  }
  return data.data
}

export async function verifyPayment(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await response.json()
  if (!data.status) {
    throw new Error(data.message || 'Payment verification failed')
  }
  return data.data
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex')
  return hash === signature
}
