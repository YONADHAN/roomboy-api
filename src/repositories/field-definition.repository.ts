import { FieldDefinitionModel, IFieldDefinition } from '@/models/field-definition.model.js'
import { CreateFieldDefinitionDTO, UpdateFieldDefinitionDTO, FieldDefinitionQueryDTO } from '@/validations/field-definition.validation.js'

export class FieldDefinitionRepository {
    async create(data: CreateFieldDefinitionDTO): Promise<IFieldDefinition> {
        const fieldDefinition = new FieldDefinitionModel(data)
        return await fieldDefinition.save()
    }

    async findById(id: string): Promise<IFieldDefinition | null> {
        return await FieldDefinitionModel.findById(id)
    }

    async findAll(query: FieldDefinitionQueryDTO) {
        const { entityType, isActive, page, limit } = query

        const filter: Record<string, unknown> = {}

        if (entityType) {
            filter.entityType = entityType
        }

        if (isActive !== undefined) {
            filter.isActive = isActive
        }

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            FieldDefinitionModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            FieldDefinitionModel.countDocuments(filter),
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

    async update(id: string, data: UpdateFieldDefinitionDTO): Promise<IFieldDefinition | null> {
        return await FieldDefinitionModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        )
    }

    async toggleStatus(id: string): Promise<IFieldDefinition | null> {
        const fieldDefinition = await FieldDefinitionModel.findById(id)
        if (!fieldDefinition) return null

        fieldDefinition.isActive = !fieldDefinition.isActive
        return await fieldDefinition.save()
    }

    async existsByEntityTypeAndFieldKey(entityType: string, fieldKey: string): Promise<boolean> {
        const count = await FieldDefinitionModel.countDocuments({ entityType, fieldKey })
        return count > 0
    }
}
