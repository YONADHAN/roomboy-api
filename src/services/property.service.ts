import { PropertyRepository } from '@/repositories/property.repository.js'
import { DynamicAttributeValidationService } from '@/services/dynamic-attribute-validation.service.js'
import { CreatePropertyDTO, UpdatePropertyDTO, PropertyQueryDTO } from '@/validations/property.validation.js'
import { IProperty } from '@/models/property.model.js'

export class PropertyService {
    private repository: PropertyRepository
    private attributeValidator: DynamicAttributeValidationService

    constructor() {
        this.repository = new PropertyRepository()
        this.attributeValidator = new DynamicAttributeValidationService()
    }

    async create(data: CreatePropertyDTO): Promise<IProperty> {
        // Validate dynamic attributes using DynamicAttributeValidationService
        await this.attributeValidator.validate('property', data.attributes || {})

        return await this.repository.create(data)
    }

    async getAll(query: PropertyQueryDTO) {
        return await this.repository.findAll(query)
    }

    async getById(id: string): Promise<IProperty | null> {
        return await this.repository.findById(id)
    }

    async update(id: string, data: UpdatePropertyDTO): Promise<IProperty> {
        const property = await this.repository.findById(id)
        if (!property) {
            throw new Error('Property not found')
        }

        // If attributes are being updated, validate them
        if (data.attributes) {
            await this.attributeValidator.validate('property', data.attributes)
        }

        const updated = await this.repository.update(id, data)
        if (!updated) {
            throw new Error('Failed to update property')
        }

        return updated
    }

    async updateStatus(id: string, status: 'active' | 'blocked' | 'pending'): Promise<IProperty> {
        const property = await this.repository.findById(id)
        if (!property) {
            throw new Error('Property not found')
        }

        const updated = await this.repository.updateStatus(id, status)
        if (!updated) {
            throw new Error('Failed to update property status')
        }

        return updated
    }

    async delete(id: string): Promise<IProperty> {
        const property = await this.repository.findById(id)
        if (!property) {
            throw new Error('Property not found')
        }

        const deleted = await this.repository.softDelete(id)
        if (!deleted) {
            throw new Error('Failed to delete property')
        }

        return deleted
    }
}
