import { z } from 'zod'

// Validation for fieldKey: lowercase, alphanumeric, underscore only
const fieldKeyRegex = /^[a-z0-9_]+$/

export const CreateFieldDefinitionSchema = z.object({
    entityType: z.enum(['property', 'product', 'service']),
    fieldKey: z
        .string()
        .min(1, 'Field key is required')
        .regex(fieldKeyRegex, 'Field key must be lowercase, alphanumeric, and underscore only'),
    label: z.string().min(1, 'Label is required'),
    dataType: z.enum(['string', 'number', 'boolean', 'select', 'multi-select']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    rules: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
            regex: z.string().optional(),
        })
        .optional(),
    isActive: z.boolean().default(true),
})
    .refine(
        (data) => {
            // If dataType is select or multi-select, options must be provided
            if (data.dataType === 'select' || data.dataType === 'multi-select') {
                return data.options && data.options.length > 0
            }
            return true
        },
        {
            message: 'Options are required for select and multi-select data types',
            path: ['options'],
        }
    )

export const UpdateFieldDefinitionSchema = z.object({
    // fieldKey is NOT allowed in updates (immutable)
    label: z.string().min(1).optional(),
    dataType: z.enum(['string', 'number', 'boolean', 'select', 'multi-select']).optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    rules: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
            regex: z.string().optional(),
        })
        .optional(),
    isActive: z.boolean().optional(),
})
    .refine(
        (data) => {
            // If dataType is being updated to select/multi-select, ensure options exist
            if (data.dataType === 'select' || data.dataType === 'multi-select') {
                return data.options && data.options.length > 0
            }
            return true
        },
        {
            message: 'Options are required when updating to select or multi-select data types',
            path: ['options'],
        }
    )

export const FieldDefinitionQuerySchema = z.object({
    entityType: z.enum(['property', 'product', 'service']).optional(),
    isActive: z
        .string()
        .optional()
        .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
})

export type CreateFieldDefinitionDTO = z.infer<typeof CreateFieldDefinitionSchema>
export type UpdateFieldDefinitionDTO = z.infer<typeof UpdateFieldDefinitionSchema>
export type FieldDefinitionQueryDTO = z.infer<typeof FieldDefinitionQuerySchema>
