import { z } from 'zod'

export const CreateLocationSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
})

export const UpdateLocationSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  isActive: z.boolean().optional(),
})

export const LocationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isDeleted: z.coerce.boolean().optional(),
})

export type CreateLocationDTO = z.infer<typeof CreateLocationSchema>
export type UpdateLocationDTO = z.infer<typeof UpdateLocationSchema>
export type LocationQueryDTO = z.infer<typeof LocationQuerySchema>
