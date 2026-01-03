import { z } from 'zod'

export const CreatePropertySchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    attributes: z.record(z.string(), z.any()).default({}),
    location: z
        .object({
            city: z.string().optional(),
            locality: z.string().optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        })
        .optional(),
    images: z.array(z.string().url('Each image must be a valid URL')).default([]),
    status: z.enum(['active', 'blocked', 'pending']).default('pending'),
})

export const UpdatePropertySchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').optional(),
    attributes: z.record(z.string(), z.any()).optional(),
    location: z
        .object({
            city: z.string().optional(),
            locality: z.string().optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        })
        .optional(),
    images: z.array(z.string().url('Each image must be a valid URL')).optional(),
})

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
