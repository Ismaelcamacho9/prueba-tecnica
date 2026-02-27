import { z } from 'zod'

const ProductIdSchema = z.string().trim().min(1)
const OptionCodeSchema = z.number().int().nonnegative()

export const AddToCartBodySchema = z
  .object({
    id: ProductIdSchema,
    colorCode: OptionCodeSchema,
    storageCode: OptionCodeSchema,
  })
  .strict()

export const AddToCartResponseSchema = z
  .object({
    count: z.number().int().nonnegative(),
  })
  .strict()

export type AddToCartBody = z.infer<typeof AddToCartBodySchema>
export type AddToCartResponse = z.infer<typeof AddToCartResponseSchema>
