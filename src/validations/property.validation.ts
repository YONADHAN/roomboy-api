import { z } from 'zod'

export const CreatePropertySchema = z.object({
    title: z.string().min(3),
    status: z.enum(['active', 'blocked', 'pending']).optional(),
    location: z.string(), // ObjectId as string from frontend
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        locality: z.string().optional(),
    }),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
    attributes: z.record(z.string(), z.any()).optional(),
    images: z.array(z.string()).optional(),
})

export const UpdatePropertySchema = CreatePropertySchema.partial()

export const PropertyQuerySchema = z.object({
    status: z.enum(['active', 'blocked', 'pending']).optional(),
    city: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
})

export const UpdatePropertyStatusSchema = z.object({
    status: z.enum(['active', 'blocked', 'pending']),
})

export type CreatePropertyDTO = z.infer<typeof CreatePropertySchema>
export type UpdatePropertyDTO = z.infer<typeof UpdatePropertySchema>
export type PropertyQueryDTO = z.infer<typeof PropertyQuerySchema>
export type UpdatePropertyStatusDTO = z.infer<typeof UpdatePropertyStatusSchema>
