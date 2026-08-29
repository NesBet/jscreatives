export interface Country {
  name: string
  iso: string
  dial: string
  flag: string
}

// Selectable countries for phone sign-in / sign-up
export const EAST_AFRICA_COUNTRIES: Country[] = [
  { name: 'Kenya', iso: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Tanzania', iso: 'TZ', dial: '+255', flag: '🇹🇿' },
  { name: 'Uganda', iso: 'UG', dial: '+256', flag: '🇺🇬' },
]

export function buildE164(dial: string, national: string): string {
  const digits = national.replace(/\D/g, '')
  const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits
  return `${dial}${withoutLeadingZero}`
}
