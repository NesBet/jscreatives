import { z } from 'zod'
import { PRODUCT_CATEGORIES, PRINT_METHODS } from '@/constants'

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
  category: z.enum(PRODUCT_CATEGORIES),
  printMethod: z.enum(PRINT_METHODS),
  material: z.string().min(1, 'Material is required'),
  turnaround: z.string().min(1, 'Turnaround is required'),
  basePrice: z.number().min(0, 'Price must be zero or positive'),
  colors: z.array(z.string()).optional(),
  customization: z.array(z.string()).optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        option: z.string(),
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
})

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State or county is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('Kenya'),
  phone: z.string().min(1, 'Phone number is required'),
  notes: z
    .string()
    .max(1000, 'Artwork notes must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
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

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Invalid email address').max(160),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(24)
    .regex(/^[0-9+\s()-]+$/, 'Phone number can only contain digits, spaces, +, - and brackets')
    .optional()
    .or(z.literal('')),
  company: z.string().max(160).optional().or(z.literal('')),
  service: z.string().max(120).optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or less'),
  website: z.string().max(0).optional().or(z.literal('')),
})

export const quoteSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  companyName: z.string().max(160).optional().or(z.literal('')),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(24)
    .regex(/^[0-9+\s()-]+$/, 'Phone number can only contain digits, spaces, +, - and brackets'),
  email: z.string().email('Invalid email address').max(160),
  service: z.string().min(2, 'Select a service').max(120),
  productName: z.string().max(160).optional().or(z.literal('')),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(1000000, 'Quantity is too large'),
  preferredColor: z.string().max(160).optional().or(z.literal('')),
  description: z
    .string()
    .min(10, 'Describe what you need in at least 10 characters')
    .max(5000, 'Description must be 5000 characters or less'),
  preferredDeliveryDate: z.string().max(40).optional().or(z.literal('')),
  additionalInstructions: z
    .string()
    .max(2000, 'Additional instructions must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal('')),
})
