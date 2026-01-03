import { z } from 'zod'

const PhoneNumberSchema = z.object({
    label: z.string().min(1),
    number: z.string().min(10),
    isPrimary: z.boolean().default(false),
})

const SocialLinkSchema = z.object({
    platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp']),
    url: z.string().url(),
})

export const CreateBusinessContactSchema = z.object({
    displayName: z.string().min(2),
    description: z.string().optional(),
    phoneNumbers: z.array(PhoneNumberSchema).min(1),
    email: z.string().email().optional().or(z.literal('')),
    socialLinks: z.array(SocialLinkSchema).optional(),
    website: z.string().url().optional().or(z.literal('')),
})

export const UpdateBusinessContactSchema = CreateBusinessContactSchema.partial().extend({
    isActive: z.boolean().optional(),
})

export const BusinessContactQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
})

export type CreateBusinessContactDTO = z.infer<typeof CreateBusinessContactSchema>
export type UpdateBusinessContactDTO = z.infer<typeof UpdateBusinessContactSchema>
export type BusinessContactQueryDTO = z.infer<typeof BusinessContactQuerySchema>
