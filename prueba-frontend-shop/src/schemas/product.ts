import { z } from 'zod'

const NonEmptyStringSchema = z.string().trim().min(1)
const StringSchema = z.string().transform((value) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : 'N/A'
})
const PriceSchema = z.string().transform((value) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : 'sin precio'
})
const StringArraySchema = z.array(StringSchema)
const StringOrArrayToStringSchema = z.union([z.string(), z.array(z.string())]).transform((value) => {
  if (Array.isArray(value)) {
    const parts = value.map((item) => item.trim()).filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'N/A'
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : 'N/A'
})
const StringOrArrayToArraySchema = z.union([z.string(), z.array(z.string())]).transform((value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean)
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? [trimmed] : []
})

export const ProductListItemSchema = z.object({
  id: NonEmptyStringSchema,
  brand: NonEmptyStringSchema,
  model: NonEmptyStringSchema,
  price: PriceSchema,
  imgUrl: z.url(),
}).strict()

export const ProductListSchema = z.array(ProductListItemSchema)

export const ProductOptionSchema = z.object({
  code: z.number().int().nonnegative(),
  name: StringSchema,
}).strict()

export const ProductDetailSchema = ProductListItemSchema.extend({
  networkTechnology: StringSchema,
  networkSpeed: StringSchema,
  gprs: StringSchema,
  edge: StringSchema,
  announced: StringSchema,
  status: StringSchema,
  dimentions: StringSchema,
  weight: StringSchema,
  sim: StringOrArrayToStringSchema,
  displayType: StringSchema,
  displayResolution: StringSchema,
  displaySize: StringSchema,
  os: StringSchema,
  cpu: StringSchema,
  chipset: StringSchema,
  gpu: StringSchema,
  externalMemory: StringSchema,
  internalMemory: StringArraySchema,
  ram: StringSchema,
  primaryCamera: StringOrArrayToArraySchema,
  secondaryCmera: StringOrArrayToArraySchema,
  speaker: StringSchema,
  audioJack: StringSchema,
  wlan: StringOrArrayToArraySchema,
  bluetooth: StringOrArrayToArraySchema,
  gps: StringSchema,
  nfc: z.string(),
  radio: StringOrArrayToStringSchema,
  usb: StringSchema,
  sensors: StringOrArrayToArraySchema,
  battery: StringSchema,
  colors: StringArraySchema,
  options: z.object({
    colors: z.array(ProductOptionSchema),
    storages: z.array(ProductOptionSchema),
  }).strict(),
}).strict()

export type ProductListItem = z.infer<typeof ProductListItemSchema>
export type ProductOption = z.infer<typeof ProductOptionSchema>
export type ProductDetail = z.infer<typeof ProductDetailSchema>
