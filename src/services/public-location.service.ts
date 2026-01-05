
import { LocationRepository } from '@/repositories/location.repository.js'
import { ILocation } from '@/models/location.model.js'

export interface PublicLocationDTO {
    locationId: string
    name: string
    slug: string
    city: string
    state: string
}

export class PublicLocationService {
    private repository: LocationRepository

    constructor() {
        this.repository = new LocationRepository()
    }

    async getAll(): Promise<PublicLocationDTO[]> {
        // Reuse existing repository method with public-safe filters
        const result = await this.repository.getLocations({
            page: 1,
            limit: 100, // Reasonable default for a dropdown or list
            isActive: true,
            isDeleted: false,
        })

        // Map to safe DTO
        return result.data.map((loc: ILocation) => ({
            locationId: loc._id.toString(), // Assuming _id is the ID, or custom publicId
            name: loc.name,
            slug: loc.slug,
            city: loc.city,
            state: loc.state,
        }))
    }
}
