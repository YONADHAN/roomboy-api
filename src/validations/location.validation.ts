import { z } from 'zod'

export const CreateLocationSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
})

export const UpdateLocationSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  isActive: z.boolean().optional(),
})

export const LocationQuerySchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1).max(100),
  search: z.string().optional(),
})

export type CreateLocationDTO = z.infer<typeof CreateLocationSchema>
export type UpdateLocationDTO = z.infer<typeof UpdateLocationSchema>
export type LocationQueryDTO = z.infer<typeof LocationQuerySchema>
