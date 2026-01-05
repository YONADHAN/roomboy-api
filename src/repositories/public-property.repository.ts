import { PropertyModel, IPropertyBase } from '@/models/property.model.js'
import { FieldDefinitionModel, IFieldDefinition } from '@/models/field-definition.model.js'
import { PublicPropertyQueryDTO } from '@/validations/public-property.validation.js'

export interface IPublicProperty extends Omit<IPropertyBase, 'location'> {
    price: number
    mainImage: string
    location: {
        city: string
        address: string
    }
}

export class PublicPropertyRepository {
    async findById(id: string): Promise<IPublicProperty | null> {
        const property = await PropertyModel.findOne({
            _id: id,
            status: 'active',
            isDeleted: false,
        }).lean()

        if (!property) return null

        return {
            ...property,
            price: property.attributes?.price || property.attributes?.rent || 0,
            location: {
                city: property.address?.city || '',
                address: property.address?.street || '',
            },
            mainImage: property.images?.[0] || '',
        }
    }

    async findBySlug(slug: string): Promise<IPublicProperty | null> {
        // Assuming slug is stored in attributes or we need to generate it from title
        // For now, we'll search by propertyId as slug
        const property = await PropertyModel.findOne({
            propertyId: slug,
            status: 'active',
            isDeleted: false,
        }).lean()

        if (!property) return null

        return {
            ...property,
            price: property.attributes?.price || property.attributes?.rent || 0,
            location: {
                city: property.address?.city || '',
                address: property.address?.street || '',
            },
            mainImage: property.images?.[0] || '',
        }
    }

    async findAll(query: PublicPropertyQueryDTO, dynamicFilters: Record<string, any> = {}) {
        const { search, page, limit } = query
        const locationSlug = query.location

        const filter: Record<string, unknown> = {
            status: 'active',
            isDeleted: { $ne: true },
        }

        // 1. Search Logic ($or regex)
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' }
            filter.$or = [
                { title: searchRegex },
                { 'address.city': searchRegex },
                { 'address.locality': searchRegex }
            ]
        }

        // 2. Location Logic (ID Lookup + Text Split & Match)
        if (locationSlug || dynamicFilters.locationId) {
            const locOrConditions: Record<string, any>[] = []

            // A. ID Match (Primary)
            if (dynamicFilters.locationId) {
                locOrConditions.push({ location: dynamicFilters.locationId })
                delete dynamicFilters.locationId // Clean up
            }

            // B. Text Match (Fallback / Broad)
            if (locationSlug) {
                // e.g. "kakkanad-kochi" -> "kakkanad", "kochi"
                const parts = locationSlug.split('-').filter(Boolean)
                if (parts.length > 0) {
                    const locationRegex = { $regex: parts.join('|'), $options: 'i' }
                    locOrConditions.push({ 'address.city': locationRegex })
                    locOrConditions.push({ 'address.locality': locationRegex })
                }
            }

            if (locOrConditions.length > 0) {
                const locQuery = { $or: locOrConditions }

                // Combine with existing $or from search if present, using $and
                if (filter.$or) {
                    filter.$and = [locQuery]
                } else {
                    Object.assign(filter, locQuery)
                }
            }
        }

        // 3. Price Filter (min_rent / max_rent)
        // These come from dynamicFilters usually, or we should extract them explicitly if passed in query
        if (dynamicFilters.min_rent || dynamicFilters.max_rent) {
            const priceQuery: Record<string, number> = {}
            if (dynamicFilters.min_rent) priceQuery.$gte = Number(dynamicFilters.min_rent)
            if (dynamicFilters.max_rent) priceQuery.$lte = Number(dynamicFilters.max_rent)

            filter['attributes.monthly_rent'] = priceQuery

            // Clean up from dynamic to avoid double processing
            delete dynamicFilters.min_rent
            delete dynamicFilters.max_rent
        }

        // 4. Array Fields & Other Attributes
        for (const [key, value] of Object.entries(dynamicFilters)) {
            // Skip if value is undefined/empty
            if (value === undefined || value === '') continue

            if (key === 'preferred_tenants') {
                // Ensure value is array
                const tenants = Array.isArray(value) ? value : [value]
                filter['attributes.preferred_tenants'] = { $in: tenants }
            } else if (key === 'amenities') {
                // Amenities: { $all: values }
                const amenityList = Array.isArray(value) ? value : [value]
                filter['attributes.amenities'] = { $all: amenityList }
            } else {
                // Exact match for others (property_type, room_type, furnishing_status)
                // If array passed, use $in, otherwise exact
                if (Array.isArray(value)) {
                    filter[`attributes.${key}`] = { $in: value }
                } else {
                    filter[`attributes.${key}`] = value
                }
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
            data: data.map(item => ({
                ...item,
                price: item.attributes?.monthly_rent || 0, // Ensure mapping is correct per requirement
                location: {
                    city: item.address?.city || '',
                    address: item.address?.locality || '', // Mapping locality to address field in response
                },
                mainImage: item.images?.[0] || '',
            })) as IPublicProperty[],
            meta: { // Changed from pagination to meta as per "API Response (LOCKED)"
                total,
                page: Number(page),
                limit: Number(limit),
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
