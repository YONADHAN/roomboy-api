import { PublicPropertyRepository } from '@/repositories/public-property.repository.js'
import { PublicPropertyQueryDTO } from '@/validations/public-property.validation.js'
import { IProperty } from '@/models/property.model.js'
import { IFieldDefinition } from '@/models/field-definition.model.js'

export class PublicPropertyService {
    private repository: PublicPropertyRepository

    constructor() {
        this.repository = new PublicPropertyRepository()
    }

    async getAll(query: PublicPropertyQueryDTO, allQueryParams: Record<string, any>) {
        // Extract dynamic attribute filters from query params
        const dynamicFilters: Record<string, any> = {}
        const knownParams = ['city', 'locality', 'search', 'page', 'limit']

        for (const [key, value] of Object.entries(allQueryParams)) {
            if (!knownParams.includes(key) && value !== undefined) {
                dynamicFilters[key] = value
            }
        }

        return await this.repository.findAll(query, dynamicFilters)
    }

    async getById(id: string): Promise<IProperty | null> {
        return await this.repository.findById(id)
    }

    async getBySlug(slug: string): Promise<IProperty | null> {
        return await this.repository.findBySlug(slug)
    }

    async getFieldDefinitions(entityType: string): Promise<IFieldDefinition[]> {
        return await this.repository.findActiveFieldDefinitions(entityType)
    }
}
