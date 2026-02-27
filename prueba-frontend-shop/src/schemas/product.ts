import { z } from 'zod'

const NonEmptyStringSchema = z.string().trim().min(1)

export const ProductListItemSchema = z.object({
  id: NonEmptyStringSchema,
  brand: NonEmptyStringSchema,
  model: NonEmptyStringSchema,
  price: NonEmptyStringSchema,
  imgUrl: z.url(),
}).strict()

export const ProductListSchema = z.array(ProductListItemSchema)

export const ProductOptionSchema = z.object({
  code: z.number().int().nonnegative(),
  name: NonEmptyStringSchema,
}).strict()

export const ProductDetailSchema = ProductListItemSchema.extend({
  networkTechnology: NonEmptyStringSchema,
  networkSpeed: NonEmptyStringSchema,
  gprs: NonEmptyStringSchema,
  edge: NonEmptyStringSchema,
  announced: NonEmptyStringSchema,
  status: NonEmptyStringSchema,
  dimentions: NonEmptyStringSchema,
  weight: NonEmptyStringSchema,
  sim: NonEmptyStringSchema,
  displayType: NonEmptyStringSchema,
  displayResolution: NonEmptyStringSchema,
  displaySize: NonEmptyStringSchema,
  os: NonEmptyStringSchema,
  cpu: NonEmptyStringSchema,
  chipset: NonEmptyStringSchema,
  gpu: NonEmptyStringSchema,
  externalMemory: NonEmptyStringSchema,
  internalMemory: z.array(NonEmptyStringSchema),
  ram: NonEmptyStringSchema,
  primaryCamera: z.array(NonEmptyStringSchema),
  secondaryCmera: z.array(NonEmptyStringSchema),
  speaker: NonEmptyStringSchema,
  audioJack: NonEmptyStringSchema,
  wlan: z.array(NonEmptyStringSchema),
  bluetooth: z.array(NonEmptyStringSchema),
  gps: NonEmptyStringSchema,
  nfc: z.string(),
  radio: NonEmptyStringSchema,
  usb: NonEmptyStringSchema,
  sensors: z.array(NonEmptyStringSchema),
  battery: NonEmptyStringSchema,
  colors: z.array(NonEmptyStringSchema),
  options: z.object({
    colors: z.array(ProductOptionSchema),
    storages: z.array(ProductOptionSchema),
  }).strict(),
}).strict()

export type ProductListItem = z.infer<typeof ProductListItemSchema>
export type ProductOption = z.infer<typeof ProductOptionSchema>
export type ProductDetail = z.infer<typeof ProductDetailSchema>
