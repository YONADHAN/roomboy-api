import { FieldDefinitionRepository } from '@/repositories/field-definition.repository.js'
import { CreateFieldDefinitionDTO, UpdateFieldDefinitionDTO, FieldDefinitionQueryDTO } from '@/validations/field-definition.validation.js'
import { IFieldDefinition } from '@/models/field-definition.model.js'

export class FieldDefinitionService {
    private repository: FieldDefinitionRepository

    constructor() {
        this.repository = new FieldDefinitionRepository()
    }

    async create(data: CreateFieldDefinitionDTO): Promise<IFieldDefinition> {
        // Check for duplicate entityType + fieldKey
        const exists = await this.repository.existsByEntityTypeAndFieldKey(
            data.entityType,
            data.fieldKey
        )

        if (exists) {
            throw new Error(
                `Field definition with entityType "${data.entityType}" and fieldKey "${data.fieldKey}" already exists`
            )
        }

        return await this.repository.create(data)
    }

    async getAll(query: FieldDefinitionQueryDTO) {
        return await this.repository.findAll(query)
    }

    async getById(id: string): Promise<IFieldDefinition | null> {
        return await this.repository.findById(id)
    }

    async update(id: string, data: UpdateFieldDefinitionDTO): Promise<IFieldDefinition> {
        // Enforce fieldKey immutability - this is already handled by validation schema
        // but we add an extra check here for safety
        if ('fieldKey' in data) {
            throw new Error('Field key cannot be modified after creation')
        }

        const fieldDefinition = await this.repository.findById(id)
        if (!fieldDefinition) {
            throw new Error('Field definition not found')
        }

        // If updating to select/multi-select, validate current dataType compatibility
        if (data.dataType && (data.dataType === 'select' || data.dataType === 'multi-select')) {
            if (!data.options || data.options.length === 0) {
                throw new Error('Options are required for select and multi-select data types')
            }
        }

        const updated = await this.repository.update(id, data)
        if (!updated) {
            throw new Error('Failed to update field definition')
        }

        return updated
    }

    async toggleStatus(id: string): Promise<IFieldDefinition> {
        const fieldDefinition = await this.repository.toggleStatus(id)
        if (!fieldDefinition) {
            throw new Error('Field definition not found')
        }
        return fieldDefinition
    }

    async delete(id: string): Promise<IFieldDefinition> {
        const fieldDefinition = await this.repository.softDelete(id)
        if (!fieldDefinition) {
            throw new Error('Field definition not found')
        }
        return fieldDefinition
    }
}
