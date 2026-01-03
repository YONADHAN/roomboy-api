import { createSlug } from '@/utils/slug.utils.js'
import { LocationRepository } from '@/repositories/location.repository.js'
import {
  CreateLocationDTO,
  UpdateLocationDTO,
  LocationQueryDTO,
} from '@/validations/location.validation.js'
import { ILocation } from '@/models/location.model.js'

const locationRepo = new LocationRepository()

export class LocationService {
  async create(data: CreateLocationDTO): Promise<ILocation> {
    const slug = createSlug(`${data.name} ${data.city}`)

    return await locationRepo.createLocation({
      ...data,
      slug,
    })
  }

  async getAll(query: LocationQueryDTO) {
    return await locationRepo.getLocations(query)
  }

  async getById(id: string): Promise<ILocation | null> {
    return await locationRepo.getLocationById(id)
  }

  async update(id: string, data: UpdateLocationDTO): Promise<ILocation | null> {
    return await locationRepo.updateLocation(id, data)
  }

  async toggleStatus(id: string): Promise<ILocation | null> {
    const location = await locationRepo.getLocationById(id)
    if (!location) return null

    return await locationRepo.updateLocation(id, {
      isActive: !location.isActive,
    })
  }
}
