export const PRODUCT_CATEGORIES = [
  'APPAREL',
  'HEADWEAR',
  'BAGS',
  'DRINKWARE',
  'STATIONERY',
  'SIGNAGE',
  'PACKAGING',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  APPAREL: 'Apparel',
  HEADWEAR: 'Headwear',
  BAGS: 'Bags',
  DRINKWARE: 'Drinkware',
  STATIONERY: 'Stationery',
  SIGNAGE: 'Signage',
  PACKAGING: 'Packaging',
}

export const PRINT_METHODS = [
  'SCREEN_PRINT',
  'DTF',
  'EMBROIDERY',
  'UV_PRINT',
  'SUBLIMATION',
  'OFFSET',
  'VINYL',
  'DIGITAL',
] as const

export type PrintMethodValue = (typeof PRINT_METHODS)[number]

export const PRINT_METHOD_LABELS: Record<PrintMethodValue, string> = {
  SCREEN_PRINT: 'Screen Print',
  DTF: 'DTF Transfer',
  EMBROIDERY: 'Embroidery',
  UV_PRINT: 'UV Print',
  SUBLIMATION: 'Sublimation',
  OFFSET: 'Offset Print',
  VINYL: 'Vinyl Print',
  DIGITAL: 'Digital Print',
}

export const CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  APPAREL: 'T-shirts, hoodies and uniforms finished with print or embroidery.',
  HEADWEAR: 'Caps and beanies with clean, durable brand marks.',
  BAGS: 'Totes, backpacks and drawstring bags built for daily use.',
  DRINKWARE: 'Mugs and bottles that keep your brand within reach.',
  STATIONERY: 'Cards, letterheads and notebooks with an exacting finish.',
  SIGNAGE: 'Banners, stickers and display graphics that command attention.',
  PACKAGING: 'Mailer boxes and retail bags that make the unboxing.',
}

export const ORDER_NOTES_MAX = 1000

export const PRODUCT_PER_PAGE = 12

export function categoryLabel(value: string): string {
  return CATEGORY_LABELS[value as ProductCategory] ?? value
}

export function printMethodLabel(value: string): string {
  return PRINT_METHOD_LABELS[value as PrintMethodValue] ?? value
}
