declare module "@paystack/inline-js" {
  interface PaystackPopHandlers {
    onSuccess?: (data: { reference: string; trans?: string; status?: string }) => void
    onCancel?: () => void
    onClose?: () => void
    onError?: (error: unknown) => void
    onLoad?: () => void
  }

  export default class PaystackPop {
    constructor(options?: PaystackPopHandlers)
    resumeTransaction(
      accessCode: string,
      options?: PaystackPopHandlers
    ): void
    newTransaction(options: Record<string, unknown>): unknown
  }
}
