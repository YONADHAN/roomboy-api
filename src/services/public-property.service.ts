import { PublicPropertyRepository, IPublicProperty } from '@/repositories/public-property.repository.js'
import { LocationRepository } from '@/repositories/location.repository.js'
import { PublicPropertyQueryDTO } from '@/validations/public-property.validation.js'
import { IProperty } from '@/models/property.model.js'
import { IFieldDefinition } from '@/models/field-definition.model.js'

export class PublicPropertyService {
    private repository: PublicPropertyRepository
    private locationRepository: LocationRepository

    constructor() {
        this.repository = new PublicPropertyRepository()
        this.locationRepository = new LocationRepository()
    }

    async getAll(query: PublicPropertyQueryDTO, allQueryParams: Record<string, any>) {
        // Extract dynamic attribute filters from query params
        const dynamicFilters: Record<string, any> = {}
        const knownParams = ['city', 'locality', 'search', 'page', 'limit', 'location']

        for (const [key, value] of Object.entries(allQueryParams)) {
            if (!knownParams.includes(key) && value !== undefined) {
                dynamicFilters[key] = value
            }
        }

        if (query.location) {
            const locationDoc = await this.locationRepository.getLocationBySlug(query.location)
            if (locationDoc) {
                dynamicFilters.locationId = locationDoc._id
            }
        }

        // We no longer need to look up locationId. Repository handles "location" slug logic directly.
        return await this.repository.findAll(query, dynamicFilters)
    }

    async getById(id: string): Promise<IPublicProperty | null> {
        return await this.repository.findById(id)
    }

    async getBySlug(slug: string): Promise<IPublicProperty | null> {
        return await this.repository.findBySlug(slug)
    }

    async getFieldDefinitions(entityType: string): Promise<IFieldDefinition[]> {
        return await this.repository.findActiveFieldDefinitions(entityType)
    }
}
