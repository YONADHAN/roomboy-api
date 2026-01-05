import { PropertyModel, IProperty } from '@/models/property.model.js'
import { CreatePropertyDTO, UpdatePropertyDTO, PropertyQueryDTO } from '@/validations/property.validation.js'

export class PropertyRepository {
    async create(data: CreatePropertyDTO): Promise<IProperty> {
        const property = new PropertyModel({
            ...data,
            entityType: 'property',
        })
        return await property.save()
    }

    async findById(id: string): Promise<IProperty | null> {
        return await PropertyModel.findOne({ _id: id, isDeleted: false })
    }

    async findAll(query: PropertyQueryDTO) {
        const { status, city, search, page, limit } = query

        const filter: Record<string, unknown> = { isDeleted: false }

        if (status) {
            filter.status = status
        }

        if (city) {
            filter['location.city'] = city
        }

        if (search) {
            filter.$text = { $search: search }
        }

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            PropertyModel.find(filter)
                .populate('location', 'name city slug')
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

    async update(id: string, data: UpdatePropertyDTO): Promise<IProperty | null> {
        return await PropertyModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true, runValidators: true }
        )
    }

    async updateStatus(id: string, status: 'active' | 'blocked' | 'pending'): Promise<IProperty | null> {
        return await PropertyModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { status } },
            { new: true }
        )
    }

    async softDelete(id: string): Promise<IProperty | null> {
        return await PropertyModel.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        )
    }
}
