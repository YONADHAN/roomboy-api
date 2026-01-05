import { z } from 'zod'

// Public property list query with dynamic attribute filters
export const PublicPropertyQuerySchema = z.object({
    city: z.string().optional(),
    location: z.string().optional(), // Slug
    locality: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
})
// Note: Dynamic attribute filters (e.g., monthly_rent_min, monthly_rent_max) 
// will be handled separately in the service layer

// Field definition query for public use
export const PublicFieldDefinitionQuerySchema = z.object({
    entityType: z.enum(['property', 'product', 'service']),
})

export type PublicPropertyQueryDTO = z.infer<typeof PublicPropertyQuerySchema>
export type PublicFieldDefinitionQueryDTO = z.infer<typeof PublicFieldDefinitionQuerySchema>
