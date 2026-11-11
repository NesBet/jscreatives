export const PRODUCT_CATEGORIES = [
  'APPAREL_CLOTHING',
  'OFFICE_STATIONERY',
  'PROMOTIONAL_MERCHANDISE',
  'BAGS_ACCESSORIES',
  'MARKETING_MATERIALS',
  'EVENT_BRANDING',
  'PERSONALIZED_GIFTS',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  APPAREL_CLOTHING: 'Apparel & Clothing',
  OFFICE_STATIONERY: 'Office & Corporate Stationery',
  PROMOTIONAL_MERCHANDISE: 'Promotional Merchandise',
  BAGS_ACCESSORIES: 'Bags & Accessories',
  MARKETING_MATERIALS: 'Marketing & Advertising Materials',
  EVENT_BRANDING: 'Event Branding',
  PERSONALIZED_GIFTS: 'Personalized Gifts',
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
  APPAREL_CLOTHING:
    'T-shirts, polos, hoodies, caps and workwear finished with print or embroidery.',
  OFFICE_STATIONERY:
    'Business cards, letterheads, notebooks and diaries with an exacting finish.',
  PROMOTIONAL_MERCHANDISE:
    'Pens, lanyards, drinkware and everyday items that keep your brand within reach.',
  BAGS_ACCESSORIES:
    'Tote bags, non-woven bags, kraft bags and accessories built for daily use.',
  MARKETING_MATERIALS:
    'Banners, stickers and display graphics that make your campaign visible.',
  EVENT_BRANDING:
    'Backdrops, delegate kits and event displays produced for a complete brand experience.',
  PERSONALIZED_GIFTS:
    'Curated gift sets and personalized pieces for clients, staff and milestone moments.',
}

export const PRODUCT_PER_PAGE = 12

export const ORDER_NOTES_MAX = 1000

export function categoryLabel(value: string): string {
  return CATEGORY_LABELS[value as ProductCategory] ?? value
}

export function printMethodLabel(value: string): string {
  return PRINT_METHOD_LABELS[value as PrintMethodValue] ?? value
}
