import { PropertyModel, IProperty } from '@/models/property.model.js'
import { FieldDefinitionModel, IFieldDefinition } from '@/models/field-definition.model.js'
import { PublicPropertyQueryDTO } from '@/validations/public-property.validation.js'

export class PublicPropertyRepository {
    async findById(id: string): Promise<IProperty | null> {
        return await PropertyModel.findOne({
            _id: id,
            status: 'active',
            isDeleted: false,
        }).lean()
    }

    async findBySlug(slug: string): Promise<IProperty | null> {
        // Assuming slug is stored in attributes or we need to generate it from title
        // For now, we'll search by propertyId as slug
        return await PropertyModel.findOne({
            propertyId: slug,
            status: 'active',
            isDeleted: false,
        }).lean()
    }

    async findAll(query: PublicPropertyQueryDTO, dynamicFilters: Record<string, any> = {}) {
        const { city, locality, search, page, limit } = query

        const filter: Record<string, unknown> = {
            status: 'active',
            isDeleted: false,
        }

        if (city) {
            filter['location.city'] = city
        }

        if (locality) {
            filter['location.locality'] = locality
        }

        if (search) {
            filter.$text = { $search: search }
        }

        // Apply dynamic attribute filters
        // Example: monthly_rent_min=10000 becomes attributes.monthly_rent: { $gte: 10000 }
        for (const [key, value] of Object.entries(dynamicFilters)) {
            if (key.endsWith('_min')) {
                const fieldKey = key.replace('_min', '')
                filter[`attributes.${fieldKey}`] = {
                    ...((filter[`attributes.${fieldKey}`] as any) || {}),
                    $gte: Number(value)
                }
            } else if (key.endsWith('_max')) {
                const fieldKey = key.replace('_max', '')
                filter[`attributes.${fieldKey}`] = {
                    ...((filter[`attributes.${fieldKey}`] as any) || {}),
                    $lte: Number(value)
                }
            } else {
                // Exact match for other dynamic attributes
                filter[`attributes.${key}`] = value
            }
        }

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            PropertyModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            PropertyModel.countDocuments(filter),
        ])

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async findActiveFieldDefinitions(entityType: string): Promise<IFieldDefinition[]> {
        return await FieldDefinitionModel.find({
            entityType,
            isActive: true,
        })
            .select('-__v')
            .sort({ createdAt: 1 })
            .lean()
    }
}
