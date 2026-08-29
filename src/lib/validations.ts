import { z } from 'zod'

// E.164 phone, e.g. +254780237794
export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, 'Enter a valid phone number with country code')

export const requestOtpSchema = z
  .object({
    mode: z.enum(['login', 'signup']),
    phone: phoneSchema,
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
  })
  .refine(
    (data) =>
      data.mode !== 'signup' ||
      (data.name !== undefined && data.email !== undefined),
    { message: 'Name and email are required to sign up', path: ['name'] }
  )

export const verifyOtpSchema = z
  .object({
    mode: z.enum(['login', 'signup']),
    phone: phoneSchema,
    code: z
      .string()
      .regex(/^\d{6}$/, 'Enter the 6-digit code'),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  })
  .refine(
    (data) =>
      data.mode !== 'signup' ||
      (data.name !== undefined && data.email !== undefined),
    { message: 'Name and email are required to sign up', path: ['name'] }
  )

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().default(''),
  club: z.string().min(1, 'Club is required'),
  kitType: z.enum(['HOME', 'AWAY', 'THIRD']),
  season: z.string().min(1, 'Season is required'),
  basePrice: z.number().positive('Price must be positive'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        size: z.string(),
        sku: z.string(),
        stock: z.number(),
        priceOverride: z.number().optional(),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        altText: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .optional(),
})

export const cartItemSchema = z.object({
  variantId: z.string().min(1, 'Variant is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  printingEnabled: z.boolean().default(false),
  printingName: z
    .string()
    .max(15, 'Printing name must be 15 characters or less')
    .regex(/^[A-Za-z\s]*$/, 'Printing name can only contain letters and spaces')
    .optional()
    .or(z.literal('')),
  printingNumber: z
    .string()
    .max(3, 'Printing number must be 3 digits or less')
    .regex(/^\d{0,3}$/, 'Printing number must be digits only')
    .optional()
    .or(z.literal('')),
})

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('Kenya'),
  phone: z.string().min(1, 'Phone number is required'),
})

export const orderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
})

export const printingNameSchema = z
  .string()
  .max(15, 'Printing name must be 15 characters or less')
  .regex(/^[A-Za-z\s]*$/, 'Printing name can only contain letters and spaces')

export const printingNumberSchema = z
  .string()
  .max(3, 'Printing number must be 3 digits or less')
  .regex(/^\d{0,3}$/, 'Printing number must be digits only')

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  whatsapp: z
    .string()
    .min(7, 'Enter a valid WhatsApp number')
    .regex(/^[0-9+\s-]+$/, 'WhatsApp number can only contain digits, spaces, + and -'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or less'),
})
